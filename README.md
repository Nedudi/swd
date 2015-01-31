# STOP WEB DISABILITY

![stop web disability](http://content.screencast.com/users/Nedudi/folders/Jing/media/34707b9a-b52c-45a4-a99a-2272841a6b42/00000761.png "Logo")

## Starting Jan 2015 this project is open-sourced
### Everybody, who can continue this project, please let us know.

----------

## Video and images

 - videos: https://vimeo.com/channels/602036
 - presentation: http://prezi.com/3ctf8ey5fspi/stop-web-disability

## Intro
-----------

About 4% of people all over the world have different kinds of disability. About 190 millions of people can not feel their hands and feet and they are not able to do a simplest operations. 

Nowerdays, for sure, the very important point for everybody of us is to have the access to the internet and possibility to browse the web.

We are always saying "Let's make the web better", having in minds design, usability, new features and etc. What we would like to do with our idea and prototype is to make the web accessible (as easier as possible) for people with complete or partial paralysis of the body.

## The idea
-----------
First prototype that we made for #hack4good hackaton allows people with paralysis of the arms and legs to browse the web using head movements and voice-clicks.

## How does this work?
-----------
We'll use only the webcam that exists in every laptop and newest web technologies to move cursor on the page following face movements. Click will be performed with voice command.

![stop web disability](http://content.screencast.com/users/Nedudi/folders/Jing/media/6f249254-f22c-4a11-a35b-bf00455539b9/00000766.png "Logo")

## Why does this innovation is helpful and cool?
-----------
All current scope of technics to help people with such kind of disabilities cost a huge amount of money and require additional devices and equipment, so only small group of people can really use this stuff. 

Instead of this we are trying to do it only using camera and microphone that people already have in any laptop. 

Finally this technology will be avaliable in Chrome browser as extension, that can be installed for free in 2 clicks. Directly after installation, it will automaticly work on every web page you want to browse.

The first concept that we did based on unique combination of algoritms to follow the face movements and voice detection. We use only open source techniques and libraries. It already works quite well, and we spend only 2 days to make the first prototype working.

## Current state of the project:
-----------
Face detection and tracing was fully re-made with webGl and google chrome naive client by Alexey.
We have a web interface that wrap any page with additional controls,  like tabs switching, opening new page, clicking wia making sound and etc.

## Problems:
----------

We made few prototypes that can work quite fast, but still having problems about productivity and other points:

- problem with face recognitiona nad tracing productivity (low fps even with native-client-based tracer and recogniser)
- problems with sound tracing (sound is probably not the ideal case for many people as a click trigger)
- problem with camera access without manual confoirmation for each new web-page (we used external https server for it, but it's still doesn't solve the problem with video stream transfer)
- problem with scaling head movements to cursor movements.
- problem with lights and noise redution from standard web-cameras
- problem with launching native client related to chrome sequrity issues
- problem with chrome and external https sources (issues with certificates)
- many other problems

## What's was the next planed steps:
-----------

* make the code review (now it looks really hacky)
* improve follow face movements algoritms using short timeframe analysis,  webShaders, contrast and light auto abjustments
* improve sound detection based on everage levels of noise in timeframe, correlation analysis, convolution based filters.
* "Swipe" actions for esier navigation
* virtual keyboard with smart navigation and input text possibilities.
* Adaptive algoritm that can learn personal factors (Automaic adaptation to partiqular face, voice, camera, microphone)
* Try to implement different work modes for different kinds of disability (Detection of eyes, apple of the eyes, tang, eyebrows)

## Why it is still important to finish
-----------
We hope it will make a web avaliable for people with different kinds disabilities in every place on the planet. It will help them to live and grow socially, share thair position and feelings, give them a way to get a new emotions from everyday life.


## Who we are
-----------
*Dmitry Dudin:*
before: radar engener, digital signal processing systems, program logical integral schems, backend
now: creative frontend developer at xb-software

*Alexey Puzenko:*
Before: advanced math specialist, lecturer in Radio Engineering College, c++ modeling, flash, backend
Now: creative frontend developer at xb-software

## Why did we stop development
-----------
We stopped development in May 2014, because of huge time and inspiration defficite. Probably one day we will continue,  but for now it's not possible for a lot of internal reasons.

## Starting Jan 2015 this project is open-sourced
-----------
Everybody, who can continue this project, please let us know.

## Nobody of us is insured from the same problems, 
## We'll be happy if have time to continue this project. 
## We can provide any details about this project, and help you

thanks in advance
