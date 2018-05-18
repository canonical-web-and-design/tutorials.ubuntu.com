---
id: grapical-snaps
summary: 
categories: iot
status: draft
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: snap, digital-signage, kiosk, device
difficulty: 3
published: 2018-05-17
author: Alan Griffiths <alan.griffiths@canonical.com>

---

# Graphical Snaps for Ubuntu Core

## Overview

This is a guide on how to create graphical snaps for Ubuntu Core with a single GUI application running fullscreen on the display. This addresses situations like:
* Digital signage
* Web kiosk
* Industrial machine User Interface

negative
: This approach can be expanded to create more complex user interfaces with multiple GUI applications. However, this will require more advanced window management and is considered outside the scope of this guide.

positive
: The combination of Snap, the "mir-kiosk" Wayland server and UbuntuCore ensures reliability and security of any graphical embedded device application.

### What you'll learn

How to create graphical snaps for Ubuntu Core including the two main approaches for creating a graphical snap (depending on the graphical toolkit your application uses).

### What you'll need

You can follow the steps in this tutorial on any current release of Ubuntu. You'll also need a device (or a VM) with Ubuntu core installed.

## Preparation
duration: 10:00

### Requirements

* An Ubuntu desktop (Xenial or Bionic)

* Snapcraft (version 2.41 or greater)

* A Virtual Machine
A good way to test graphical snaps on Ubuntu Core is to have a VM with Core installed and ready. This guide shows you how:
[https://developer.ubuntu.com/core/get-started/kvm](https://developer.ubuntu.com/core/get-started/kvm).

* A Device
Ubuntu core is available on a range of devices. This guide shows you how to set up an existing device: [https://developer.ubuntu.com/core/get-started/installation-medias](https://developer.ubuntu.com/core/get-started/installation-medias).

If there's no supported image that fits your needs you can [create your own core image](https://tutorials.ubuntu.com/tutorial/create-your-own-core-image).

### Ubuntu Core Setup

Once you have set up Ubuntu Core and logged in you need to enable the “layouts” feature, which is still experimental:

```bash
sudo snap set core experimental.layouts=true
```

Then install the “mir-kiosk” snap.

```bash
snap install --beta mir-kiosk
```

Now you should have a black screen with a white mouse cursor.

"mir-kiosk" provides the graphical environment needed for running a graphical snap.


## Using Wayland
duration: 3:00

Graphics on UbuntuCore uses Wayland as the primary interface. Mir is a graphical display server that supports Wayland clients. Snapd supports Wayland as an interface, so confinement can be achieved.

positive
: We do not support X11 directly on UbuntuCore with Mir.
The primary reason for this is security: the X11 protocol was not designed with security in mind, a malicious application connected to an X11 server can obtain much information from the other running X11 applications.

Not all toolkits have native support for Wayland. So, depending on the graphical toolkit your application uses, there may be some additional setup (for Xwayland) required.

![graphical-snaps-with-mir](images/graphical-snaps-with-mir.png)

### Native support for Wayland

* GTK3/4 
* Qt5
* SDL2

This is not an exhaustive list. There may be other toolkits that can work with Wayland but we know these work with Mir.
 
Native support for Wayland the simplest case, as the application can talk to Mir directly. You can omit any Xwayland setup here and in the following sections.

### No Wayland support

* GTK2
* Qt4
* Electron apps
* Java apps
* Chromium

This is a more complex case, as the toolkits require the legacy X11 protocol to function.

To enable these applications we will introduce an intermediary “Xwayland” which translates X11 calls to Wayland ones. Each snapped X11 application should have its own X11 server (Xwayland) which then talks Wayland - a far more secure protocol.

Xwayland will live in the application snap.

negative
: To use fully confined snaps which use Xwayland internally, you will also need a custom build of snapd master with the following patch added:
https://github.com/snapcore/snapd/pull/4545  (allows Xwayland to work confined in a snap)
For now this guide will proceed without application confinement.

## Introducing glmark2-wayland
duration: 5:00

Let’s begin with a trivial example: `glmark2-wayland` - it is a test application that uses OpenGL and Wayland. This is a useful snap for verifying that the graphics stack of your hardware is correctly set up.

### Install mir-demos
When creating a graphical snap it is useful to be able to experiment on the desktop. For this we need to install the latest Mir, which requires a PPA:

```bash
sudo add-apt-repository ppa:mir-team/release
sudo apt update
sudo apt install mir-demos
```

### Install glmark2-wayland

Next install glmark2-wayland:

```bash
sudo apt install glmark2-wayland
```
### Verify glmark2-wayland runs on Mir
```bash
miral-app -kiosk -launcher 'glmark2-wayland --fullscreen'
```

Inside the Mir-on-X window, you should see various graphical animations, and statistics printed to your console. All should be fine before proceeding.

## Snapping glmark2-wayland

For our first pass we will snap glmark2-wayland and run in DevMode on our Ubuntu desktop.

This guide assumes you are familiar with creating snaps. If not, please read [here](https://docs.snapcraft.io/build-snaps/) first. Create the snap directory by forking https://github.com/snapcrafters/fork-and-rename-me

```bash
git clone https://github.com/snapcrafters/fork-and-rename-me.git glmark2-wayland
```

Inside the glmark2-wayland directory edit the “snapcraft.yaml” file, and let’s try the following (SPOILER, won’t work immediately, read on to troubleshoot):

```yaml
name: glmark2-wayland
version: 0.1
summary: GLMark2 on Wayland
description: |
  GLMark2 on Wayland
confinement: strict
grade: devel

apps:
  glmark2-wayland:
    command: "usr/bin/glmark2-wayland"
    plugs:
      - opengl
      - wayland

parts:
  glmark2-wayland:
    plugin: nil
    stage-packages:
      - glmark2-wayland
```

Create the snap by returning to the “glmark2-wayland” directory and running
```bash
snapcraft cleanbuild
```
You should be left with a “glmark2-wayland_0.1_amd64.snap” file.

Let’s test it!
```bash
miral-kiosk&
sudo snap install --dangerous ./glmark2-wayland_0.1_amd64.snap --devmode
snap run glmark2-wayland
```
(“dangerous” needed as local snap file being installed, and “devmode” required as we need to debug it)

Oh no! It fails with these errors:
```bash
Error: Failed to open models directory '/usr/share/glmark2/models'
Error: Failed to open models directory '/usr/share/glmark2/textures'
Error: main: Could not initialize canvas
```
We need to solve these.

## Files are not where they’re expected to be!

One important thing to remember about snaps is that all files are located in a subdirectory $SNAP which maps to /snap/<snap_name>/<version>. To prove this, try the following:
```bash
snap run --shell glmark2-wayland
```
This lands us inside a shell which exists inside the snap environment. A quick “ls” tells us our theory is correct:
```
gerry@ubuntu:/home/gerry/snaps/glmark2-wayland$ ls /usr/share/glmark2
ls: cannot access '/usr/share/glmark2': No such file or directory
```

If binaries have paths to resources hard-coded in, then in a snap environment it will fail to locate those resources.

Here glmark2-wayland is looking for files within /usr/share/glmark2, which in actuality are located in $SNAP/usr/share/glmark2:

```
gerry@ubuntu:/home/gerry/snaps/glmark2-wayland$ ls $SNAP/usr/share/glmark2
models    shaders  textures
```

This is extremely common when snapping applications, therefore there are a few approaches to solving this:


### Your application may read an environment variable
Your application may read an environment variable that specifies where it should look for those resources. In that case, adjust your YAML file to add it like this:

```yaml
apps:
  glmark2-wayland:
  command: "usr/bin/glmark2-wayland"
  environment:
    RESOURCES_PATH: $SNAP/usr/share/glmark2
```

In our case, glmark2-wayland has the path “/usr/share/glmark2” hard-coded in, so this is not going to work for us.


### Changing the application

Sometimes you can edit/recompile the application to add the environment variable mentioned above. If it is your own code you are snapping, this is a good approach.

We could do this, but glmark2-wayland is not our own code and this adds an unnecessary maintenance overhead. 

### Using Use snapd’s experimental “layouts” feature

This bind-mounts directories inside the snap into any location, so that the binaries’ hard-coded paths are correct. To use, add this to the YAML file:

```yaml
passthrough:
  layout:
    /usr/share/glmark2:
      bind: $SNAP/usr/share/glmark2
```

## Using layouts for hard-coded paths

For this guide we are going to use “layouts” frequently whenever paths are hard-coded into binaries. So adding the snippet above, our YAML becomes

```yaml
name: glmark2-wayland
version: 0.1
summary: GLMark2 on Wayland
description: |
  GLMark2 on Wayland
confinement: strict
grade: devel

apps:
  glmark2-wayland:
    command: "usr/bin/glmark2-wayland"
    plugs:
      - opengl
      - wayland

parts:
  glmark2-wayland:
    plugin: nil
    stage-packages:
      - glmark2-wayland

passthrough:
  layout:
    /usr/share/glmark2:
      bind: $SNAP/usr/share/glmark2
```

“snapcraft cleanbuild” this and install:

```bash
snapcraft cleanbuild
sudo snap install --devmode ./glmark2-wayland_0.1_amd64.snap
```
This gets an error message:
```
error: cannot install snap file: cannot use experimental 'layouts' feature, set option
       'experimental.layouts' to true and try again
```
This is snapd making sure you understand that layouts are an experimental feature. We have to tell snapd we know about that:

```bash
sudo snap set core experimental.layouts=true
```

and from now on, snapd will let us install snaps using layouts.

positive
: You may have noticed that snapcraft prints this scary message:
The 'passthrough' property is being used to propagate experimental properties to snap.yaml that have not been validated. The snap cannot be released to the store.
The policy on this has changed, these snaps can indeed be released to the store, but after manual verification.

Now let’s run our snap:
```bash
snap run glmark2-wayland
```
Still not working:
```
Error: main: Could not initialize canvas
```

But if you “run --shell” into the snap environment, you’ll see that /usr/share/glmark2 now contains the resources glmark2 needs. One problem solved!

## Unable to connect to Wayland server
```
Error: main: Could not initialize canvas
```

The error message is not too helpful, but an important thing to check is if the Wayland socket can be found. If not, glmark2-wayland cannot create a surface/canvas.

The convention is that the Wayland socket directory is specified by the $XDG_RUNTIME_DIR environment variable. 

We need to see what $XDG_RUNTIME_DIR is set to both outside the snap environment where the server is running and inside the snap environment where glmark2-wayland is running.
```bash
echo $XDG_RUNTIME_DIR
/run/user/1000/
```
Again, enter the snap environment, and a quick command later:
```bash
snap run --shell glmark2-wayland
$ echo $XDG_RUNTIME_DIR
/run/user/1000/snap.glmark2-wayland
```
This tells us that inside snaps, XDG_RUNTIME_DIR is a custom directory. We need to change this to the value of XDG_RUNTIME_DIR that we saw miral-kiosk has above: /run/user/1000 - we can use “$XDG_RUNTIME_DIR/..” instead. 

Let’s test it:
```bash
$ XDG_RUNTIME_DIR=$XDG_RUNTIME_DIR/.. \
$SNAP/usr/bin/glmark2-wayland
/snap/glmark2-wayland/x1/usr/bin/glmark2-wayland: error while loading shared libraries: libjpeg.so.8: cannot open shared object file: No such file or directory
```
Yikes! What’s happened?

Once again: files are not where they're expected to be! All the libraries glmark2-wayland needs are not in the usual places - we need to tell it where. Snapcraft deals with this by putting a script in our snap that looks after this, have a look at
```bash
$ cat $SNAP/command-glmark2-wayland.wrapper
#!/bin/sh
export PATH="$SNAP/usr/sbin:$SNAP/usr/bin:$SNAP/sbin:$SNAP/bin:$PATH"
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$SNAP/lib:$SNAP/usr/lib:$SNAP/lib/x86_64-linux-gnu:$SNAP/usr/lib/x86_64-linux-gnu:$SNAP/usr/lib/x86_64-linux-gnu/mesa-egl:$SNAP/usr/lib/x86_64-linux-gnu/mesa"
export LD_LIBRARY_PATH=$SNAP_LIBRARY_PATH:$LD_LIBRARY_PATH
exec "$SNAP/usr/bin/glmark2-wayland" "$@"
```

The script sets the library load and executable paths to those inside the snap. It is this script which is called when you do “snap run …”. Let’s run this instead:
```bash
$ XDG_RUNTIME_DIR=$XDG_RUNTIME_DIR/.. \
$SNAP/command-glmark2-wayland.wrapper
```

Oh, still fails with a bunch of errors like
```
libEGL warning: DRI2: failed to open swrast (search paths /usr/lib/x86_64-linux-gnu/dri:${ORIGIN}/dri:/usr/lib/dri)
Error: eglInitialize() failed with error: 0x3001
Error: main: Could not initialize canvas
```
Courage! We’re almost done, there’s just one more thing to fix...

## GL drivers are not where they usually are

This is another typical problem for snapping graphics applications: the GL drivers it needs are bundled inside the snap, but the application needs to be told the path to those drivers inside the snap.

Is this "files are not where they're expected to be" yet again? Yes, but here we are lucky, there’s an environment variable  LIBGL_DRIVERS_PATH we can use to point libGL to the correct location for the GL driver files it needs (you could use layouts too, but this is more efficient)

So set LIBGL_DRIVERS_PATH=$SNAP/usr/lib/x86_64-linux-gnu/dri - and finally run

```bash
$ LIBGL_DRIVERS_PATH=$SNAP/usr/lib/x86_64-linux-gnu/dri \
XDG_RUNTIME_DIR=$XDG_RUNTIME_DIR/.. \ $SNAP/command-glmark2-wayland.wrapper
```

Which works! Woo! Finally! You deserve a nice cup of tea for that. Now we know what to fix, exit the snap environment with Ctrl+D.
