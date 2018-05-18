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
duration: 15:00

### A Virtual Machine
A good way to test graphical snaps on Ubuntu Core is to have a VM with Core installed and ready. This guide shows you how:
[https://developer.ubuntu.com/core/get-started/kvm](https://developer.ubuntu.com/core/get-started/kvm).

### A Device
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

This is not an exhaustive list. There may be other toolkits that can work with Wayland but we know these work witn Mir.
 
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

## 