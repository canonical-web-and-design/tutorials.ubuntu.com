---
id: tutorial-install-ubuntu-desktop
summary: Discover how easy it is to install Ubuntu desktop onto your laptop or PC computer, from either a DVD or a USB flash drive.
categories: desktop
tags: tutorial,installation,ubuntu,desktop,Ubuntu 16.04 LTS
difficulty: 2
status: published
published: 2018-04-18
author: Canonical Web Team <webteam@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Install Ubuntu desktop

## Overview
Duration: 0:05

The Ubuntu desktop is easy to use, easy to install and includes everything you need to run your organisation, school, home or enterprise. It's also open source, secure, accessible and free to download.

![Bionic desktop](https://assets.ubuntu.com/v1/40f91c0b-bionic-desktop.png)

In this tutorial, we're going to install Ubuntu desktop onto your computer, using either your computer's DVD drive or a USB flash drive.

## Requirements
Duration: 0:01

You'll need to consider the following before starting the installation:

* Connect your laptop to a power source.
* Ensure you have at least 25GB of free storage space, or 5GB for a minimal installation.
* Have access to either a DVD or a USB flash drive containing the version of Ubuntu you want to install.
* Make sure you have a recent backup of your data. While it's unlikely that anything will go wrong, you can never be too prepared.

See [Installation/System Requirements](https://help.ubuntu.com/community/Installation/SystemRequirements) for more specific details on hardware requirements. We also have [several tutorials](/) that explain how to create an Ubuntu DVD or USB flash drive.

## Boot from DVD
Duration: 0:03

It’s easy to install Ubuntu from a DVD. Here’s what you need to do:

1. Put the Ubuntu DVD into your optical/DVD drive.
1. Restart your computer.

As soon as your computer boots you'll see the welcome window.

![Welcome window](https://assets.ubuntu.com/v1/3bab2654-ubuntu-install-try.png)

From here, you can select your language from a list on the left and choose between either installing Ubuntu directly, or trying the desktop first (if you like what you see, you can also install Ubuntu from this mode too).

Depending on your computer's configuration, you may instead see an alternative boot menu showing a large language selection pane. Use your mouse or cursor keys to select a language and you'll be presented with a simple menu. 

![boot menu](https://assets.ubuntu.com/v1/eded96d1-bionic-boot-menu.png)

Select the second option, 'Install Ubuntu', and press return to launch the desktop installer automatically. Alternatively, select the first option, 'Try Ubuntu without installing', to test Ubuntu (as before, you can also install Ubuntu from this mode too).

A few moments later, after the desktop has loaded, you'll see the welcome window. From here, you can select your language from a list on the left and choose between either installing Ubuntu directly, or trying the desktop first.

If you don’t get either menu, read the [booting from the DVD guide](https://help.ubuntu.com/community/BootFromCD?_ga=2.102380610.2115462233.1496186978-1155966827.1485186360) for more information.

## Boot from USB flash drive
Duration: 0:02

Most computers will boot from USB automatically. Simply insert the USB flash drive and either power on your computer or restart it. You should see the same welcome window we saw in the previous 'Install from DVD' step, prompting you to choose your language and either install or try the Ubuntu desktop.

If your computer doesn't automatically boot from USB, try holding `F12` when your computer first starts. With most machines, this will allow you to select the USB device from a system-specific boot menu.

positive
: F12 is the most common key for bringing up your system's boot menu, but Escape, F2 and F10 are common alternatives. If you're unsure, look for a brief message when your system starts - this will often inform you of which key to press to bring up the boot menu.

## Prepare to install Ubuntu
Duration: 0:01

You will first be asked to select your keyboard layout. If the installer doesn't guess the default layout correctly, use the 'Detect Keyboard Layout' button to run through a brief configuration procedure. 

After selecting *Continue* you will be asked *What apps would you like to install to start with?* The two options are 'Normal installation' and 'Minimal installation'. The first is the equivalent to the old default bundle of utilities, applications, games and media players - a great launchpad for any Linux installation. The second takes considerably less storage space and allows you to install only what you need.

Beneath the installation-type question are two checkboxes; one to enable updates while installing and another to enable third-party software.

- We advise enabling both `Download updates` and `Install third-party software`.
- Stay connected to the internet so you can get the latest updates while you install Ubuntu.
- If you are not connected to the internet, you will be asked to select a wireless network, if available. We advise you to connect during the installation so we can ensure your machine is up to date

![Select install size, updates and third part software](https://assets.ubuntu.com/v1/a0969096-bionic-install-updates.png)

## Allocate drive space
Duration: 0:01

Use the checkboxes to choose whether you’d like to install Ubuntu alongside another operating system, delete your existing operating system and replace it with Ubuntu, or — if you’re an advanced user — choose the ’**Something else**’ option.

![Set up storage configuration](https://assets.ubuntu.com/v1/63da6024-bionic-install-storage.png)

positive
: Options related to side-by-side installation or erasing a previous installation are only offered when pre-existing installations are detected.

## Begin installation
Duration: 0:01

After configuring storage, click on the 'Install Now' button. A small pane will appear with an overview of the storage options you've chosen, with the chance to go back if the details are incorrect.

Click `Continue` to fix those changes in place and start the installation process.

![Write changes to disks](https://assets.ubuntu.com/v1/1841ea5f-bionic-install-overwrite.png)

## Select your location
Duration: 0:01

If you are connected to the internet, your location will be detected automatically. Check your location is correct and click ’Forward’ to proceed.

If you’re unsure of your time zone, type the name of a local town or city or use the map to select your location.

![Where are you](https://assets.ubuntu.com/v1/a5274634-bionic-install-location.png)

positive
: If you’re having problems connecting to the Internet, use the menu in the top-right-hand corner to select a network.

## Login details
Duration: 0:01

Enter your name and the installer will automatically suggest a computer name and username. These can easily be changed if you prefer. The computer name is how your computer will appear on the network, while your username will be your login and account name.

Next, enter a strong password. The installer will let you know if it's too weak.

You can also choose to enable automatic login and home folder encryption. If your machine is portable, we recommend keeping automatic login disabled and enabling encryption. This should stop people accessing your personal files if the machine is lost or stolen.

![Username and password entry](https://assets.ubuntu.com/v1/abd7511b-bionic-install-password.png)

: If you enable home folder encryption and you forget your password, you won't be able to retrieve any personal data stored in your home folder.

## Background installation
Duration: 0:20

The installer will now complete in the background while the installation window teaches you a little about how awesome Ubuntu is. Depending on the speed of your machine and network connection, installation should only take a few minutes.

![Installer running in the background](https://assets.ubuntu.com/v1/4e2f9df7-bionic-install-installation.png)

## Installation complete
Duration: 0:01

After everything has been installed and configured, a small window will appear asking you to restart your machine. Click on `Restart Now` and remove either the DVD or USB flash drive when prompted. If you initiated the installation while testing the desktop, you also get the option to continue testing.

![screenshot](https://assets.ubuntu.com/v1/f4e2a592-download-desktop-install-ubuntu-desktop_10.jpg)

Congratulations! You have successfully installed the world's most popular Linux operating system!

It's now time to start enjoying Ubuntu!

### Finding help

If you get stuck, help is always at hand.

* [Ask Ubuntu](https://askubuntu.com/)
* [Ubuntu Forums](https://ubuntuforums.org/)
* [IRC-based support](https://wiki.ubuntu.com/IRC/ChannelList)
