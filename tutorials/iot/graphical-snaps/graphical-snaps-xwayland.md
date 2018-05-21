---
id: graphical-snaps-xwayland
summary: 
categories: iot
status: draft
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: snap, digital-signage, kiosk, device, xwayland
difficulty: 3
published: 2018-05-21
author: Mir Team <mir-devel@lists.launchpad.net>

---

# Graphical Snaps for UbuntuCore: Using Xwayland

## Overview

negative
: Do not attempt this tutorial unless you are already familiar with the material in [Graphical Snaps for UbuntuCore](tutorial/graphical-snaps). This tutorial covers *only* the extra material needed when using toolkits that do not support Wayland directly.
 
[Graphical Snaps for UbuntuCore](tutorial/graphical-snaps) is a guide on how to create graphical snaps for Ubuntu Core with a single GUI application running fullscreen on the display. This addresses situations like:
* Digital signage
* Web kiosk
* Industrial machine User Interface

positive
: The combination of Snap, the "mir-kiosk" Wayland server and UbuntuCore ensures reliability and security of any graphical embedded device application.

### What you'll learn

How to create graphical snaps for Ubuntu Core using a toolkit that requires Xwayland to supports Wayland.

### What you'll need

You can follow the steps in this tutorial on any current release of Ubuntu. You'll also need a device (or a VM) with Ubuntu core installed.

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
 
Native support for Wayland the simplest case, as the application can talk to Mir directly.

positive
: You do not need this tutorial for these toolkits.

### No Wayland support

* GTK2
* Qt4
* Electron apps
* Java apps
* Chromium

This is a more complex case, as the toolkits require the legacy X11 protocol to function.

To enable these applications we will introduce an intermediary “Xwayland” which translates X11 calls to Wayland ones. Each snapped X11 application should have its own X11 server (Xwayland) which then talks Wayland - a far more secure protocol.

Xwayland will live in the application snap.

*If you are not familiar with the material in [Graphical Snaps for UbuntuCore](tutorial/graphical-snaps) please complete that first. This tutorial covers only the extra material needed when using toolkits that do not support Wayland directly.*

negative
: To use fully confined snaps which use Xwayland internally, you will also need a custom build of snapd master with the following patch added:
https://github.com/snapcore/snapd/pull/4545  (allows Xwayland to work confined in a snap)
For now this guide will proceed without application confinement.