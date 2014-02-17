#include "fimage.h"

// Construction
CFImage::CFImage() {
	Init();
}

CFImage::CFImage(IplImage *pImg) {
	Init();
	Import(pImg);
}

CFImage::CFImage(int width, int height, int depth, const char *pColorOrder) {
	Init();
	Create(width, height, depth, pColorOrder);
}

CFImage::~CFImage() {
	Free ();
}

void CFImage::Init() {
	m_pIplImage= NULL;
	m_importedImage= false;
	m_importedROI= NULL;
	m_roiStackPtr= 0;
}

void CFImage::InitROIStack(int width, int height) {
	m_roiStack[0].coi= 0;
	m_roiStack[0].xOffset= 0;
	m_roiStack[0].yOffset= 0;
	m_roiStack[0].width= width;
	m_roiStack[0].height= height;
	m_roiStackPtr= 0;
}

bool CFImage::Create(int width, int height, unsigned int depth, const char *pColorOrder, int origin, int align) {
	int nChannels = 0;
	const char *pColorModel = NULL;
	bool alphaChannel = false;

	Free();

	InitROIStack(width, height);

	if(!strcmp(pColorOrder, "GRAY") || !strcmp(pColorOrder, "G")) {
		nChannels = 1; pColorModel = "GRAY";
	} else if(!strcmp(pColorOrder, "BGR") || !strcmp(pColorOrder, "RGB")) {
		nChannels = 3; pColorModel = "RGB";
	} else if(!strcmp(pColorOrder, "RGBA") || !strcmp(pColorOrder, "BGRA")) {
		nChannels = 4; pColorModel = "RGB"; alphaChannel = true;
	} else if(!strcmp(pColorOrder, "YUV")) {
		nChannels = 3; pColorModel = "YUV";
	} else {
	  assert(0);
	}

	m_pIplImage = cvCreateImage(cvSize(width,height), depth, nChannels);
	if(!m_pIplImage) {
	  return false;
	}

//	m_pIplImage = cvCreateImageHeader(cvSize(width,height), depth, nChannels);
//	if(!m_pIplImage) {
//	  return false;
//	}
//	m_pIplImage->alphaChannel = (alphaChannel ? 1 : 0);
//	strncpy(m_pIplImage->colorModel, pColorModel, 4);
//	strncpy(m_pIplImage->channelSeq, pColorOrder, 4);
//	m_pIplImage->dataOrder = IPL_DATA_ORDER_PIXEL;
//	m_pIplImage->origin = origin;
//	m_pIplImage->align =	align;
//	m_pIplImage->roi = &m_roiStack[0];
//	cvCreateData(m_pIplImage);

//	if(CV_StsOk != cvGetErrStatus()) {
//		m_pIplImage->roi = NULL;
//		cvReleaseImageHeader(&m_pIplImage);
//		m_pIplImage= NULL;
//		return false;
//	}

	return true;
}

bool CFImage::Import (IplImage *pImage) {
	// Cannot import the same image
	if(pImage == this->m_pIplImage) {
	  return false;
	}

	Free ();

	m_pIplImage = pImage;
	m_importedImage = true;
	InitROIStack(pImage->width, pImage->height);
	m_importedROI = pImage->roi;
	if(pImage->roi) {
	  m_roiStack[m_roiStackPtr] = *pImage->roi;
	}
	pImage->roi = &m_roiStack[m_roiStackPtr];

	return true;
}

IplImage* CFImage::Detach() {
	if(!m_pIplImage) {
	  return NULL;
	}

	if(m_importedImage) {
	  m_pIplImage->roi= m_importedROI;
	} else {
	  m_pIplImage->roi= NULL;
	}

	IplImage* retval= m_pIplImage;
	Init ();

	return retval;
}

void CFImage::Free() {
	bool wasImported = m_importedImage;
	IplImage* retval = this->Detach();
	if(retval && !wasImported) {
	  cvReleaseImage(&retval);
	}
}

void CFImage::Reset() {
	if(m_pIplImage == NULL) {
  	return;
	}
	cvSetZero(m_pIplImage);
}

bool CFImage::SetROI (int x, int y, int width, int height, unsigned int coi) {
	// Check limits for the ROI
	if (x< 0 || (x + width > m_pIplImage->width)) {
		assert (false);
		return false;
	}
	if (y< 0 || (y + height > m_pIplImage->height)) {
		assert (false);
		return false;
	}

	// ROI Ok
	m_roiStack[m_roiStackPtr].coi= coi;
	m_roiStack[m_roiStackPtr].xOffset= x;
	m_roiStack[m_roiStackPtr].yOffset= y;
	m_roiStack[m_roiStackPtr].width= width;
	m_roiStack[m_roiStackPtr].height= height;

	return true;
}

bool CFImage::SetROI(IplROI &roi) {
  return SetROI(roi.xOffset, roi.yOffset, roi.width, roi.height, roi.coi);
}

bool CFImage::SetROI(CvRect &rect) {
  return SetROI(rect.x, rect.y, rect.width, rect.height);
}

void CFImage::GetROI(IplROI &roi) {
	roi= m_roiStack[m_roiStackPtr];
}

void CFImage::ResetROI() {
	m_pIplImage->roi->coi= 0;
	m_pIplImage->roi->xOffset= 0;
	m_pIplImage->roi->yOffset= 0;
	m_pIplImage->roi->width= m_pIplImage->width;
	m_pIplImage->roi->height= m_pIplImage->height;
}

void CFImage::PushROI() {
	m_roiStack[m_roiStackPtr + 1] = m_roiStack[m_roiStackPtr];
	m_roiStackPtr++;
	m_pIplImage->roi = &m_roiStack[m_roiStackPtr];
}

void CFImage::PopROI() {
	m_roiStackPtr--;
	m_pIplImage->roi = &m_roiStack[m_roiStackPtr];
}

bool CFImage::Initialized() const {
  return m_pIplImage!= NULL;
}

IplImage *CFImage::ptr() {
  return m_pIplImage;
}

const IplImage *CFImage::ptr() const {
  return m_pIplImage;
}

int CFImage::Width () const {
  return m_pIplImage->width;
}

int CFImage::Height () const {
  return m_pIplImage->height;
}

CvSize CFImage::GetSize() const {
  return cvSize(m_pIplImage->width, m_pIplImage->height);
}
