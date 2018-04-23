---
id: tutorial-install-ubuntu-server
summary: Turn your PC into a powerful server, capable of delivering anything from file sharing and local backup, to fully fledged web sites and beyond, using Ubuntu Server 18.04 LTS.
categories: server
tags: tutorial,installation,ubuntu,server,18.04,LTS
difficulty: 2
status: published
published: 2018-04-19
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Canonical Web Team <webteam@canonical.com>

---

# Install Ubuntu Server

## Overview
Duration: 0:01

Ubuntu Server is a variant of the standard Ubuntu you already know, tailored for networks and services. It's just as capable of running a simple file server as it is operating within a 50,000 node cloud.

Unlike the installation of Ubuntu Desktop, Ubuntu Server does not include a graphical installation program. Instead, it uses a text menu-based process. If you'd rather install the desktop version, take a look at our [Install Ubuntu desktop][tut-desktop] tutorial.

This guide will provide an overview of the installation from either a DVD or a USB flash drive.

For a more detailed guide on Ubuntu Server's capabilities and its configuration, take a look at our the [Community Ubuntu Server  documentation][docs-server].


## Requirements
Duration: 0:01

You'll need to consider the following before starting the installation:

* Ensure you have at least 2GB of free storage space.
* Have access to either a DVD or a USB flash drive containing the version of Ubuntu Server you want
  to install.
* If you're going to install Ubuntu Server alongside data you wish to keep, ensure you have a recent backup.

See the [server guide pages][sys-req] for more specific details on hardware requirements. We also have [several tutorials](/) that explain how to create an Ubuntu DVD or USB flash drive.

## Boot from install media
Duration: 2:00

To trigger the installation process, perform the following:

1. Put the Ubuntu DVD into your DVD drive (or insert the USB stick or other install media).
1. Restart your computer.

After a few moments, you should see messages like those shown below on the screen...

![screenshot][first-boot]

Most computers will automatically boot from USB or DVD, though in some cases this is disabled to improve boot times. If you don't see the boot message and the "Welcome" screen which should appear after it, you will need to set your computer to boot from the install media.

There should be an on-screen message when the computer starts telling you what key to press for settings or a boot menu. Depending on the manufacturer, this could be `Escape`, `F2`,`F10` or `F12`. Simply restart your computer and hold down this key until the boot menu appears, then select the drive with the Ubuntu install media.

If you are still having problems, check out the [Ubuntu Community documentation on booting from CD/DVD][docs-dvd].

## Choose your language

After the boot messages appear, a 'Language' menu will be displayed. 

![screenshot][menu-language]

As the message suggests, use the `Up`, `Down` and `Enter` keys to navigate through the menu and select the language you wish to use.



## Choose the correct keyboard layout
Duration: 1:00

Before you need to type anything in, the installer will next display a menu asking you to select your keyboard layout and, if applicable, the variant.

![screenshot][menu-layout]

If you don't know which particular variant you want, just go with the default - when Ubuntu Server has been installed you can test and change your preferences more easily if necessary.

![screenshot][menu-variant]


## Choose your install
Duration: 1:00

Now we are ready to select what you want to install. There are three options in the menu:

![screenshot][menu-install]

The bottom two options are used for installing specific components of a Metal As A Service (MAAS) install. If you are installing MAAS, you should check out the [MAAS documentation][docs-maas] for more information on this! The rest of this tutorial assumes you select the first option, `Install Ubuntu`.


## Networking
Duration: 1:02

The installer will automatically detect and try to configure any network connections via DHCP.

![screenshot][menu-network]

This is usually automatic and you will not have to enter anything on this screen, it is for information only.

positive
: If no network is found, the installer can continue anyway, it just won't be able to check for updates. You can always configure networking after installation.

## Configure storage
Duration: 2:02

The next step is to configure storage. The recommended install is to have an entire disk or partition set aside for running Ubuntu.
![screenshot][menu-filesystem]

If you need to set up a more complicated system, the manual option will allow you to select and reorganise partitions on any connected drives.

positive
: Note that Ubuntu no longer *requires* a separate partition for swap space, nor will the automated install create one. 

## Select a device
Duration: 2:00

This menu will allow you to select a disk from the ones detected on the system.

![screenshot][menu-disk]

To help identification, the drives will be listed using their system ID. Use the arrow keys and enter to select the disk you wish to use.

## Confirm partitions
Duration: 2:00

With the target drive selected, the installer will calculate what partitions to create and present this information...

![screenshot][menu-mount]

If this isn't what you expected to see (e.g., you have selected the wrong drive), you should use the arrow keys and enter to select `Back` from the options at the bottom of the screen. This will take you back to the previous menu where you can select a different drive.

It is also possible to manually change the partitions here, by selecting `Edit Partitions`. Obviously you should only select this if you are familiar with how partitions work.

When you are happy with the disk layout displayed, select `Done` to continue.

## Confirm changes
Duration: 1:00

Before the installer makes any destructive changes, it will show this final confirmation step. Double check that everything looks good here and you aren't about to reformat the wrong device!

![screenshot][menu-confirm]

negative
: There is no "Undo" for this step, once you confirm the changes, the indicated devices will be overwritten and any contents may be lost

## Set up a Profile
Duration: 2:00

The software is now being installed on the disk, but there is some more information the installer needs. Ubuntu Server needs to have at least one known user for the system, and a hostname. The user also needs a password.

![screenshot][menu-profile]

positive
: There is also a field for importing SSH keys, either from Launchpad, Ubuntu One or Github. You simply need to enter the username and the installer will fetch the relevant keys and install them on the system ready for use (e.g. secure SSH login to the server).

## Install software
Duration: 6:00

Once you have finished entering the required information, the screen will now show the progress of the installer. Ubuntu Server now installs a concise set of useful software required for servers. This cuts down on the install and setup time dramatically. Of course, after the install is finished, you can install any additional software you may need.

![screenshot][menu-installing]

## Installation complete
Duration: 1:00

When the install is complete, you will see a message like this on the screen.

![screenshot][menu-complete]

Remember to remove the install media, and then press enter to reboot and start the server. Welcome to Ubuntu!

## What next?
Duration: 2:00

With Ubuntu Server installed, you can now carry on and build that file-server or multi-node cluster we mentioned! 

If you are new to Ubuntu Server, we'd recommend reading the [Server Guide][docs-server].

You can also check out the latest on Ubuntu Server, and what others are using it for on the [Ubuntu Server pages][ubuntu-server].

### Finding help


The Ubuntu community, for both desktop and server, is one of the friendliest and most well populated you can find. That means if you get stuck, someone has probably already seen and solved the same problem.

Try asking for help in one of the following places:

* [Ask Ubuntu][ask-ubuntu]
* [Ubuntu Forums][ubuntu-forums]
* [IRC-based support][irc-channels]

Alternatively, if you need commercial support for your server deployments, take a look at [Ubuntu Advantage][ubuntu-advantage].

[ask-ubuntu]: https://askubuntu.com/
[ubuntu-forums]: https://ubuntuforums.org/
[irc-channels]: https://wiki.ubuntu.com/IRC/ChannelList
[ubuntu-advantage]: https://www.ubuntu.com/support
[tut-desktop]: https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-desktop
[docs-dvd]: https://help.ubuntu.com/community/BootFromCD
[docs-server]: https://help.ubuntu.com/lts/serverguide/installation.html
[docs-maas]: https://docs.maas.io
[ubuntu-server]: https://www.ubuntu.com/server
[sys-req]: https://help.ubuntu.com/lts/serverguide/preparing-to-install.html#system-requirements
[login]: https://assets.ubuntu.com/v1/fcc62c28-server-welcome.png
[first-boot]: https://assets.ubuntu.com/v1/cb8b8b52-subiquity-001.png
[menu-language]: https://assets.ubuntu.com/v1/4204ca86-subiquity-002.png
[menu-layout]: https://assets.ubuntu.com/v1/a5916085-subiquity-003.png
[menu-variant]: https://assets.ubuntu.com/v1/cb6da5b2-subiquity-005.png
[menu-install]: https://assets.ubuntu.com/v1/9e78e2a5-subiquity-006.png
[menu-network]: https://assets.ubuntu.com/v1/4f5b1e6c-subiquity-007.png
[menu-filesystem]: https://assets.ubuntu.com/v1/a0a317a2-subiquity-008.png
[menu-disk]: https://assets.ubuntu.com/v1/a06039ce-subiquity-009.png
[menu-mount]: https://assets.ubuntu.com/v1/64c29c92-subiquity-010.png
[menu-confirm]: https://assets.ubuntu.com/v1/7a74972a-subiquity-011.png
[menu-profile]: https://assets.ubuntu.com/v1/0958a436-subiquity-012.png
[menu-installing]: https://assets.ubuntu.com/v1/cefe8947-subiquity-013.png
[menu-complete]: https://assets.ubuntu.com/v1/9fa51259-subiquity-014.png
