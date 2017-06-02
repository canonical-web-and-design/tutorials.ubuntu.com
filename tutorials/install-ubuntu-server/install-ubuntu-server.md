---
id: tutorial-install-ubuntu-server
summary: A very high-level guide on how to install Ubuntu Server for genderal use.
categories: server
tags: tutorial,installation,ubuntu,server,Ubuntu 16.04 LTS
difficulty: 2
status: Published
published: 2017-05-31

---

# Installing Ubuntu Server for general use

## Getting started
Duration: 0:05

The basic steps to install Ubuntu Server from CD or USB stick are the same for installing any operating system. Unlike the desktop version, Ubuntu Server does not include a graphical installation program. Instead, it uses a console menu-based process.

positive
: Note - this is a very high-level guide. For a more detailed guide go to the [Ubuntu Server help documentation](https://help.ubuntu.com/lts/serverguide/installation.html
).

## Prepare a DVD or USB flash drive
Duration: 0:10

First, download and burn the ISO file from the [Ubuntu Server download page](https://www.ubuntu.com/download/server) and, if you want, [verify the download](/tutorial/tutorial-how-to-verify-ubuntu).



## Follow the installer process
Duration: 0:03

- Boot the system from the DVD or USB flash drive
- At the boot prompt you will be asked to select the language
- Select '**basic server install**'
- Enter appropriate options for language, keyboard layout, network configuration, hostname and timezone.

## Configure your hard disks
Duration: 0:10

You can then choose from several options to configure the hard drive layout.

There are many ways disk layout can be configured. For detailed information please read the [Installing from CD](https://help.ubuntu.com/lts/serverguide/installing-from-cd.html) documentation.

## Done.

The Ubuntu base system is then installed.

### Mass provisioning of Ubuntu Server

Ubuntu Server also includes a network-based provisioning system that uses Ubuntu’s Metal as a Service (MAAS) tool. Based on the industry-standard PXE network-boot protocol, MAAS enables the rapid, automated provisioning of many systems simultaneously.

Canonical’s Landscape further integrates MAAS technology with enterprise-class support for systems management and compliance requirements.

* [Learn how to configure your network for bare metal deployment via MAAS&nbsp;&rsaquo;](http://maas.ubuntu.com/?_ga=2.151938937.1948755355.1496325425-1409363030.1473341937)
* [Learn more about enterprise provisioning with Landscape&nbsp;&rsaquo;](https://landscape.canonical.com/landscape-features)

## Finding help

If you get stuck, help is always at hand.

* [Ask Ubuntu](https://askubuntu.com/)
* [Ubuntu Forums](https://ubuntuforums.org/)
* [IRC-based support](https://wiki.ubuntu.com/IRC/ChannelList)
