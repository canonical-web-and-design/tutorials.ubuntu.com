---
id: tutorial-create-a-usb-stick-on-windows
summary: How to write a USB stick with Windows.
categories: desktop
tags: tutorial,installation,usb,windows,ubuntu,desktop
difficulty: 2
status: Published
published: 2017-07-18
author: Canonical Web Team <webteam@canonical.com>

---

# Create a bootable USB stick on Windows

## Overview
Duration: 1:00

With a bootable Ubuntu USB stick, you can:

- Install or upgrade Ubuntu
- Test out the Ubuntu desktop experience without touching your PC configuration
- Boot into Ubuntu on a borrowed machine or from an internet cafe
- Use tools installed by default on the USB stick to repair or fix a broken
  configuration

Creating a bootable Ubuntu USB stick from Microsoft Windows is very simple and we're going to cover the process in the next few steps.

Alternatively, we also have tutorials to help you create a bootable USB stick from both [Ubuntu][usbubuntu] and [Apple macOS][usbmacos].

![image](https://assets.ubuntu.com/v1/0e7183ed-laptop-ubuntu.png)

## Requirements
Duration: 1:00

You will need:

- A 2GB or larger USB stick/flash drive
- Microsoft Windows XP or later
- [Rufus][rufus], a free and open source USB stick writing tool
- An Ubuntu ISO file. See [Get Ubuntu][getubuntu] for download links

![screenshot](https://assets.ubuntu.com/v1/5b12fa72-windows-ubuntu-download.png)


negative
: Take note of where your browser saves downloads: this is normally a directory called 'Downloads' on your Windows PC. Don't download the ISO image directly to the USB stick!

## USB selection
Duration: 0:30

Perform the following to configure your USB device in Rufus:

1. Launch Rufus
1. Insert your USB stick
1. Rufus will update to set the device within the **Device** field
1. If the **Device** is incorrect, select the correct one from the device field's drop-down menu

![screenshot](https://assets.ubuntu.com/v1/05ce99d3-windows-rufus-usb.png)

positive
: You can avoid the hassle of selecting from a list of USB devices by ensuring no other devices are connected.

## Partition scheme and ISO selection
Duration: 0:30

For best compatibility with newer hardware, keep the *Partition scheme and target system type* set as **MBR partition scheme for UEFI**. However, if you need to use the USB stick with older hardware, change this to **MBR Partition Scheme for BIOS or UEFI**.

To select the Ubuntu ISO file, click the optical drive icon alongside the enabled *Create a bootable disk using* field. This will open a file requester from which you can navigate to, and select, the ISO file.

![screenshot](https://assets.ubuntu.com/v1/bf445ed7-windows-usb-iso.png)

## Hybrid image confirmation
Duration: 0:30

Leave all other parameters with their default values and click **Start** to initiate the write process.

You will then be alerted that Rufus has detected that the Ubuntu ISO is an *ISOHybrid image*. This means the same image file can be used as the source for both a DVD and a USB stick without requiring conversion.

Keep *Write in ISO Image mode* selected and click on **OK** to continue.

![screenshot](https://assets.ubuntu.com/v1/9ae6e41c-windows-usb-hybrid.png)

Rufus will warn that all data on your selected USB device is about to be destroyed. This is a good moment to double check you've selected the correct device before clicking **OK** when you're confident you have.

negative
: If your USB stick contains multiple partitions Rufus will warn you in a separate pane that these will also be destroyed.

## Write the ISO
Duration: 3:00

The ISO will now be written to your USB stick, and the progress bar in Rufus will give you some indication of how long this will take. With a reasonably modern machine, this should take around 3 minutes.

![screenshot](https://assets.ubuntu.com/v1/2a4834f4-windows-rufus-progress.png)

## Installation complete
Duration: 1:00

Rufus will complete the write process and silently drop-back to its default window.

Congratulations! You now have Ubuntu on a USB stick, bootable and ready to go. 

If you want to install Ubuntu, take a look at our [install Ubuntu desktop tutorial][ubuntudesktop].

### Finding help

If you get stuck, help is always at hand:

* [Ask Ubuntu][askubuntu]
* [Ubuntu Forums][ubuntuforums]
* [IRC-based support][ircsupport]

<!-- LINKS -->
[usbubuntu]: https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-ubuntu
[usbmacos]: https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-macos
[getubuntu]: https://www.ubuntu.com/download
[ubuntudesktop]: https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-desktop
[askubuntu]: https://askubuntu.com/
[ubuntuforums]: https://ubuntuforums.org
[ircsupport]: https://wiki.ubuntu.com/IRC/ChannelList
[rufus]: https://rufus.akeo.ie/

