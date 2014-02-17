#ifndef FIMAGE_H
#define FIMAGE_H

#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/imgproc/imgproc_c.h>
#include <opencv2/contrib/contrib.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/objdetect/objdetect.hpp>

class CFImage {
  public:
    CFImage();
    CFImage(IplImage *pImg);
    CFImage(int width, int height, int depth = IPL_DEPTH_8U, const char *pColorOrder = "GRAY");
    ~CFImage();

//  private:
    // Private methods
    void InitROIStack(int width, int height);
    void Init();

//  public:
    bool Create(int width, int height, unsigned int depth = IPL_DEPTH_8U, const char *pColorOrder = "GRAY", int origin = IPL_ORIGIN_TL, int align = IPL_ALIGN_QWORD);
    bool Import(IplImage *pImage);
    IplImage* Detach();
    void Free();
    void Reset();

    // ROI
    bool SetROI(int x, int y, int width, int height, unsigned int coi= 0);
    bool SetROI(IplROI &roi);
    bool SetROI(CvRect &rect);
    void GetROI(IplROI &roi);
    void ResetROI();

    void PushROI();
    void PopROI();

    // Data accessors
    bool Initialized() const;
    IplImage *ptr();
    const IplImage *ptr () const;
    int Width () const;
    int Height () const;
    CvSize GetSize() const;

    // 0 - top-left origin, 1 - bottom-left origin (Windows bitmaps style)
    int Origin () const { assert (m_pIplImage); return m_pIplImage->origin; }
    int Depth () const { assert (m_pIplImage); return m_pIplImage->depth; }
    int Align() const { assert (m_pIplImage); return m_pIplImage->align; }

  private:
    enum { ROI_STACK_SIZE= 10 };

    // Attributes
    IplImage *m_pIplImage;
    bool m_importedImage;
    IplROI *m_importedROI;
    IplROI m_roiStack[ROI_STACK_SIZE];
    int m_roiStackPtr;
};

#endif