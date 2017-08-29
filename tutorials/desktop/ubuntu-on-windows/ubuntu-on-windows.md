---
id: tutorial-ubuntu-on-windows
summary: Get access to the unrivalled power of the Ubuntu terminal, including tools such as SSH, apt and vim, directly on your Windows 10 computer.
categories: desktop
tags: tutorial,installation,windows,ubuntu,terminal
difficulty: 2
status: Published
published: 2017-08-25
author: Graham Morrison <graham.morrison@canonical.com>

---

# Install Ubuntu in Windows 10
Duration: 1:00

## Overview

The wonderful Ubuntu terminal is [freely available][msubuntu] for Windows 10.

As any Linux user knows, it's the command line terminal where the magic happens. It's perfect for file management, development, remote administration and a thousand other tasks.

The Ubuntu terminal for Windows has many of the same features you'll find using the terminal on Ubuntu:

- Unrivalled breadth of packages, updates and security features
- Bash, Z-Shell, Korn and other shell environments without virtual machines or dual-booting
- Run native tools such as SSH, git, apt and dpkg directly from your Windows computer
- A huge community of friendly, approachable users

positive
: Currently, packages that require a graphical interface will not work from the Ubuntu terminal.

![screenshot](https://assets.ubuntu.com/v1/86b2a146-win10-ubuntu-startmenu.png)

## Requirements
Duration: 1:00

You will need a x86 PC running Windows 10.

More importantly, the Ubuntu terminal for Windows 10 is currently only available as part of Microsoft's free [Windows Insider Program][windowsinsider]. This lets you test pre-release software and upcoming versions of Windows while potentially allowing Microsoft to collect usage information.

If stability and privacy are essential for your installation, consider waiting for the [Windows 10 Fall Creator update][win10fall], due October 2017. With this release, installing the Ubuntu terminal won't require Windows Insider membership.

![screenshot](https://assets.ubuntu.com/v1/da4c0355-win10-ubuntu-insider.png)

## Join Windows Insider
Duration: 3:00

If you're already a member of the Windows Insider Program, skip to the next step. If not, open the following link in your favourite web browser:

[https://insider.windows.com/en-us/getting-started/](https://insider.windows.com/en-us/getting-started/)

To enrol, sign in using the same Microsoft personal account you use for Windows 10 and follow the *Register your personal account* link from the Insider Program getting started page. Accept the terms and conditions to complete the registration.

You now need to open Windows 10 *Settings* from the Start menu, select 'Updates & Security' followed by 'Windows Insider Program' from the menu on the left.

![screenshot](https://assets.ubuntu.com/v1/c4ad72ed-win10-ubuntu-settings.png)

If necessary, click on the 'Fix me' button if Windows complains that 'Your Windows Insider Program account needs attention'.

## Windows Insider content
Duration: 1:00

From the Windows Insider Program pane, select 'Get Started'. If your Microsoft account isn't linked to your Windows 10 installation, sign in when prompted and select the account you want to link to your installation.

You will now be able to select what kind of content you'd like to receive from the Windows Insider Program. The least disruptive is the default option, *Just fixes, apps and drivers*. Select *Confirm* (twice) and allow Windows to restart your machine. After booting, it's likely you'll need to wait for your machine to install a variety of updates before you can move on to the next step.
 
![screenshot](https://assets.ubuntu.com/v1/35588b47-win10-ubuntu-content.png) 

## Activate the Windows Subsystem for Linux
Duration: 2:00

While Ubuntu does appear when searched for within the Windows Store, it currently needs to be installed and activated separately, starting with the Windows Subsystem for Linux:

1. Search the Start menu for 'Windows features' and select the resultant control panel
1. Scroll through the *Windows Features* pane and enable **Windows Subsystem for Linux (Beta)**
1. Press OK to activate the changed configuration

When prompted, restart your machine. 

![screenshot](https://assets.ubuntu.com/v1/c18526f7-win10-ubuntu-features.png)

## Enable Developer Mode
Duration: 2:00

After your PC has restarted, one final step is required before we can install Ubuntu for Windows, and that's enabling Developer Mode. Enabling this allows you to install and run apps from outside the Windows Store:

1. Open the *Settings* pane from the Start menu
1. Select *Update & security* and then *For developers* from the left-hand menu
1. Enable the *Developer mode* toggle and accept the warning

![screenshot](https://assets.ubuntu.com/v1/89947730-win10-ubuntu-devmode.png)

## Install Ubuntu for Windows 10
Duration: 2:00

Open the Windows Command Prompt. The easiest way to do this is to type **cmd** into the Start menu and run the default result.

When the command prompt appears, type **bash**. The output from this command will announce that Ubuntu for Windows is about to be installed. Type **y** to continue. The package will now be downloaded and installed - you may also be asked whether to install packages for your specific locality/region. 

Finally, you'll be asked for a username and password specific to your Ubuntu installation. These don't need to be the same as your Windows 10 credentials. With this step complete, you'll find yourself at the Ubuntu bash command line. 

![screenshot](https://assets.ubuntu.com/v1/05a35ed8-win10-ubuntu-bash-complete.png)

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
[windowsinsider]: https://insider.windows.com/en-us/
[storelink]: ms-windows-store://pdp/?productid=9NBLGGH4MSV6&referrer=unistoreweb&scenario=click&webig=11a9a85f-44f0-4cf5-ac1f-d9e148f2c23b&muid=01A3F9D8DEC2605B1426F331DF03617B
[win10fall]: https://www.microsoft.com/en-us/windows/upcoming-features
[commdocs]: https://help.ubuntu.com/community/UsingTheTerminal
[askubuntu]: https://askubuntu.com/
[forums]: https://ubuntuforums.org/
[ubuntuirc]: https://wiki.ubuntu.com/IRC/ChannelList
