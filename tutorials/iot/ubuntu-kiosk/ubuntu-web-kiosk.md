---
id: ubuntu-web-kiosk
summary: Run a secure Web Kiosk with your website on Ubuntu Core.
categories: iot
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: snap, digital-signage, kiosk, device, web, html
difficulty: 1
published: 2018-09-18
author: Gerry Boland <gerry.boland@canonical.com>

---


# Run a Web Kiosk/Web Display on Ubuntu Core


## Introduction

duration: 1:00

A web kiosk or web display is a full-screen web browser running on a secure device, with the sole purpose of driving that display to provide specific information or a particular function at that location. Ubuntu is popular for these applications thanks to its excellent security track record and widespread developer familiarity.

Since these devices are often left unattended for long periods of time, and run in sensitive environments like airports, we also want to raise the bar on security and update management. So this tutorial includes the option to use Ubuntu Core, which is a minimal, self-updating base OS snap and web browser snap combination.

This can provide a tightly integrated solution for display signage purposes, or by integrating touchscreen or keyboard capabilities, serves as a secure interactive web kiosk.

Note: `chromium-mir-kiosk` is provided as-is, as a Proof-of-Concept only, not meant for production use. For information on how to roll out your own kiosk application, please see [this guide](/tutorial/secure-ubuntu-kiosk) and [talk to us](https://www.ubuntu.com/internet-of-things/contact-us)!


### What you'll learn

How to install a demo web kiosk or web display on Ubuntu Core, and configure it with the website of your choice.


### What you'll need



*   An Ubuntu desktop running any current release of Ubuntu
*   A 'Target Device' from one of the following:
    *   **A device running [Ubuntu Core](https://www.ubuntu.com/core).**<br />
[This guide](https://developer.ubuntu.com/core/get-started/installation-medias) shows you how to set up a supported device. If there's no supported image that fits your needs you can [create your own core image](/tutorial/create-your-own-core-image).
    *   **Using a VM**
You don't have to have a physical "Target Device", you can follow the tutorial with Ubuntu Core in a VM. Install the ubuntu-core-vm snap:
`snap install --beta ubuntu-core-vm --devmode`
For the first run, create a VM running the latest Core image:
`sudo ubuntu-core-vm init`
From then on, you can spin it up with:
`sudo ubuntu-core-vm`
You should see a new window with Ubuntu Core running inside.
    *   **Using Ubuntu Classic**
You don't _have_ to use Ubuntu Core, you can use also a "Target Device" with Ubuntu Classic. You just need to install an SSH server on the device.
`sudo apt install ssh`
For IoT use you will want to make other changes (e.g. uninstalling the desktop), but that is outside the scope of the current tutorial.
NB: On Classic snapd doesn't currently provide confinement for snapped wayland or x11 servers, so you'll need to use devmode still.


## Basic Infrastructure

duration: 1:00

We use Wayland as the primary display interface. We will use Mir to manage the display and support connections from Wayland clients. Snapd will confine the applications and enable Wayland protocol interactions through Mir, securely.

The web kiosk display application is based on the [Chromium web browser](https://www.chromium.org/), a modern standards-based browser that will receive frequent updates.

Configuration is handled using snapd's configuration system.


## Installation

duration: 2:00

To begin, install mir-kiosk snap:


```bash
snap install mir-kiosk
```


and then the chromium-mir-kiosk snap:


```bash
snap install --beta chromium-mir-kiosk
```


and you should see a fullscreen webpage in your display! 


## Configuration Options

duration: 2:00

The "chromium-mir-kiosk" snap comes with multiple configuration options to customise its behaviour to suit many use cases.

Snapd's configuration system maintains these settings across software updates, so your web kiosk will continue to operate as you have configured it.

To view all the configuration options, run `snap get chromium-mir-kiosk`. Here are some of the most useful options:


### Set homepage

Snapd's configuration system has all we need. To set a new home URL for the kiosk, do


```bash
snap set chromium-mir-kiosk url="http://www.canonical.com"
```


After a short delay, the newly specified website should appear on screen.


### Show basic Navigation bar

Having the Navigation bar hidden is ideal for purely informative web displays. However if you desire user interactivity, you can reveal a simple Navigation bar with back/forward buttons with this command:


```bash
snap set chromium-mir-kiosk shownav=true
```


To hide it again, do


```bash
snap set chromium-mir-kiosk shownav=false
```



### Set multiple homepages


```bash
snap set chromium-mir-kiosk 'url=["http://www.canonical.com","https://www.ubuntu.com"]'
```


Each page will appear in its own tab. Note this option forces the Navigation bar to always be visible.


### Customise the Reset Time

In the case of an interactive web kiosk, users can navigate away from the home page, and then leave the kiosk in that state. After a period of idleness, the kiosk will automatically return to the home page. Configure this reset time (in minutes) with


```bash
snap set chromium-mir-kiosk resettime=5
```



### Hide cursor

Should your display hardware incorporate a touchscreen, you can hide the mouse cursor with


```bash
snap set chromium-mir-kiosk hidecursor=true
```



## Example Digital Signage Configuration

duration: 1:00

An ideal digital signage solution for your content is for you to provide the content in the form of a single auto-updating web page, whose content you can manage easily. Then Chromium-mir-kiosk on Ubuntu Core will display this web page in a trouble-free manner.

Simply configure chromium with the URL like so:


```bash
snap set chromium-mir-kiosk url="http://www.canonical.com"
```


Hide the Navigation bar and mouse cursor, and disable the auto-reset with:


```bash
snap set chromium-mir-kiosk shownav=false hidecursor=true resettime=0
```



## Example Interactive Web-kiosk Configuration

duration: 1:00

A single-page, touch-screen web kiosk can be configured as follows:


```bash
snap set chromium-mir-kiosk url="http://www.canonical.com"
```


Show the Navigation bar but disable mouse cursor, and enable the auto-reset with a timeout of 3 minutes:


```bash
snap set chromium-mir-kiosk shownav=true hidecursor=true resettime=3
```



## Conclusion

You have a working web kiosk!

If you have a product and need to embed a web kiosk, [talk to us about getting this working on your product](https://www.ubuntu.com/internet-of-things/contact-us).
