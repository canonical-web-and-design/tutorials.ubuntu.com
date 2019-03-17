---
id: tutorial-create-a-usb-stick-on-macos
summary: How to write a USB stick with macOS.
categories: desktop
tags: tutorial,installation,usb,macOS,ubuntu,desktop
difficulty: 2
status: published
published: 2017-08-18
author: Canonical Web Team <webteam@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Create a bootable USB stick on macOS

## Overview
Duration: 1:00

With a bootable Ubuntu USB stick, you can:

- Install or upgrade Ubuntu, even on a Mac
- Test out the Ubuntu desktop experience without touching your PC configuration
- Boot into Ubuntu on a borrowed machine or from an internet cafe
- Use tools installed by default on the USB stick to repair or fix a broken configuration

Creating a bootable USB stick is very simple, especially if you're going to use the USB stick with a generic Windows or Linux PC. We're going to cover the process in the next few steps.

### Apple hardware considerations

There are a few additional considerations when booting the USB stick on Apple hardware. This is because Apple's 'Startup Manager', summoned by holding the Option/alt (⌥) key when booting, won't detect the USB stick without a specific partition table and layout. We'll cover this in a later step.

## Requirements
Duration: 1:00

You will need:

- A 2GB or larger USB stick/flash drive
- An Apple computer or laptop running macOS
- An Ubuntu ISO file. See [Get Ubuntu][getubuntu] for download links

## Prepare the USB stick
Duration: 5:00

To ensure maximum compatibility with Apple hardware, we're going to first blank and reformat the USB stick using Apple's 'Disk Utility'. But this step can be skipped if you intend to use the USB stick with only generic PC hardware.

- Launch *Disk Utility* from Applications>Utilities or Spotlight search
- Insert your USB stick and observe the new device added to Disk Utility
- Select the USB stick device (you may need to enable the option View>Show All Devices) and select `Erase` from the tool bar (or right-click menu)
- Set the format to `MS-DOS (FAT)` and the scheme to `GUID Partition Map`
- Check you've chosen the correct device and click `Erase`

![screenshot](https://assets.ubuntu.com/v1/e0915a12-36187570-fdfeafae-10fa-11e8-8b51-c9377a9b60de.png)

negative
: **Warning:** Disk Utility needs to be used with caution as selecting the wrong device or partition can result in data loss.

## Install and run Etcher
Duration: 2:00

To write the ISO file to the USB stick, we're going to use a free and open source application called [Etcher][etcher]. After downloading this and clicking to mount the package, Etcher can either be run in-place or dragged into your Applications folder.

By default, recent versions of macOS block the running of applications from unidentified developers. To side-step this issue, enable 'App Store and identified developers' in the 'Security & Privacy' pane of System Preferences. If you are still warned against running the application, click 'Open Anyway' in the same pane.

![screenshot](https://assets.ubuntu.com/v1/d8a3ee9d-macos-usb-etcher-run.png)

## Etcher configuration
Duration: 2:00

Etcher will configure and write to your USB device in three stages, each of which needs to be selected in turn:

- **Select image** will open a file requester from which should navigate to and select the ISO file downloaded previously. By default, the ISO file will be in your *Downloads* folder.  

- **Select drive**, replaced by the name of your USB device if one is already attached, lets you select your target device. You will be warned if the storage space is too small for your selected ISO.

- **Flash!** will activate when both the image and the drive have been selected. As with Disk Utility, Etcher needs low-level access to your storage hardware and will ask for your password after selection.

![screenshot](https://assets.ubuntu.com/v1/48b60ed0-macos-usb-etcher-config.png)

## Write to device
Duration: 3:00

After entering your password, Etcher will start writing the ISO file to your USB device.

The *Flash* stage of the process will show progress, writing speed and an estimated duration until completion. This will be followed by a validation stage that will ensure the contents of the USB device are identical to the source image.

When everything has finished, Etcher will declare the process a success.

Congratulations! You now have Ubuntu on a USB stick, bootable and ready to go.

![screenshot](https://assets.ubuntu.com/v1/9e8704ce-macos-usb-etcher-success.png)

negative
: **Warning:** After the write process has completed, macOS may inform you that 'The disk you inserted was not readable by this computer'. Don't select *Initialise*. Instead, select ***Eject*** and remove the USB device.

## Boot your Mac
Duration: 3:00

If you want to use your USB stick with an Apple Mac, you will need to restart or power-on the Mac with the USB stick inserted **while** the `Option/alt` *(⌥)* key is pressed.

This will launch Apple's 'Startup Manager' which shows bootable devices connected to the machine. Your USB stick should appear as gold/yellow and labelled 'EFI Boot'. Selecting this will lead you to the standard Ubuntu boot menu.

![screenshot](https://assets.ubuntu.com/v1/ee39c875-macos-usb-efi-boot.png)

### Finding help

If your Mac still refuses to boot off your USB stick you may find it easier to boot and install off an Ubuntu DVD instead. See our [How to burn a DVD on macOS][macdvd] for further details.

Alternatively, if you feel confident using the macOS command line, see the community documentation on [How to install Ubuntu on MacBook using USB Stick][macusb] for a more manual approach.

If you want to install Ubuntu, follow our [install Ubuntu desktop tutorial][installubuntu].

Finally, if you get stuck, help is always at hand:

* [Ask Ubuntu][askubuntu]
* [Ubuntu Forums][ubuntuforums]
* [IRC-based support][ircsupport]

<!-- LINKS -->
[getubuntu]: https://www.ubuntu.com/download
[macusb]: https://help.ubuntu.com/community/How%20to%20install%20Ubuntu%20on%20MacBook%20using%20USB%20Stick
[installubuntu]: https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-desktop#0
[macdvd]: https://tutorials.ubuntu.com/tutorial/tutorial-burn-a-dvd-on-macos#0
[askubuntu]: https://askubuntu.com/
[ubuntuforums]: https://ubuntuforums.org/
[ircsupport]: https://wiki.ubuntu.com/IRC/ChannelList
[etcher]: https://etcher.io/
