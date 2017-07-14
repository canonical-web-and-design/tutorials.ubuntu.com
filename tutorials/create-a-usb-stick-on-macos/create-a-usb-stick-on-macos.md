---
id: tutorial-create-a-usb-stick-on-macos
summary: How to write a USB stick with macOS.
categories: desktop
tags: tutorial,installation,usb,macOS,ubuntu,desktop
difficulty: 2
status: Published
published: 2017-07-13
author: Canonical Web Team <webteam@canonical.com>

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
- Select the USB stick device and select `Erase` from the tool bar (or right-click menu)
- Set the format to `MS-DOS (FAT)` and the scheme to `GUID Partition Map`
- Check you've chosen the correct device and click `Erase`

![screenshot](https://assets.ubuntu.com/v1/b50caa3d-macos-usb-format.png)

negative
: **Warning:** Disk Utility needs to be used with caution as selecting the wrong device or partition can result in data loss.

## Install and run UNetbootin
Duration: 2:00

To write the ISO file to the USB stick, we're going to use a free and open source application called [UNetbootin][unetbootin]. After downloading this and clicking to mount the package, UNetbootin can either be run in-place or dragged into your Applications folder. 

By default, recent versions of macOS block the running of applications from unidentified developers. To side-step this issue, enable 'App Store and identified developers' in the 'Security & Privacy' pane of System Preferences. If you are still warned against running the application, click 'Open Anyway' in the same pane. 

![screenshot](https://assets.ubuntu.com/v1/4db3ce4f-macos-usb-run.png)

## UNetbootin configuration
Duration: 2:00

As with Disk Utility, UNetbootin needs low-level access to your storage hardware and will ask for your password.

The main window will then appear, containing the following three sections:

- **Distribution** can be ignored as it allows you to download an ISO from within UNetbootin itself

- **Diskimage**  needs to point at the ISO file downloaded previously. Use the `...` button to open a file requester. A peculiarity of UNetbootin is that it opens the root home folder, rather than your own home folder. This means you need to navigate through *Users>username>Downloads* to get to your ISO file

- **Type** contains the USB stick location. If this is incorrect, use the *Drive* drop-down menu to select your device 

![screenshot](https://assets.ubuntu.com/v1/c0670761-macos-usb-unetbootin.png)

positive
: If UNetbootin fails to detect your USB stick, try using Disk Utility again to re-format your USB device.

## Confirm and create device
Duration: 4:00

After one final check over your chosen ISO and USB device, click `OK` to start the write process.

UNetbootin will switch to a status view that steps through download, file extraction, installation and completion. This should take just a few minutes to complete.

When everything has finished, UNetbootin will declare the process a success.

Congratulations! You now have Ubuntu on a USB stick, bootable and ready to go. 

![screenshot](https://assets.ubuntu.com/v1/db3abc95-macos-usb-write.png)

## Boot your Mac
Duration: 3:00

If you want to use your USB stick with an Apple Mac, you will need to restart or power-on the Mac with the USB stick inserted **while** the `Option/alt` *(⌥)* key is pressed.

This will launch Apple's 'Startup Manager' which shows bootable devices connected to the machine. Your USB stick should appear as gold/yellow and labelled 'EFI Boot'. Selecting this will lead you to the standard Ubuntu boot menu.

![unetbootin complete](https://assets.ubuntu.com/v1/ee39c875-macos-usb-efi-boot.png)

### Finding help

If your Mac still refuses to boot off your USB stick you may find it easier to boot and install off an Ubuntu DVD instead. See our [How to burn a DVD on macOS][macdvd] for further details.

Alternatively, if you feel confident using the macOS command line, see the community documentation on [How to install Ubuntu on MacBook using USB Stick][macusb] for a more manual approach.

If you want to install Ubuntu, follow our [install Ubuntu desktop tutorial][installubuntu].

Finally, if you get stuck, help is always at hand:

* [Ask Ubuntu][askubuntu]
* [Ubuntu Forums][ubuntuforums]
* [IRC-based support][ircsupport]

<!-- LINKS -->
[unetbootin]: https://unetbootin.github.io
[getubuntu]: https://www.ubuntu.com/download
[macusb]: https://help.ubuntu.com/community/How%20to%20install%20Ubuntu%20on%20MacBook%20using%20USB%20Stick 
[installubuntu]: https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-desktop#0
[macdvd]: https://tutorials.ubuntu.com/tutorial/tutorial-burn-a-dvd-on-macos#0
[askubuntu]: https://askubuntu.com/
[ubuntuforums]: https://ubuntuforums.org/
[ircsupport]: https://wiki.ubuntu.com/IRC/ChannelList
