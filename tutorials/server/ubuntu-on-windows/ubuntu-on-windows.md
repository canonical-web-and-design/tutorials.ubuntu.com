---
id: tutorial-ubuntu-on-windows
summary: Get access to the unrivalled power of the Ubuntu terminal, including tools such as SSH, apt and vim, directly on your Windows 10 computer.
categories: server
tags: tutorial,installation,windows,ubuntu,terminal
difficulty: 2
status: published
published: 2018-01-05
author: Graham Morrison <graham.morrison@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Install Ubuntu on Windows 10
Duration: 1:00

## Overview

The wonderful Ubuntu terminal is [freely available][msubuntu] for Windows 10.

As any Linux user knows, it's the command line terminal where the magic happens. It's perfect for file management, development, remote administration and a thousand other tasks.

The Ubuntu terminal for Windows has many of the same features you'll find using the terminal on Ubuntu:

- Unrivalled breadth of packages, updates and security features
- Bash, Z-Shell, Korn and other shell environments without virtual machines or dual-booting
- Run native tools such as SSH, git, apt and dpkg directly from your Windows computer
- A huge community of friendly, approachable users

![screenshot](https://assets.ubuntu.com/v1/00e5322f-win10-ubuntu-trusted-app.png)

## Requirements
Duration: 1:00

You will need a x86 PC running Windows 10.

Windows 10 needs to be updated to include the [Windows 10 Fall Creator update][win10fall], released October 2017. This update includes the **Windows Subsystem for Linux** which is needed to run the Ubuntu terminal.

![screenshot](https://assets.ubuntu.com/v1/dbc96044-win10-ubuntu-fall-update.png)

## Install Ubuntu for Windows 10
Duration: 2:00

Ubuntu can be installed from the Microsoft Store:

1. Use the Start menu to launch the Microsoft Store application. 
1. Search for *Ubuntu* and select the first result, 'Ubuntu', published by Canonical Group Limited.
1. Click on the *Install* button.

Ubuntu will be downloaded and installed automatically. Progress will be reported within the Microsoft Store application. 

![screenshot](https://assets.ubuntu.com/v1/13ab8b2c-win10-ubuntu-store.png)

## Launch Ubuntu on Windows 10
Duration: 2:00

Ubuntu can now be launched in the same way as any other Windows 10 application, such as searching for and selecting Ubuntu in the Start menu.

### First launch

When launched for the first time, Ubuntu will inform you that it's 'Installing' and you'll need to wait a few moments.

When complete, you'll be asked for a username and password specific to your Ubuntu installation. These don't need to be the same as your Windows 10 credentials. With this step complete, you'll find yourself at the Ubuntu bash command line.

![screenshot](https://assets.ubuntu.com/v1/2d30f071-win10-ubuntu-first-run.png)

Congratulations! You have successfully installed and activated the Ubuntu terminal on Windows 10. You now have all the power of the command line at your fingertips.

## Getting help
Duration: 1:00

If you need some guidance getting started with the Ubuntu terminal, take a look at the [community documentation][commdocs], and if you get stuck, help is always at hand:

* [Ask Ubuntu][askubuntu]
* [Ubuntu Forums][forums]
* [IRC-based support][ubuntuirc]

<!-- LINKS -->
[msubuntu]: https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6
[getstartedcli]: https://help.ubuntu.com/community/UsingTheTerminal
[storelink]: ms-windows-store://pdp/?productid=9NBLGGH4MSV6&referrer=unistoreweb&scenario=click&webig=11a9a85f-44f0-4cf5-ac1f-d9e148f2c23b&muid=01A3F9D8DEC2605B1426F331DF03617B
[win10fall]:https://support.microsoft.com/en-gb/help/4028685/windows-10-get-the-fall-creators-update
[commdocs]: https://help.ubuntu.com/community/UsingTheTerminal
[askubuntu]: https://askubuntu.com/
[forums]: https://ubuntuforums.org/
[ubuntuirc]: https://wiki.ubuntu.com/IRC/ChannelList
