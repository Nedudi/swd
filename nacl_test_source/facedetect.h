#ifndef MAIN_H
#define MAIN_H
#include <cstdio>
#include <string>

#include <ppapi/cpp/instance.h>
#include <ppapi/cpp/module.h>
#include <ppapi/cpp/var.h>
#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>

#include <opencv2/imgproc/imgproc_c.h>
#include <opencv2/contrib/contrib.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/objdetect/objdetect.hpp>
#include <opencv2/video/tracking.hpp>
//#include <opencv2/legacy/legacy.hpp>
#include "fimage.h"

using namespace std;
using namespace cv;

class GetURLHandler;
class facedetectInstance : public pp::Instance {
  public:
    CFImage* frame;
    explicit facedetectInstance(PP_Instance instance);
    virtual ~facedetectInstance();

    virtual void HandleMessage(const pp::Var&);
    void PrepareNewImageFromMessage(const pp::Var& var_message);
    void HandleXml(const std::string&);
    void CreateMemFile(const std::string&, const std::string&);
    void RecognizeFace();
    void DetectMotion();

  private:
    int width, height;
    std::string url;
    GetURLHandler* handler;
    bool classifierCreated;
    CascadeClassifier *face_cascade;
    int _fx,_fy,_fw,_fh;
};
#endif
