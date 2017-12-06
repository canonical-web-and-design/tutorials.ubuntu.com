---
id: using-intel-realsense-sdk
summary: We are going to illustrate how to build some Intel RealSense SDK samples on an ubuntu desktop. You will be able to hook up on your Intel Joule and build the samples, explore some of the code and try them!
categories: iot
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: snap, classic, realsense, joule
difficulty: 2
published: 2017-01-20
author: Canonical Web Team <webteam@canonical.com>


---

# Using Intel RealSense SDK on the desktop

## Overview
Duration: 1:00

We are going to illustrate how to build some [Intel RealSense] SDK samples on an Ubuntu Core image using the classic snap. You will be able to hook up on your [Intel Joule] and build the samples, explore some of the code and try them!

### What you’ll learn
  - What compose the Intel RealSense SDK.
  - How to use the classic snap as a traditional ubuntu environment for developing.
  - How to setup the SDK and build existing samples.

### What you’ll need
  - An Intel Joule device, with Ubuntu classic LTS installed on it.
  - A realsense camera (ZR300 was tested).
  - Some very basic knowledge of command line use.

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

## Getting started
Duration: 2:00

If you are on Ubuntu 16.04 LTS or Ubuntu 16.10, getting all the required tools is very easy.


positive
: Note: other GNU/Linux distributions are currently in the process of building packages for snapcraft.

### Downloading the SDK

You will be provided with a link to a tar.bz2 file containing the SDK and all samples, we are going to detail its content here, but let’s download and extract the content first!

Now simply run (inside the classic snap):


```bash
$ sudo apt update
$ sudo apt install curl
$ curl -o realsense_sdk_beta3.tar.bz2 <download_link>
```

This will download the SDK and you will get a progress bar confirming it so. Once done, let’s extract its content:

```bash
$ tar xf realsense_sdk_beta3.tar.bz2
```
Now that we have the SDK extracted, let’s look in detail to its content and build it!

## Building the SDK
Duration: 30:00

### Starting building

As building the whole SDK and dependencies is quite a long process, let’s start building it right away before looking at its content.

```bash
$ cd realsense_sdk_beta3
$ sudo ./install_script.sh
```

This process will take a very long time, let’s use that opportunity to open a second ssh connection to the board, and ensure that you will get your Intel RealSense camera recognized:

positive
: Note: this is the only change that needs to be done outside the classic snap, as we need system services like udev to know about it.


You can now unplug and plug back your Intel RealSense camera. It will be detected by the system.
### RealSense SDK Content

While the build is proceeding, let’s look at the files extracted from the bz2 archive:

```bash
~/realsense_sdk_beta3$ ls
README.md
beignet-1.2.1-source.tar.gz
build
install_script.sh
librealsense_persontracking_20161220.tar.gz
librealsense_slam_20161221.tar.bz2
librealsense_v1.11.2.tar.gz
opencv_3.1.0.tar.gz
realsense_object_recognition20161208.tar.bz2
realsense_samples-v0.6.2.tar.gz
realsense_sdk_07_12_2016WW50.tar.gz
release_notes
zr300_firmware_update_prq_2.zip
```

In addition to the README.md, install script, release note, ZR300 firmware and build directory, you see various projects embedded. Let’s detail them in build dependency order:

#### beignet1.2.1-source.tar.gz

Beignet is an open source implementation of the OpenCL specification - a generic compute oriented API. This code base contains the code to run OpenCL programs on Intel GPUs which basically defines and implements the OpenCL host functions required to initialize the device, create the command queues, the kernels and the programs and run them on the GPU. The code base also contains the compiler part of the stack which is included in backend/.

#### opencv_3.1.0.tar.gz

OpenCV (Open Source Computer Vision) is a library of programming functions mainly aimed at real-time computer vision. It has C++, C, Python and Java interfaces and supports Windows, Linux, Mac OS, iOS and Android. OpenCV was designed for computational efficiency and with a strong focus on real-time applications. Written in optimized C/C++, the library can take advantage of multi-core processing. Enabled with OpenCL, it can take advantage of the hardware acceleration of the underlying heterogeneous compute platform

#### librealsense_v1.11.2.tar.gz

This project is a cross-platform library (Linux, Windows, Mac) for capturing data from the Intel® RealSense™ F200, SR300, R200, LR200 and the ZR300 cameras. This effort was initiated to better support researchers, creative coders, and app developers in domains such as robotics, virtual reality, and the internet of things. Several often-requested features of RealSense™ devices are implemented in this project, including multi-camera capture.

The following features are available in this release:

  - **Native streams**: depth, color, infrared and fisheye.
  - **Synthetic streams**: rectified images, depth aligned to color and vice versa, etc.
  - **Intrinsic/extrinsic calibration**information.
  - Majority of **hardware-specific functionality** for individual camera generations (UVC XU controls).
  - **Multi-camera capture**across heterogeneous camera architectures (e.g. mix R200 and F200 in same application)
  - **Motion-tracking** sensors acquisition (ZR300 only)

This project contains a certain number of samples, where you can get raw data from the camera. Those are built from the general build script. We’ll detail some of them in the next step.

#### librealsense_persontracking_20161220.tar.gz

Intel® RealSense™ Person Library provides the ability to sense and recognize people, understand what they do, and interact with them.


The following features are available in this release:

  -  **Person Detection**:  Detects people in a scene. Provides their location through a bounding rectangle.
  - **Person Tracking**: Follows people within a space. Provides the person's Center of Mass (COM) and handles occlusions and cases in which the person exits the field of view (FOV).
  - **Person Recognition**: Identifies a person by ID. Supports databases of up to 30 registered users.
  - **Body Tracking**: Tracks body part movements. Provides six points of interest on the body (head, chest, shoulders, and extremities of the hands).
Body tracking is supported up to a distance of 2.8m from the camera.
  - **Body Gestures**: Understands pre-defined body movements. Supports a pointing gesture (including the pointing vector) and a wave gesture.
  - **Face Tracking**: Tracks face movements. Provides the face direction in values of yaw, pitch, and roll.


#### realsense_object_recognition20161208.tar.bz2

Intel® RealSense™ Object Library enables machines to understand what they are viewing and provides meaning to computer vision made possible by Intel RealSense cameras. This ability facilitates more dynamic human machine interaction. Intel® RealSense™ Object Library uses a CNN-based architecture that utilizes depth to efficiently and accurately classify and localize objects. This middleware includes features for recognizing, localizing, and tracking objects from a pre-defined library.

The following features are available in this release:

  - **Object Recognition (OR)**: Identifies a single object in the scene based on pre-trained classifiers in a pre-defined ROI.
  - **Object Localization (OD)**: Identifies and locates multiple objects in a scene.
  - **3D Object Position**: Provides the x,y,z world coordinates of the center of the object. The more exact the bounding box, the more exact this value will be. This is only available in instances where depth is available and will not be provided as a direct output of localization.
  - **Object Tracking**: Enables the camera to keep track of objects that have been previously localized.

#### librealsense_slam_20161221.tar.bz2

Intel® RealSense™ SLAM Library provides Simultaneous Localization and Mapping capabilities.


The following features are available in this release:

  - **Real-time 6 degrees of freedom** (6DoF) camera tracking.
  - Learning an area by associating its appearance with 6DoF coordinates, so enabling re-localization.
  - **Real-time construction of a 2D occupancy map** of a captured environment.

SLAM is tailored for, although not limited to, robots:
Autonomous robot navigation requires the ability to build a high precision map of the surrounding environment and enable the robot to locate itself in the map for path planning and routing purposes.

SLAM uses the visual-inertial sensor of the RealSense camera to estimate odometry and concurrently builds a map. The constructed map can be used by applications to detect obstacles, label locations, and plan paths.


#### realsense_sdk_07_12_2016WW50.tar.gz

The Intel® RealSense™ SDK for Linux provides libraries, tools, and samples to develop applications using Intel® RealSense™ cameras, over the Intel librealsense API.

The SDK provides functionality of record and playback of camera streams for test and validation.

The SDK includes libraries which support the camera stream projection of streams into a common world-space viewpoint, and libraries which enable the use of multiple middleware modules simultaneously for common multi-modal scenarios.  

It features:

  - **Record and Play**:
     - **Record**: The record module provides a utility to create a file, which can be used by the playback module to create a video source.
    The record module provides the same camera API as defined by the SDK (**librealsense**) and the record API to configure recording parameters such as output file and state (pause and resume).
    The record module loads librealsense to access the camera device and execute the set requests and reads, while writing the configuration and changes to the file.
     - **Playback**: The playback module provides a utility to create a video source from a file.
    The playback module provides the same camera API as defined by the SDK (**librealsense**), and the playback API to configure recording parameters such as input file, playback mode, seek, and playback state (pause and resume).
    The playback module supports files that were recorded using the Linux SDK recorder and the Windows RSSDK recorder (up to version 2016 R2).
  - **Frame data container**:
    The SDK provides an image container for raw image access and basic image processing services, such as format conversion, mirror, rotation, and more. It caches the processing output to optimize multiple requests of the same operation.
    The image container includes image metadata, which may be used by any pipeline component to attach additional data or computer vision (CV) module processing output to be used by other pipeline components. The SDK uses a correlated samples container to provide access to camera images and motion sensor samples from the relevant streams, which are time-synchronized. The correlated samples container includes all relevant raw buffers, metadata, and information required to access the attached images.
  - **Spatial correlation and projection**:
    The Spatial Correlation and Projection library provides utilities for spatial mapping:
     - Map between color or depth image pixel coordinates and real world coordinates
     - Correlate depth and color images and align them in space
  - **Pipeline**:
    The pipeline is a class, which abstracts the details of how the cognitive data is produced by the computer vision modules.
    The application can focus on consuming the computer vision output, leaving the camera configuration and streaming details for the pipeline to handle.
  - **Samples**:
     - **Projection**: The sample demonstrates how to use the different spatial correlation and projection functions, from live camera and recorded file
     - **Record and Playback**: The sample demonstrates how to record and play back a file while the application is streaming, with and without an active CV module,      with minimal changes to the application, compared to live streaming.
     - **Video module, asynchronized**: The sample demonstrates an application usage of a Computer Vision module, which implements asynchronous sample processing.
     - **Video module, synchronized**: The sample demonstrates an application usage of a Computer Vision module, which implements synchronous samples processing.
     - **Fatal error recovery**: The sample demonstrates how the application can recover from a fatal error in one of the SDK components (CV module or core module), without having to terminate.

  - **Tools**:
     - **Capture tool**: Provides a GUI to view camera streams, create a new file from a live camera, and play a file in the supported formats. The tool provides options to render the camera or file images.
     - **Projection tool**: Provides simple visualization of the projection functions output, to allow human eye detection of major offsets in the projection computation.
     - **System Info tool**: Presents system data such as Linux name, Linux kernel version, CPU information, and more.

  - **Utilities**:
     - **Log**: The SDK provides a logging library, which can be used by the SDK components and the application to log meaningful events.
     - **Time Sync utility**: Provides methods to synchronize multiple streams of images and motion samples based on the samples time-stamp or sample number.
     - **SDK Data Path utility**: The SDK provides a utility to locate SDK files in the system.
     The utility is used by Computer Vision modules, which need to locate data files in the system that are constant for all applications (not application- or algorithm-instance specific).
     - **FPS counter**:  Measures the actual FPS in a specific period. You can use this utility to check the actual FPS in all software stack layers in your applications, to analyze FPS latency in those layers.


#### realsense_samples-v0.6.2.tar.gz

We are going to detail the available samples in the next section!

## Available samples
Duration: 30:00

### Preliminary notes

On ubuntu desktop, you can run any examples you want (graphical and non graphical).  Most of the samples are rendering some graphical UI. Those have the **rs_** prefix for realsense SDK and **cpp_** prefix for those using librealsense (the bare protocole).

Ubuntu Core, on itself, doesn’t have any graphical server by default. Consequently, you can’t run most of the samples rendering some graphical UI. However, there are a lot of samples with a **_web** appendix. They are spawning a web interface that you can access to the network, showing you real time data and capture from the camera.

You can focus and experiment on both kind of examples.

### Running your first sample
Here is an example with **rs_pt_tutorial_1_web**:


```bash
$ rs_pt_tutorial_1_web

enabling: stream:DEPTH, 320x240x30, format:Z16

enabling: stream:COLOR, 320x240x30, format:RGB8
Device open failed, aborting...
Device open failed, aborting...
cl_get_gt_device(): error, unknown device: ffffffff

web folder path: /usr/share/librealsense/samples/rs_pt_tutorial_1_web_browser

Server: waiting for client to connect...

Best host: 192.168.0.29 of ifa type: wlan0
 >>> point your browser to: http://192.168.0.29:8000/view.html
```

Then, point your browser to http://localhost:8000/view.html (or a remote IP if you are trying to browser from a different machine) and you will get something like:


![IMAGE](https://assets.ubuntu.com/v1/1f62caa2-realsense.png)


The corresponding code is in `~/realsense_sdk_beta3/build/realsense_samples-0.6.2/samples/pt_tutorial_1_web/cpp/main.cpp`

You can spend some times here to study the various SDK examples in the same samples/ directory and execute them one after another.
All corresponding commands will be prepended with **rs_**. librealsense samples are prepended with **cpp_** and their code is in `realsense_sdk_beta3/build/librealsense-1.11.2/examples/`.

### RealSense sample description

To guide you through the samples, here is some description of the existing SDK samples:
  - **rs_or_tutorial_1**: This console app demonstrates the use of librealsense, Object Library, and the Linux SDK Framework, along with the RealSense camera's depth and color sensors to identify objects in the scene.
Each object identified is printed on the command line along with the confidence value for the object. Objects must take up ~50% of the screen to be recognized.
  - **rs_or_tutorial_2**: This console app builds on the rs_or_tutorial_1 app and demonstrates how to utilize the object localization and 3D localization functionality of the Object Library module. All items with >= 90% confidence will be identified, along with their bounding rectangle coordinates in the console..
  - **rs_or_tutorial_3**: This console app builds on the rs_or_tutorial_2 app and demonstrates how to add the Object Tracking functionality of the Object Library module, with localization and 3D localization. Objects for tracking can be as small as 1% of the screen.
  - **rs_or_tutorial_1_web**: This GUI app builds on the rs_or_tutorial_1 app and displays the live color preview from the camera within a browser and shows a table with a label for the object along with its confidence value.
  - **rs_or_tutorial_2_web**: This GUI app builds on the rs_or_tutorial_2 app and displays the live color preview from the camera within a browser and draws rectangles on the color images in the region where objects are recognized. This GUI also includes a table that shows a label for the object along with its confidence value and the 3D (x,y,z) coordinates of the object.
  - **rs_or_tutorial_3_web**: This GUI app builds on the rs_or_tutorial_3 app and displays the live color preview from the camera within a browser and draws rectangles on the color images in the region where objects are recognized and keeps track of the objects. This GUI also includes a table that shows a label for the object along with its confidence value and the 2D (x,y) coordinates of the object.
  - **rs_or_tutorial_1_gui**: This GUI/console app builds on the rs_or_tutorial_1, and demonstrates the use of librealsense, object recognition in Object Library, and the Linux SDK Framework along with the RealSense camera's depth and color sensors to identify objects in the scene. Each object identified will be listed on the command line and on a pop-up window along with the confidence value for the object.
  - **rs_or_tutorial_2_gui**: This GUI/console app builds on the rs_or_tutorial_2 app, and demonstrates how to utilize object localization and 3D localization. A GUI is displayed in a pop-up window along with output in the console. Recognized objects will be highlighted with a bounding box, label, and confidence level drawn in a live video stream. Other information is displayed for each recognized object in a table in the pop-up window and in the console.
  - **rs_or_tutorial_3_gui**: This GUI/console app builds on the rs_or_tutorial_3 app, and demonstrates how to add object tracking functionality with localization and 3D localization. Tracked objects can be as small as 1% of the screen. The coordinates of the tracked object(s) are displayed in a pop-up window and the console. Tracked objects are shown by a labeled bounding rectangle drawn over a live video stream. The user can trigger the localization function using the mouse.
  - **rs_or_tutorial_4_gui**: This GUI/console app builds on the rs_or_tutorial_3 app, and demonstrates how to add object tracking functionality. The coordinates of the tracked object(s) are displayed in pop-up window and the console. Tracked objects are shown the pop-up window by a labeled bounding rectangle drawn over a live video stream. The user will choose the tracked object using the mouse.
  - **rs_pt_tutorial_1**: This sample app demonstrates the use of libRealSense, Person Library, and the Linux SDK Framework to use the ZR300 camera's depth and color sensors to detect people in the scene. The number of people detected in the scene will be displayed as a quantity in the console.
  - **rs_pt_tutorial_2**: This sample app demonstrates how to analyze someone’s posture. When a person is in the FOV, the app should display the following information once every second: his head direction (yaw, pitch, roll values) and his body direction (front/side/back values).
  - **rs_pt_tutorial_3**: This sample app demonstrates how to get the body tracking points and detect a pointing gesture. The app will display 6 body points, a “Pointing Detected” alert when the gesture is performed, and the pointing vector.
  - **rs_pt_tutorial_1_web**: This GUI app builds on the rs_pt_tutorial_1 app and displays the live color preview from the camera within a browser and draw rectangles around the person(s) detected in the camera frame and draws a color dot indicating the center of mass for the detected person in the image. There is also a table as part of the GUI that shows the person id, center of mass world coordinates (x,y,z) and the cumulative count of persons detected.
  - **rs_pt_tutorial_2_web**: This GUI app builds on the rs_pt_tutorial_2 app and displays the live color preview from the camera within a browser and draws rectangle around the head of a person detected in the camera frame. There is also a table as part of the GUI that shows the person id, head pose information, and the person orientation (front, left, right, etc.) with confidence score.
  - **rs_pt_tutorial_3_web**: This GUI app builds on the rs_pt_tutorial_3 app and displays the live color preview from the camera within a browser and draws rectangle around the person detected in the camera frame. Also draws an arrow to indicate the direction of the pointing gesture. There is also a table as part of the GUI that shows the person id, gesture origin (x,y,z) and gesture direction.
  - **rs_or_pt_tutorial_1**: This console app demonstrates the use of libRealSense, Object Library, and Person Library, using the ZR300 camera identify objects and persons. The name of the object, along with the confidence value will be printed in the console. Person information like person id and the 2D box coordinates will be printed in the console.
  - **rs_or_pt_tutorial_1_web**: This GUI app builds on the rs_or_pt_tutorial_1 app and displays the live color preview from the camera within a browser and draw rectangles around the person(s) and object(s) detected in the camera frame. There is also a table as part of the GUI that shows the person id, center of mass world coordinates(x,y,z) along with object label, object center world coordinates and confidence score.
  - **rs_slam_or_pt_tutorial_1**: This console app demonstrates the use of libRealSense, SLAM, Object Library, and Person Library, using the ZR300 camera to print out the current camera module position and identified objects and identified persons. The name of the object along with the confidence value will be printed in the console for identified objects. Person information like person id and the 2D box coordinates will be printed in the console.
  - **rs_slam_or_pt_tutorial_1_web**: This GUI app builds on the rs_slam_or_pt_tutorial_1 app and displays live fisheye and color preview, occupancy map, input and tracking fps for fisheye, depth, gyro and accelerometer frames, within a browser. Draws rectangles around recognized objects and persons in the color preview.
  - **rs_slam_tutorial_1**: This app demonstrates the use of librealsense and SLAM Library. The librealsense library streams depth, fish eye, and IMU data from the ZR300 camera which are used as input to the SLAM Library library. The SLAM Library outputs the camera pose (position and orientation) and occupancy map. The occupancy map is a 2D map of the surroundings that shows which areas are occupied by obstacles to navigation. It also illustrates how to save a ROS compatible occupancy PNG file and meta data .yaml file.
  - **rs_slam_tutorial_1_web**: This GUI app builds on the rs_slam_tutorial_1 app and displays live fisheye preview, occupancy map, input and tracking fps for fisheye, depth, gyro and accelerometer frames, within a browser.



## That’s all folks!
Duration: 1:00

Congratulations! You have played with the Intel RealSense SDK, installed and enabled it on your Ubuntu Core image in the Joule. You now have as well some samples and looked at some code on using the SDK.

You should by now be familiar with the various parts composing the SDK, what each of them is responsible for and some basic ideas on how to use them. You also know what  features the Intel RealSense supports and have some samples on how to utilize them.

### Next steps

  - Learn some more advanced techniques on how to use your snap system looking for our others tutorials!
  - Join the snapcraft.io community on the [snapcraft forum].

### Further readings

  - The [Intel RealSense] website is a good one to learn more about this technology.
  - Check how you can [contact us and the broader community].





[Intel RealSense]: http://www.intel.eu/content/www/eu/en/architecture-and-technology/realsense-overview.html
[Intel Joule]: https://software.intel.com/en-us/iot/hardware/joule/dev-kit
[http://localhost:8000/view.html]: http://localhost:8000/view.html
[snapcraft forum]: https://forum.snapcraft.io/
[Intel RealSense]: http://www.intel.fr/content/www/fr/fr/architecture-and-technology/realsense-overview.html
[contact us and the broader community]: http://snapcraft.io/community/
