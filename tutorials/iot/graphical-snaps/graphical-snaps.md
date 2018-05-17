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

## Ubuntu Core Setup

### On a Virtual Machine
A good way to test graphical snaps on Ubuntu Core is to have a VM with Core installed and ready. This guide shows you how:
https://developer.ubuntu.com/core/get-started/kvm

Inside Core, likely you will need to enable the “layouts” feature, which is still experimental:

```bash
sudo snap set core experimental.layouts=true
```

Then just install “mir-kiosk” snap:

```bash
snap install --beta mir-kiosk
```

Now you should have a black screen with a white mouse cursor.

negative
: To use fully confined snaps which use Xwayland internally, you will also need a custom build of snapd master with the following patch added:
https://github.com/snapcore/snapd/pull/4545  (allows Xwayland to work confined in a snap)
For now this guide will proceed without application confinement.

### On a Device