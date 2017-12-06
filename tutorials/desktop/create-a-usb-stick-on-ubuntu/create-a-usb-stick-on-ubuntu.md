---
id: tutorial-create-a-usb-stick-on-ubuntu
summary: Use your Ubuntu desktop to create a bootable USB stick that can be used to run and install Ubuntu on any USB-equipped PC.
categories: desktop
tags: tutorial,installation,usb,ubuntu,desktop
difficulty: 2
status: published
published: 2017-07-11
author: Canonical Web Team <webteam@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Create a bootable USB stick on Ubuntu

## Overview
Duration: 0:01

With a bootable Ubuntu USB stick, you can:

- Install or upgrade Ubuntu
- Test out the Ubuntu desktop experience without touching your PC configuration
- Boot into Ubuntu on a borrowed machine or from an internet cafe
- Use tools installed by default on the USB stick to repair or fix a broken configuration

Creating a bootable Ubuntu USB stick is very simple, especially from Ubuntu itself, and we're going to cover the process in the next few steps.

Alternatively, we also have tutorials to help you create a bootable USB stick from both [Microsoft Windows][usbwindows] and [Apple macOS][usbmacos].

![image](https://assets.ubuntu.com/v1/0e7183ed-laptop-ubuntu.png)

## Requirements
Duration: 0:01

You will need:

- A 2GB or larger USB stick/flash drive
- Ubuntu Desktop 14.04 or later installed
- An Ubuntu ISO file. See [Get Ubuntu][getubuntu] for download links

![screenshot](https://assets.ubuntu.com/v1/bfb2d510-ubuntu-iso-download.png)

## Launch Startup Disk Creator

We're going to use an application called 'Startup Disk Creator' to write the ISO image to your USB stick. This is installed by default on Ubuntu, and can be launched as follows:

1. Insert your USB stick (select 'Do nothing' if prompted by Ubuntu)
1. Use the top left icon to open the dash and search for *Startup Disk Creator*
1. Select **Startup Disk Creator** from the results to launch the application

![screenshot](https://assets.ubuntu.com/v1/e069dea2-ubuntu-startup-launch.png)

## ISO and USB selection
Duration: 0:02

When launched, Startup Disk Creator will ISO files in your *Downloads* folder, as well as any attached USB storage it can write to.

It's likely that both your Ubuntu ISO and the correct USB device will have been detected and set as 'Source disc image' and 'Disk to use' in the application window. If not, use the 'Other' button to locate your ISO file and select the exact USB device you want to use from the list of devices.

Click **Make Startup Disk** to start the process.

![screenshot](https://assets.ubuntu.com/v1/a03353ac-ubuntu-startup-options.png)

## Confirm USB device
Duration: 0:03

Before making any permanent changes, you will be asked to confirm the USB device you've chosen is correct. This is important because any data currently stored on this device will be destroyed.

After confirming, the write process will start and a progress bar appears.

![screenshot](https://assets.ubuntu.com/v1/dac30d7d-usb-1604-writing.png?w=550)

## Installation complete
Duration: 0:01

That's it! You now have Ubuntu on a USB stick, bootable and ready to go.

If you want to install Ubuntu, take a look at our [install Ubuntu desktop tutorial][ubuntudesktop].

![screenshot](https://assets.ubuntu.com/v1/e4bfc861-ubuntu-usb-installation-complete.png)

### Finding help

If you get stuck, help is always at hand:

* [Ask Ubuntu][askubuntu]
* [Ubuntu Forums][ubuntuforums]
* [IRC-based support][ircsupport]

<!-- LINKS -->
[usbwindows]: https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-windows
[usbmacos]: https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-macos
[getubuntu]: https://www.ubuntu.com/download
[ubuntudesktop]: https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-desktop
[askubuntu]: https://askubuntu.com/
[ubuntuforums]: https://ubuntuforums.org/
[ircsupport]: https://wiki.ubuntu.com/IRC/ChannelList
