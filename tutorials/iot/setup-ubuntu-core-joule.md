---
id: setup-ubuntu-core-intel-joule
summary: In this codelab, we are going to setup Ubuntu Core on your Intel Joule. We’ll flash the sd card with an Ubuntu Core image and then configure it.
categories: iot
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: snap, usage, beginner, joule, console-conf
difficulty: 1
published: 2016-12-10
author: Didier Roche <didier.roche@canonical.com>

---

# Setup Intel Joule

## Introduction
Duration: 15:00

Welcome to the world of Ubuntu Core! In this codelab, we are going to introduce you how to flash your eMMC for your Intel Joule board, and finally turn your Intel Joule into a Ubuntu Core 16 system.

![IMAGE](https://assets.ubuntu.com/v1/3647779b-joule-product.png)


### What you’ll learn
  - Create a Ubuntu SSO (Single-Sign-On) account
  - How to setup your hardware environment
  - How to flash Ubuntu Core 16 for your Intel Joule board
  - How to do console-conf for your Ubuntu Core 16 system

### What you’ll need
  - 1 Intel Joule Dev Kit
  - 1 power supply for the Joule (12VDC 3A)
  - 1 HDMI monitor
  - 1 USB keyboard
  - 1 USB mouse
  - 1 USB hub (connecting both keyboard and mouse)
  - 1 micro HDMI to HDMI cable (connecting HDMI monitor)
  - 1 SD card adapter
  - 1 Ubuntu Desktop (16.04) or Windows system

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

## Getting set up
Duration: 7:00

### Register an Ubuntu SSO account

If you have already had an SSO account, you can skip this step and move to the next. The account is used for console-conf in the following steps.

  1. Ubuntu SSO account is required to setup user profile. A user needs to create a ubuntu SSO account before using Ubuntu Core 16. To create an Ubuntu SSO account, go to [https://login.ubuntu.com]

![IMAGE](https://assets.ubuntu.com/v1/af05aa4e-sso-1.png)

  2. Complete account verification

![IMAGE](https://assets.ubuntu.com/v1/11e60c02-sso-2.png)

![IMAGE](https://assets.ubuntu.com/v1/fcaa5d3d-sso-3.png)

![IMAGE](https://assets.ubuntu.com/v1/bec1518f-sso4.png)

  3. Create a SSH Key
	This step is only necessary if you don’t have an SSH key on your system.
    - On your Ubuntu desktop, here is how you would create it:


```bash
$ mkdir ~/.ssh
$ chmod 700 ~/.ssh
$ ssh-keygen -t rsa
```

You will be prompted for a location to save the keys, and a passphrase for the keys. This passphrase will protect your private key while it's stored on the hard drive:


```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/home/b/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/b/.ssh/id_rsa.
Your public key has been saved in /home/b/.ssh/id_rsa.pub.
```

Your public key is now available as `.ssh/id_rsa.pub` in your home folder.

    - For Window users, please refer to the following link about how to generate SSH key: [https://support.rackspace.com/how-to/generating-rsa-keys-with-ssh-puttygen].

  4. Import SSH Key

Clicking “**SSH keys**" on the left side shows the following screen. You can now just copy and paste the content of  `id_rsa.pub` file into the field. Confirm your ssh key by clicking on “**Import SSH key**”.

![IMAGE](https://assets.ubuntu.com/v1/ff6ea30a-sso-ssh.png)

## Create a bootable Ubuntu Core 16 SD card
Duration: 7:00

In this step,  you are going to flash a bootable image into a Ubuntu Core 16 SD card.

  - Firstly, build your own Ubuntu Core image
  - Insert your SD card or USB flash drive (you need an SD card adapter)
  - Identify its address by opening the "Disks" application and look for the "Device" line. If the line is in the `/dev/mmcblk0p1` format, then your drive address is: `/dev/mmcblk0`. If it is in the `/dev/sdb1` format, then the address is `/dev/sdb`.
	You may also use the following command to find out your device’s name:


```bash
$ lsblk
```

  - Unmount it by right clicking its icon in the launcher bar, the eject icon in a file manager or the square icon in the "Disks" application
  - It’s time to copy the image to your removable drive
  - If the Ubuntu Core image file you have downloaded ends with an .xz file extension, run:


```bash
xzcat <image_path>/<image_file.xz> | sudo dd of=<drive address> bs=32M
```

  - Else, run:


```bash
sudo dd if=<image_path>/<image_file> of=<drive address> bs=32M
```

  - Then, run the **sync** command to finalize the process


```bash
$ sync
```

  - You can now eject your removable drive from your desktop

## Ubuntu Core initial setup
Duration: 5:00

### Boot Intel Joule with Ubuntu Core 16

![IMAGE](https://assets.ubuntu.com/v1/ab27547b-joule-board.png)

Power on the Joule board for booting on your new image:
  1. Insert your SD card into your Intel Joule board
  1. Configure your Joule’s BIOS so that SD card has higher boot priority over eMMC (you may enter BIOS by pressing **F2** hotkey during the boot)
  1. The system will boot two times then become ready to configure
  1. The device will display  the prompt “**Press enter to configure**”
  1. Follow the instructions on the screen to  configure your device
  1. Press enter then select “**Start**” to begin configuring your network and an administrator account
     ![IMAGE](https://assets.ubuntu.com/v1/3d89c983-core-1.png)
     ![IMAGE](https://assets.ubuntu.com/v1/cec51425-core-2.png)
  1. Configure network setting. Move cursor and select the wireless LAN interface (wlan0). And press enter.
     ![IMAGE](https://assets.ubuntu.com/v1/2adb5bfd-core-3.png)
     Select ‘Configure WIFI settings’ and press enter to get to screen that allows for choosing a visible network, scan for      networks or manually enter SSID and Password.
     ![IMAGE](https://assets.ubuntu.com/v1/237fb42e-core-4.png)
     Input your network SSID and password and select ‘**Done**’. Or use ‘**Choose a visible network**’ to pick a name from the network list. ‘**Scan for networks**’ is used to trigger a new WiFi scan.
     ![IMAGE](https://assets.ubuntu.com/v1/09f77bbf-core-5.png)
     Edit IPv4 and IPv6 configurations if necessary and select ‘**Done**’.
     ![IMAGE](https://assets.ubuntu.com/v1/fb486e61-core-6.png)
     The network settings will be applied.
     ![IMAGE](https://assets.ubuntu.com/v1/8c7289c3-core-7.png)

  1. Enter user’s account on [Ubuntu One]. Select “Done” to complete.
     ![IMAGE](https://assets.ubuntu.com/v1/49190c72-core-8.png)

  1. The configuration is completed. On the screen, the Ubuntu SSO username and the device IP address will be shown. The SSH keys linked to the user will be shown as well.
     ![IMAGE](https://assets.ubuntu.com/v1/26329c2b-core-9.png)

  1. The user can now login to the system with username and ssh key registered on Ubuntu One. Use ssh client to login the system from another machine which has the same network as your Intel Joule board.

**NOTE**: only remote access via ssh is enabled until a password is set via instructions in the next step.
Use the command to login Joule via ssh:

```bash
$ ssh <username of Ubuntu One>@10.101.46.211
```

where “10.101.46.211” is the IP address of your Ubuntu Core Joule device. It is shown at the **top-left** corner of your HDMI monitor after booting.

Your device is now ready to be used. Enjoy! You can now play with snap commands and check that your image contains all desired snaps with ‘ snap list’ .


## That’s all folks!
Duration: 1:00

### Easy, wasn’t it?

Congratulations! You made it!

By now you should have successfully flashed and configured your Intel Joule board. You now are running latest Ubuntu Core system. You did configure a personal account to connect to it, and prevented the need for a default user account like “ubuntu” due to security concerns.

### Next steps

  - You can log into Ubuntu Core system and start to explore the snap commands. You can take a look at our next codelab called “Basic snap usage” for exploration.
  - Join the snapcraft.io community on the [snapcraft forum].

### Further readings

  - [Snapcraft.io documentation] is a good place to start reading the whole snap and snapcraft doc.
  - Check how you can [contact us and the broader community].


[https://support.rackspace.com/how-to/generating-rsa-keys-with-ssh-puttygen]: https://support.rackspace.com/how-to/generating-rsa-keys-with-ssh-puttygen
[Ubuntu One]: https://login.ubuntu.com
[snapcraft forum]: https://forum.snapcraft.io/
[Snapcraft.io documentation]: http://snapcraft.io/docs/
[contact us and the broader community]: http://snapcraft.io/community/
