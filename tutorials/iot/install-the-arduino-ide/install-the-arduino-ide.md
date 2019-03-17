---
id: install-the-arduino-ide
summary: Learn how to install the Arduino IDE in order to write code for Arduino boards.
categories: iot
tags: iot, arduino, install, setup
difficulty: 2
status: draft
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Canonical Web Team <webteam@canonical.com>
published: 2017-12-14


---

# Install the Arduino IDE

## Overview
Duration:

To get us up and running with Arduino, we are going to install the **Arduino IDE**, a program that will help us write code for the Arduino, and run our code on the board.

### What you'll learn
- How to install the Arduino package from a tarball
- How to add a user to a group (here, the `dialout` group)

### What you'll need
- Ubuntu 16.04 (and above) Desktop
- An Arduino board, and included mini-USB cable
- Some basic command-line knowledge (including how to use `cd` to change directories)

## Installing via a tarball
Duration: 3:00

We can download the latest version of the Arduino IDE from the Arduino website ([here](https://www.arduino.cc/en/Main/Software)) as a *tarball*. A tarball is a type of compressed folder, like a `.zip` file, commonly used to distrubute software in Linux; its file extension is usually `.tar.xz` (or `.tar.gz`, if it uses _Z compression_. We'll get to this later).

In order to extract the files we need from the tarball, we can open a terminal, `cd` to where the downloaded tarball is, then run 

```bash
tar xvf FILENAME
```

where `FILENAME` is the name of the download (typically arduino-(version number)-linux64.tar.xz).

The command can be read as 
* e**X**tract from an archive...
* **V**erbosely (meaning it prints the name of every file it finds)...
* from a **f**ile given by `FILENAME`.

When the command finishes, run `ls` again; `tar` should have created a new folder named arduino-(version number).

`cd` into the folder; there will be a file named `install.sh` in the folder. To install the IDE, execute `install.sh` with

```bash
./install.sh
```

If the script executes correctly and outputs `done!` at the end of its output, the IDE was installed correctly! Let's try to launch it in the next step.

negative
: **Installing via apt**
While there *is* a package for the Arduino IDE on current APT repositories, it has not been updated for a while.
As such, while it is still possible to install the IDE by running `sudo apt install arduino`, it is **not recommended** to do so, as asking for support when using outdated software is more difficult.

## First Launch
Duration: 1:00

Before launching the IDE, connect your Arduino board to your computer with a USB cable.

Arduino should be available in the (Unity menu?); if not, it can be launched from the command line by running `arduino`.

### Permissions checker
The first time we launch Arduino, a window will pop up asking to add us to the `dialout` group:

![Dialogue asking to add us to the dialout group][perm-checker.png]

We will get back to what this means later, but for now just click on `Add`.

### The editor
After that, we should see the IDE's main editor window.

![Editor][first-launch-editor.png]

The IDE comes with example files that we can use to test if everything works. Let's try open one such file: Under File > Examples > 01.Basics, choose Blink.

Try running the code on your Arduino by clicking Upload (the right arrow along the top).

We should get an error:

```
Binary sketch size: 1,054 bytes (of a 32,256 byte maximum)
processing.app.SerialNotFoundException: Serial port 'COM1' not found. Did you select the right one from the Tools > Serial Port menu?
(...)
```

But if we try following the suggestion in the error above, the Serial Port menu is greyed out and can't be entered.

![Greyed out serial port menu][first-launch-serial-port-menu.png]


What's going on?

## The dialout group

This is happening because the IDE *doesn't have sufficient permissions* to access the Arduino device.

### Permissions 

We can look at the Arduino device by running

```bash
ls -l /dev/ttyACM*
``` 

in a terminal. The output looks mostly like this:

```bash
crw-rw---- 1 root dialout 166, 0 Des 14 09:47 /dev/ttyACM0
```

The '0' at the end of 'ACM' might be different, and multiple entries might be listed, but the parts we need to focus on are the string of letters and dashes in front, and the two names `root` and `dialout`.

The first name `root` is the owner of the device, and `dialout` is the owner group of the device.

The letters and dashes in front, starting after 'c', represent the permissions for the device by user:
- The first triplet `rw-` mean that the owner (`root`) can read and write to this device
- The second triplet `rw-` mean that members of the owner group (`dialout`) can read and write to this device
- The third triplet `---` means that other users have no permissions at all (meaning that nobody else can read and write to the device)

In short, nobody except `root` and members of `dialout` can do anything with the Arduino; since we aren't running the IDE as `root` or as a member of `dialout`, the IDE can't access the Arduino due to insufficient permissions.

### Adding yourself to the `dialout` group

But wait! Earlier, when we were launching the IDE, we _did_ add ourselves to the `dialout` group!

![Dialogue prompting to add user to the dialout group][perm-checker.png]

So why does the IDE still not have permission to access the Arduino?

The changes that the prompt makes don't apply until we log out and log back in again, so we have to save our work, log out, and log back in again. 

After you log back in and launch the Arduino IDE, the Serial Port option should be available; change that, and we should be able to upload code to the Arduino. 

![Serial port option available][option-available.png]

## That's all folks!
Duration: 1:00

Congratulations, you made it!

You've just installed the Arduino IDE on your computer; you've also learned how permissions and groups work in Linux!

### Next Steps

* Try your hand at making smart things with projects at the [Arduino Project Hub][arduino-project-hub]
* Learn more about how the Arduino language works with Arduino's [tutorial][arduino-sketch-tutorial]

### Further readings

* More resources from Arduino at [their Getting Started page][arduino-getting-started]

[perm-checker.png]: ./images/perm-checker.png
[first-launch-editor.png]: ./images/first-launch-editor.png
[first-launch-serial-port-menu.png]: ./images/greyed-out-option.png
[option-available.png]: ./images/option-available.png

[arduino-getting-started]: https://www.arduino.cc/en/Guide/HomePage
[arduino-project-hub]: https://create.arduino.cc/projecthub
[arduino-sketch-tutorial]: https://www.arduino.cc/en/Tutorial/Sketch
