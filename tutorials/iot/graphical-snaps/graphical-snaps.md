---
id: graphical-snaps
summary: A guide to creating graphical snaps for Ubuntu Core
categories: iot
status: draft
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: snap, digital-signage, kiosk, device
difficulty: 3
published: 2018-05-17
author: Gerry Boland <gerry.boland@canonical.com>

---

# Graphical Snaps for Ubuntu Core

## Overview
duration: 1:00

This is a guide on how to create graphical snaps for Ubuntu Core with a single GUI application running fullscreen on the display. This addresses situations like:
* Digital signage
* Web kiosk
* Industrial machine User Interface

negative
: This approach can be expanded to create more complex user interfaces with multiple GUI applications. However, this will require more advanced window management and is considered outside the scope of this guide.

positive
: The combination of Snap, the "mir-kiosk" Wayland server and Ubuntu Core ensures reliability and security of any graphical embedded device application.

### What you'll learn

How to create graphical snaps for Ubuntu Core using a toolkit that supports Wayland.

### What you'll need

You can follow the steps in this tutorial on any current release of Ubuntu. You'll also need a device (or a VM) with Ubuntu core installed.

## Using Wayland
duration: 3:00

Graphics on Ubuntu Core uses Wayland as the primary protocol?. Mir is a graphical display server that supports Wayland clients. Snapd supports Wayland as an interface, so confinement can be achieved.

positive
: We do not support X11 directly on Ubuntu Core with Mir.
The primary reason for this is security: the X11 protocol was not designed with security in mind, a malicious application connected to an X11 server can obtain much information from the other running X11 applications.

Beware that not all toolkits have native support for Wayland. So, depending on the graphical toolkit your application uses, there may be some additional setup (for Xwayland) required.

![graphical-snaps-with-mir](images/graphical-snaps-with-mir.png)

### Toolkits with Native support for Wayland

* GTK3/4 
* Qt5
* SDL2

This is not an exhaustive list. There may be other toolkits that can work with Wayland but we know these work with Mir.
 
Native support for Wayland the simplest case, as the application can talk to Mir directly.

### Toolkits with No Wayland support

* GTK2
* Qt4
* Electron apps
* Java apps
* Chromium

This is a more complex case, as the toolkits require the legacy X11 protocol to function.

To enable these applications we add an intermediary “Xwayland” which translates X11 calls to Wayland ones. Each snapped X11 application will have its own confined X11 server (Xwayland) which then talks Wayland - a far more secure protocol.

positive
: The current tutorial covers the development of all IoT graphical snaps. It is a prerequsite to [Graphical Snaps: Using Xwayland](tutorial/graphical-snaps-xwayland)  which explains the additional steps needed to run Xwayland in your application snap.

## Preparation
duration: 10:00

### Requirements

* An Ubuntu desktop (Xenial or Bionic)

* Your Device
Ubuntu Core is available on a range of devices. This guide shows you how to set up an existing device: [https://developer.ubuntu.com/core/get-started/installation-medias](https://developer.ubuntu.com/core/get-started/installation-medias).

If there's no supported image that fits your needs you can [create your own core image](https://tutorials.ubuntu.com/tutorial/create-your-own-core-image).

### Snapcraft setup

Install snapcraft:
```bash
sudo apt install snapcraft
```

Install LXD :
```bash
snap install lxd && sudo lxd init
```
...just accept the defaults. And then:
```bash
sudo usermod -a -G lxd $USER
```

Then sign out and back in (or `newgrp lxd` in the shell you'll be using)

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
miral-app -kiosk -launcher 'glmark2-wayland'
```

Inside the Mir-on-X window, you should see various graphical animations, and statistics printed to your console. All should be fine before proceeding.

## First Pass Snapping: Test on Desktop
duration: 5:00

For our first pass we will snap glmark2-wayland and run it in DevMode (i.e. unconfined) on our Ubuntu desktop.

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

## Common Problem 1: Files are not where they’re expected to be!
duration: 5:00

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

### Using layouts for hard-coded paths

This experimental snapd feature bind-mounts directories inside the snap into any location, so that the binaries’ hard-coded paths are correct. To use, add this to the YAML file:

```yaml
passthrough:
  layout:
    /usr/share/glmark2:
      bind: $SNAP/usr/share/glmark2
```

## First Pass Snapping (resumed)
duration: 3:00

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

## Common Problem 2: Unable to connect to Wayland server
duration 3:00

```
Error: main: Could not initialize canvas
```

This error message is not too helpful, but an important thing to check is if the Wayland socket can be found. If not, glmark2-wayland cannot create a surface/canvas.

The convention is that the Wayland socket directory is specified by the $XDG_RUNTIME_DIR environment variable. The default name for the socket is "wayland-0" but it can be different (specified by WAYLAND_DISPLAY).

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

### Common Problem 3: GL drivers are not where they usually are
duration 2:00

This is another typical problem for snapping graphics applications: the GL drivers it needs are bundled inside the snap, but the application needs to be told the path to those drivers inside the snap.

Is this "files are not where they're expected to be" yet again? Yes, but here we are lucky, there’s an environment variable  LIBGL_DRIVERS_PATH we can use to point libGL to the correct location for the GL driver files it needs (you could use layouts too, but this is more efficient)

So set LIBGL_DRIVERS_PATH=$SNAP/usr/lib/x86_64-linux-gnu/dri - and finally run

```bash
LIBGL_DRIVERS_PATH=$SNAP/usr/lib/x86_64-linux-gnu/dri \
XDG_RUNTIME_DIR=$XDG_RUNTIME_DIR/.. \
$SNAP/command-glmark2-wayland.wrapper
```

Which works! Woo! Finally! You deserve a nice cup of tea for that. Now we know what to fix, exit the snap environment with Ctrl+D.

positive
: **On a Desktop Environment that supports Wayland** you may find that glmark connects to that and not Mir.
This is easy to work around: tell Mir and the snap how to connect to each other:
```bash
miral-kiosk --wayland-socket-name mir-kiosk&
export WAYLAND_DISPLAY=mir-kiosk
snap run glmark2-wayland
```

negative
: **Referring to “/usr/lib/x86_64-linux-gnu/dri” means the snap will only function on amd64 machines.**
We will revisit this later to ensure the snap can be compiled to function on other architectures.


## First Pass Snapping: The Final Bits
duration: 4:00

We need to set those two environment variables before executing the binary inside the snap. One option is a simple launching script:
```
#!/bin/bash
LIBGL_DRIVERS_PATH=$SNAP/usr/lib/x86_64-linux-gnu/dri \
XDG_RUNTIME_DIR=$XDG_RUNTIME_DIR/.. \    
$SNAP/usr/bin/glmark2-wayland
```

and point the “command:” in the snapcraft.yaml file to it (don’t forget to install it in the snap!!)

Another option (which we will use here) is to adjust the `command:` file like this:
```yaml
...
    command: "bash -c 'XDG_RUNTIME_DIR=$(dirname $XDG_RUNTIME_DIR) LIBGL_DRIVERS_PATH=$(find $SNAP/usr/lib/ -name dri) $SNAP/usr/bin/glmark2-wayland'"
...
```

### The working YAML file:

```yaml
name: glmark2-wayland
version: 0.1
summary: GLMark2 on Wayland
description: |
  GLMark2 on Wayland
confinement: devmode
grade: devel

apps:
  glmark2-wayland:
    command: "bash -c 'XDG_RUNTIME_DIR=$(dirname $XDG_RUNTIME_DIR) LIBGL_DRIVERS_PATH=$(find $SNAP/usr/lib/ -name dri) $SNAP/usr/bin/glmark2-wayland'"
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

Rebuild the snap and install it - “snap run glmark2-wayland” should work fine.

```bash
snapcraft cleanbuild
sudo snap install --dangerous ./glmark2-wayland_0.1_amd64.snap --devmode
miral-kiosk&
snap run glmark2-wayland
```

Inside the Mir-on-X window, you should see the same graphical animations you saw earlier, and statistics printed to your console. The difference is that this time they are coming from a snap.

## First Pass Snapping: Notes
duration: 1:00

### Why did we step through that process instead of simply presenting the working .yaml?

Because snapping applications can reveal lots of hard-coded paths and assumptions that applications make, which snap confinement will break. It is good to understand the steps needed to debug and solve these problems.

There can be many, many environment variables and support files that need to be set up inside snaps, for applications to run correctly. Much of this work has already been done and automated in the *snapcraft-desktop-helpers* project, we will be using this in a follow-up tutorial.

### We now have a snap working with a desktop Wayland server
 
*But our goal is to have it working on Ubuntu Core on your chosen device.*

## Second Pass Snapping: Ubuntu Core
duration: 5:00

### Ubuntu Core Setup

Once you have set up Ubuntu Core on your device and logged in install the “mir-kiosk” snap.

```bash
snap install --beta mir-kiosk
```

Now you should have a black screen with a white mouse cursor.

"mir-kiosk" provides the graphical environment needed for running a graphical snap.

Next, you will need to enable the experimental “layouts” feature as we did on desktop:

```bash
sudo snap set core experimental.layouts=true
```

## Snapping for Ubuntu Core
duration: 3:00

Changing this snap .yaml to work with Ubuntu Core requires one main alteration: Wayland is provided by another snap: mir-kiosk, so we need to get the Wayland socket from it somehow.
    
The mir-kiosk snap has a content interface called “wayland-socket-dir” to share the Wayland socket with application snaps. Use this by making the following alterations to the YAML file:

Change `confinement` to "strict":
```yaml
...
confinement: strict
...
```
Set XDG_RUNTIME_DIR to "$SNAP_DATA/wayland":
```yaml
...
    command: "bash -c 'XDG_RUNTIME_DIR=$SNAP_DATA/wayland LIBGL_DRIVERS_PATH=$(find $SNAP/usr/lib/ -name dri) $SNAP/usr/bin/glmark2-wayland'"
...
```

Add a `plugs` stanza:
```yaml
...
plugs:
   wayland-socket-dir:
    content: wayland-socket-dir
    interface: content
    target: $SNAP_DATA/wayland
    default-provider: mir-kiosk
...
```
   
This additional snippet causes snapd to bind-mount the mir-kiosk Wayland socket directory into the glmark2-wayland’s namespace, in a location of its desire: $SNAP_DATA/wayland. Then we update the XDG_RUNTIME_DIR variable to match.

### The full YAML file:

```yaml
name: iot-example-graphical-snap
version: 0.1
summary: GLMark2 on Wayland
description: |
  GLMark2 on Wayland
confinement: strict
grade: devel

apps:
  glmark2-wayland:
    command: "bash -c 'XDG_RUNTIME_DIR=$SNAP_DATA/wayland LIBGL_DRIVERS_PATH=$(find $SNAP/usr/lib/ -name dri) $SNAP/usr/bin/glmark2-wayland'"
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

plugs:
   wayland-socket-dir:
    content: wayland-socket-dir
    interface: content
    target: $SNAP_DATA/wayland
    default-provider: mir-kiosk
```

Check this builds locally:
```bash
snapcraft cleanbuild
```
## Building for different architectures
duration: 10:00

One day, perhaps, snapcraft will fully support cross building with the `--target-arch` option. But getting that to work is beyond the scope of this tutorial. Instead we'll make use of Launchpad's builders to build the snap for all architectures (including the one your device provides).

Create a github repository for your snap and push your changes to the snap project there:

```bash
git commit -a
git remote remove origin
git remote add origin https://github.com/<project>/<repo>.git
git push -u origin master
```

Now [setup your build on Launchpad](https://docs.snapcraft.io/build-snaps/ci-integration). *Note that you will need to use the same snap name in the store as in name in `name:`, so chose something unique to make your life easier.*

Don't bother with publishing to the store (yet) you can download the snap and deploy it as follows:

On your desktop go to the snap webpage (e.g. https://code.launchpad.net/~alan-griffiths/+snap/iot-example-graphical-snap), find the build for your device architecture and download it and copy to your device. For example:
```bash
wget https://code.launchpad.net/~alan-griffiths/+snap/iot-example-graphical-snap/+build/226518/+files/iot-example-graphical-snap_0.1_arm64.snap
scp iot-example-graphical-snap_0.1_arm64.snap   alan-griffiths@192.168.1.159:~
```
On your ssh session to your device:
```bash
snap install --dangerous ./iot-example-graphical-snap_0.1_arm64.snap 
snap connect iot-example-graphical-snap:wayland-socket-dir  mir-kiosk:wayland-socket-dir
sudo snap run iot-example-graphical-snap.glmark2-wayland
```

On your device, you should see the same graphical animations you saw earlier (and statistics printed to your console).

## Congratulations
duration: 1:00

Congratulations, you have created your first graphical snap for Ubuntu Core.
