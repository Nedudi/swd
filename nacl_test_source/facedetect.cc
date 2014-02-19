#include <cstdio>
#include <cstring>
#include <string>
#include <fstream>
#include <sstream>
#include <stdio.h>
#include <math.h>
#include <ppapi/cpp/instance.h>
#include <ppapi/cpp/module.h>
#include <ppapi/cpp/var.h>

#include <naclmounts/base/Mount.h>
#include <naclmounts/base/MountManager.h>
#include <naclmounts/memory/MemMount.h>

#include "facedetect.h"
#include "geturl_handler.h"

/********************************************************************************
 *
 ********************************************************************************/

char *crvImgByteOffset(const IplImage *img, int x, int y) {
	switch (img->depth) {
    case IPL_DEPTH_8U:
      return (char *)((uintptr_t) img->imageData + x + (y * img->widthStep));
    case IPL_DEPTH_16U:
      return (char *)((uintptr_t) img->imageData + x * 2 + (y * img->widthStep));
    default: assert (0);
	}

	return NULL;
}

void crvGetROILimits(const IplImage *img, int &xIni, int &yIni, int &xLim, int &yLim) {
	if(img->roi == NULL) {
		xIni = 0;
		yIni = 0;
		xLim = img->width;
		yLim = img->height;
	} else {
		xIni = img->roi->xOffset;
		yIni = img->roi->yOffset;
		xLim = xIni + img->roi->width;
		yLim = yIni + img->roi->height;

		if(xIni < 0) xIni= 0;
		if(yIni < 0) yIni= 0;
		if(xLim > img->width) xLim= img->width;
		if(yLim > img->height) yLim= img->height;
	}
}

void crvHistogram(IplImage *srcImg, int *his) {
	int x, y, xIni, yIni, xLim, yLim;
	unsigned char *pSrc= (unsigned char *)srcImg->imageData;

	crvGetROILimits(srcImg, xIni, yIni, xLim, yLim);

	for(x = 0; x < 256; ++x) {
	  his[x] = 0;
	}

	for(y = yIni; y < yLim; ++y) {
		pSrc = (unsigned char *)crvImgByteOffset(srcImg, xIni, y);
		for(x = xIni; x < xLim; ++x) {
			his[*pSrc]++;
			pSrc++;
		}
	}
}

void crvLUTTransform(IplImage *srcImg, IplImage *dstImg, unsigned char *lut) {
  int x, y, xIni, yIni, xLim, yLim;
  unsigned char *pSrc = (unsigned char *)srcImg->imageData;
  unsigned char *pDst = (unsigned char *)dstImg->imageData;

  crvGetROILimits(srcImg, xIni, yIni, xLim, yLim);

  for(y = yIni; y < yLim; ++y) {
    pSrc = (unsigned char *) crvImgByteOffset(srcImg, xIni, y);
    pDst = (unsigned char *) crvImgByteOffset(dstImg, xIni, y);
    for(x = xIni; x < xLim; ++x) {
      *pDst = lut[*pSrc];
      pSrc++;
      pDst++;
    }
  }
}

bool crvHistogramBeginEnd(int *his, unsigned char &begin, unsigned char &end) {
	int i;

	for(i = 0; i < 256; ++i) {
		if(his[i] > 0) {
			begin = (unsigned char)i;
			break;
		}
	}

	if(i == 256) {
	  return false;
	}

	for(i = 255; i >= 0; --i) {
		if(his[i] > 0) {
			end = (unsigned char)i;
			break;
		}
	}
	return true;
}

int crvNormalizeHistogram(int *his, unsigned char *lut, unsigned char minRange) {
	int i, range;
	unsigned char min, max;

	if(!crvHistogramBeginEnd(his, min, max)) {
	  return 0;
	}
	if(min == max) {
	  return 0;
	}

	range = max - min;
	if(range < minRange) {
	  range= minRange;
	}

	for(i = min; i <= max; ++i) {
		lut[i] = (unsigned char)(((int) (i - min) * 255) / range);
	}

	return max - min;
}

void *crvImgOffset(const IplImage *img, int x, int y) {
	switch(img->depth) {
    case IPL_DEPTH_8U:
    case IPL_DEPTH_8S:
      return (void *)((uintptr_t)img->imageData + x * img->nChannels + (y * img->widthStep));
    case IPL_DEPTH_16U:
    case IPL_DEPTH_16S:
      return (void *)((uintptr_t)img->imageData + x * 2 + (y * img->widthStep));
    case IPL_DEPTH_32S:
    case IPL_DEPTH_32F:
      return (void *)((uintptr_t)img->imageData + x * 4 + (y * img->widthStep));
    default:
      break;
	}

	return NULL;
}

#define COMP_MATRIX_WIDTH	15
#define COMP_MATRIX_HEIGHT	15
typedef float TAnalisysMatrix[COMP_MATRIX_WIDTH][COMP_MATRIX_HEIGHT];

void MatrixMeanImageCells(IplImage *pImg, TAnalisysMatrix &m) {
	int x, y, mx, my, xCount, yCount, xIni, yIni, xLim, yLim;
	float *pSrc;

	// Limits where function should be applied
	crvGetROILimits(pImg, xIni, yIni, xLim, yLim);

	float compBoxWidth = ((float)(xLim - xIni + 1)) / COMP_MATRIX_WIDTH;
	int iCompBoxWidth = (int)compBoxWidth;
	float compBoxHeight = ((float)(yLim - yIni + 1)) / COMP_MATRIX_HEIGHT;
	int iCompBoxHeight = (int)compBoxHeight;

	for(my = 0; my < COMP_MATRIX_HEIGHT; ++my) {
		for(mx = 0; mx < COMP_MATRIX_WIDTH; ++mx) {
			m[mx][my] = 0.0f;

			y = yIni + (int)((float)my * compBoxHeight);
			for (yCount= 0; yCount< iCompBoxHeight; ++yCount) {
				x= xIni + (int) ((float)mx * compBoxWidth);
				pSrc = (float *)crvImgOffset(pImg, x, y);

				for(xCount = 0; xCount < iCompBoxWidth; ++xCount) {
					m[mx][my] += *pSrc;
					++pSrc;
				}
				m[mx][my] /= (float)(iCompBoxWidth * iCompBoxHeight);
				++y;
			}
		}
	}
}

/********************************************************************************
 *
 ********************************************************************************/

facedetectInstance::facedetectInstance(PP_Instance instance) : pp::Instance(instance) {
  this->width = 0;
  this->height = 0;
  this->frame = NULL;
  this->_fx = 0;
  this->_fy = 0;
  this->_fw = 0;
  this->_fh = 0;
}

facedetectInstance::~facedetectInstance() {
}

// Read first AJAX call to and parse the string to get the data (src of the
// image, width, height) 
void facedetectInstance::HandleMessage(const pp::Var& var_message) {

  if(var_message.pp_var().type == 5) {
    stringstream convert;
    string data = var_message.AsString();
    convert << data.substr(0, data.find_first_of('|'));
    convert >> this->width;
    stringstream convert2;
    convert2 << data.substr(data.find_first_of('|')+1, data.length());
    convert2 >> this->height;
    this->PostMessage(pp::Var("params"));
  } else if(var_message.pp_var().type == 9) {
    if(!this->width || !this->height) {
      this->PostMessage(pp::Var("no params"));
    }
    this->PrepareNewImageFromMessage(var_message);
  } else {
    this->PostMessage(pp::Var("error"));
  }
}

void facedetectInstance::PrepareNewImageFromMessage(const pp::Var& var_message) {
  if(!this->frame) {
    this->frame = new CFImage();
    this->frame->Create(this->width, this->height, IPL_DEPTH_8U, "RGB");
  }

  pp::VarArrayBuffer pBuff = pp::VarArrayBuffer(var_message);
  uint32_t len = pBuff.ByteLength();
  uint8_t *data = (uint8_t*)pBuff.Map();

  unsigned int x,y;
  uint8_t* dstRow;
  for(y = 0; y < this->height; ++y) {
    dstRow = (uint8_t*)this->frame->ptr()->imageData + this->frame->ptr()->widthStep * y;
    for(x = 0; x < this->width; ++x) {
      dstRow[x*3+2] = data[x*4 + this->width*y*4+0];
      dstRow[x*3+1] = data[x*4 + this->width*y*4+1];
      dstRow[x*3+0] = data[x*4 + this->width*y*4+2];
    }
  }

  pBuff.Unmap();

  // if XML classifier has already been loaded, skip it
  if(this->classifierCreated == true){
    this->RecognizeFace();
  } else {
    // get xml file
    this->handler = GetURLHandler::Create(this, "haarcascade_frontalface_alt.xml");
    this->handler->file = GetURLHandler::URL_XML;
    if(this->handler != NULL){
      this->handler->Start();
    }
  }
}

void facedetectInstance::HandleXml(const string& content) {
  const char* cascadefilename = "/haarcascade_frontalface_alt.xml";
  this->CreateMemFile(content, cascadefilename);
  this->RecognizeFace();
}

void facedetectInstance::CreateMemFile(const string& content, const string& filename){
  // stream message for debugging
  stringstream ss;
  // test filesys module of nacl-mount to add xml file
  MountManager *mm = MountManager::MMInstance();
  KernelProxy* kp = MountManager::MMInstance()->kp();
  MemMount *mnt = new MemMount();
  mm->AddMount(mnt, "/");
  int fd = kp->open(filename, O_WRONLY | O_CREAT, 0644);
  if(fd == -1){
        fprintf(stderr, "Error creating cascade classifier\n");
    return;
  }
  kp->write(fd, content.c_str(), content.size());
  kp->close(fd);
  this->classifierCreated = true;

  // TEST LOADING THE XML FILE FROM THE MEM STORAGE
  // load xml face cascade to detect face
  FileStorage fs(filename, FileStorage::READ);
  bool ok = fs.open(filename, FileStorage::READ);
  if(!fs.isOpened()) {
    fprintf(stderr, "Failed opening cascade..\n");
  }
  fs.getFirstTopLevelNode();
  FileNode t = fs.getFirstTopLevelNode();
  fs.release();
}

void facedetectInstance::RecognizeFace(){

  if(!this->face_cascade) {
    const char* cascadeFilename = "/haarcascade_frontalface_alt.xml";
    this->face_cascade = new CascadeClassifier();
    face_cascade->load(cascadeFilename);
    if(!face_cascade->load(cascadeFilename)){
      fprintf(stderr, "Error loading cascade classifier\n");
      return;
    }
  }

  static std::vector<Rect> faces;
  static Mat frame_gray;

  cvtColor(Mat(this->frame->ptr()), frame_gray, CV_BGR2GRAY );
  equalizeHist(frame_gray, frame_gray);

  //-- Detect faces
//  this->face_cascade->detectMultiScale(frame_gray, faces, 1.1, 2, CV_HAAR_DO_CANNY_PRUNING, Size(65, 65));
  this->face_cascade->detectMultiScale(frame_gray, faces, 1.1, 2, CV_HAAR_SCALE_IMAGE, Size(65, 65));
  if(faces.size() > 0) {
    this->_fx = faces[0].x;
    this->_fy = faces[0].y;
    this->_fw = faces[0].width;
    this->_fh = faces[0].height;
  }

  this->DetectMotion();
}

void facedetectInstance::DetectMotion() {
  if(!this->_fw || !this->_fh) {
    this->PostMessage(pp::Var("[]"));
    return;
  }
	static float xVel, yVel;

  static Mat *oldMat;
  static Mat *newMat;
  if(!oldMat) {
    oldMat = new Mat();
    cvtColor(Mat(this->frame->ptr()), *oldMat, CV_BGR2GRAY);
    this->PostMessage(pp::Var("[]"));
    return;
  }
  if(!newMat) {
    newMat = new Mat();
  }
  cvtColor(Mat(this->frame->ptr()), *newMat, CV_BGR2GRAY);

  double pyr_scale = 0.5;
  int levels = 3;
  int winsize = 8; //40
  int iterations = 10; //30
  int poly_n = 5;
  double poly_sigma = 1.1; //1
  int flags = 0;

  Mat flow = Mat(oldMat->size(), CV_32FC2);
  calcOpticalFlowFarneback(*oldMat, *newMat, flow, pyr_scale, levels, winsize, iterations, poly_n, poly_sigma, flags);
  (*oldMat) = (*newMat).clone();

  int y, x, cc = 0;
  float sx,sy,sl;
	float velModulusMax = 0;
	int cellW = 15;
	int cellH = 15;
	int stepW = (int)(this->_fw / cellW);
	int stepH = (int)(this->_fh / cellH);
	if(stepW < 1) {
	  stepW = 1;
	}
	if(stepH < 1) {
	  stepH = 1;
	}
	int startX = (int)(this->_fx + this->_fw/2 - (stepW*cellW)/2);
	int startY = (int)(this->_fy + this->_fh/2 - (stepH*cellH)/2);

	// Compute modulus for every motion cell
  for(y = 0; y < cellH; ++y) {
    for(x = 0; x < cellW; ++x) {
      const cv::Point2f& fxy = flow.at<cv::Point2f>(startY + y*stepH, startX + x*stepW);
      sl = fxy.x * fxy.x + fxy.y * fxy.y;
      if(velModulusMax < sl) {
        velModulusMax = sl;
      }
		}
	}

  for(y = 0; y < cellH; ++y) {
    for(x = 0; x < cellW; ++x) {
      const cv::Point2f& fxy = flow.at<cv::Point2f>(startY + y*stepH, startX + x*stepW);
      sl = fxy.x * fxy.x + fxy.y * fxy.y;
      if(sl > (0.05 * velModulusMax)) {
         sx += fxy.x;
         sy += fxy.y;
         ++cc;
       }
    }
  }
  xVel = sx;
  yVel = sy;

	int cellArea= (this->width * this->height) / (cellW * cellH);
	if(cellArea == 0) {
	  cellArea = 1;
	}
	int minValidCells = (3000 / cellArea);
	if(cc < minValidCells) {
	  cc = minValidCells;
	}

	// Compute speed
	xVel= - (xVel / (float)cc);
	yVel= (yVel / (float)cc);

//  xVel = sx / cc;
//  yVel = sy / cc;

//  for(int y = 0; y < cflowmap.rows; y += step)
//      for(int x = 0; x < cflowmap.cols; x += step)
//      {
//          const cv::Point2f& fxy = flow.at<cv::Point2f>(y, x);
//          cv::line(cflowmap, cv::Point(x,y), cv::Point(cvRound(x+fxy.x),cvRound(y+fxy.y)), color);
//          cv::circle(cflowmap, cv::Point(x,y), 2, color, -1);
//      }

/*
  static CFImage *oldFrame;
  static CFImage *newFrame;
  if(!oldFrame) {
    oldFrame = new CFImage(this->frame->ptr());
    this->PostMessage(pp::Var("[]"));
    return;
  }
  if(!newFrame) {
    newFrame = new CFImage();
    newFrame->Create(this->width, this->height, IPL_DEPTH_8U, "GRAY");
  }
  newFrame->Import(this->frame->ptr());

  static CFImage *oldFrameGray;
  static CFImage *newFrameGray;
  if(!oldFrameGray) {
    oldFrameGray = new CFImage();
    oldFrameGray->Create(this->width, this->height, IPL_DEPTH_8U, "GRAY");
  }
  if(!newFrameGray) {
    newFrameGray = new CFImage();
    newFrameGray->Create(this->width, this->height, IPL_DEPTH_8U, "GRAY");
  }

  static CFImage *pImgVelX;
  static CFImage *pImgVelY;
  if(!pImgVelX) {
    pImgVelX = new CFImage();
    pImgVelX->Create(this->width, this->height, IPL_DEPTH_32F, "GRAY");
  }
  if(!pImgVelY) {
    pImgVelY = new CFImage();
    pImgVelY->Create(this->width, this->height, IPL_DEPTH_32F, "GRAY");
  }

  int his[256];
  unsigned char m_prevLut[256];
  int range;

  crvHistogram(this->frame->ptr(), his);
  range = crvNormalizeHistogram(his, m_prevLut, 50);

  crvLUTTransform(oldFrame->ptr(), oldFrameGray->ptr(), m_prevLut);
  crvLUTTransform(newFrame->ptr(), newFrameGray->ptr(), m_prevLut);

	// Compute optical flow
	CvTermCriteria term;
	term.type = CV_TERMCRIT_ITER;
	term.max_iter = 6;
  cvCalcOpticalFlowHS((CvArr*)oldFrameGray->ptr(), (CvArr*)newFrameGray->ptr(), 0, (CvArr*)pImgVelX->ptr(), (CvArr*)pImgVelY->ptr(), 0.001, term);

  static TAnalisysMatrix velXMatrix, velYMatrix, velModulusMatrix;

	MatrixMeanImageCells(pImgVelX->ptr(), velXMatrix);
	MatrixMeanImageCells(pImgVelY->ptr(), velYMatrix);

	int x, y;
	float velModulusMax = 0;

	// Compute modulus for every motion cell
	for(x = 0; x < COMP_MATRIX_WIDTH; ++x) {
		for(y = 0; y < COMP_MATRIX_HEIGHT; ++y) {
			velModulusMatrix[x][y] = (velXMatrix[x][y] * velXMatrix[x][y] + velYMatrix[x][y] * velYMatrix[x][y]);
			if(velModulusMax < velModulusMatrix[x][y]) {
			  velModulusMax = velModulusMatrix[x][y];
			}
		}
	}

	// Select valid cells (i.e. those with enough motion)
	int validCells = 0;

	xVel = yVel = 0;
	for(x = 0; x < COMP_MATRIX_WIDTH; ++x) {
		for(y = 0; y < COMP_MATRIX_HEIGHT; ++y) {
			if(velModulusMatrix[x][y] > (0.05 * velModulusMax)) {
				++validCells;
				xVel += velXMatrix[x][y];
				yVel += velYMatrix[x][y];
			}
		}
	}

	// Ensure minimal area to avoid extremely high values
	int cellArea = (this->_fw * this->_fh) / (COMP_MATRIX_WIDTH * COMP_MATRIX_HEIGHT);
	if(cellArea == 0) {
	  cellArea= 1;
	}
	int minValidCells = (3000 / cellArea);
	if(validCells < minValidCells) {
	  validCells= minValidCells;
	}

	// Compute speed
	xVel = - (xVel / (float)validCells) * 40;
	yVel = (yVel / (float)validCells) * 80;
*/

  //(*(this->oldFrame)) = (*(this->curFrame)).clone();

  stringstream ss;
  ss << "[{\"x\":" << this->_fx
    << ",\"width\":" << this->_fw
    << ",\"y\":" << this->_fy
    << ",\"height\":" << this->_fh
    << ",\"sx\":" << sy
    << ",\"sy\":" << sx
    << ",\"cc\":" << cc
    << ",\"dx\":" << xVel
    << ",\"dy\":" << yVel << "}]";

  this->PostMessage(pp::Var(ss.str()));
}


/// The Module class.  The browser calls the CreateInstance() method to create
/// an instance of your NaCl module on the web page.  The browser creates a new
/// instance for each <embed> tag with type="application/x-nacl".
class testModule : public pp::Module {
    public:
        testModule() : pp::Module() {}
        virtual ~testModule() {}

        /// Create and return a testInstance object.
        /// @param[in] instance The browser-side instance.
        /// @return the plugin-side instance.
        virtual pp::Instance* CreateInstance(PP_Instance instance) {
            return new facedetectInstance(instance);
        }
};

namespace pp {
    /// Factory function called by the browser when the module is first loaded.
    /// The browser keeps a singleton of this module.  It calls the
    /// CreateInstance() method on the object you return to make instances.  There
    /// is one instance per <embed> tag on the page.  This is the main binding
    /// point for your NaCl module with the browser.
    Module* CreateModule() {
        return new testModule();
    }
}  // namespace pp
