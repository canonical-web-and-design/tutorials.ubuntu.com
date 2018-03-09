---
id: snap-a-website
summary: In this tutorial, you’ll learn how to create a desktop web app with Electron and package it as a snap.
categories: packaging
tags: snapcraft, snap, beginner, nodejs, electron, website
status: published
difficulty: 2
published: 2017-11-14
author: David Callé <david.calle@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Snap a website with Electron

## Overview
Duration: 1:00

Turning your website into a desktop integrated app is a relatively simple thing to do, but distributing it as such and making it noticeable in app stores is another story.

This tutorial will show you how to leverage Electron and snaps to create a website-based desktop app from scratch and publish it on a multi-million user store shared between many Linux distributions.

For this tutorial, the website we are going to package is an HTML5 game called [Castle Arena](http://castlearena.io).

![](https://assets.ubuntu.com/v1/7f7e704f-shot.png)

### What you'll learn

- How to create a website-based desktop app using Electron
- How to turn it into a snap package
- How to test it and share it with the world

### What you'll need

- Ubuntu Desktop 16.04 or above
- Some basic command-line knowledge

We are going to start by downloading some dev tools and set up the project.

## Electron setup
Duration: 3:00

Let's start by opening a terminal and installing some basic development tools, notably:

* **curl**: a command-line utility to download remote content
* **build-essential**: a collection of dependencies for building source code
* **libgconf2-4**: an Electron dependency, commonly used to store app configuration values
* **nodejs**: A JavaScript runtime, that will also provide the `npm` command we are going to use

```bash
sudo apt install curl build-essential libgconf2-4
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt install nodejs
```

Create a `castlearena` project directory and enter it:

```bash
mkdir castlearena
cd castlearena
```

Inside our project, let's create an `app` directory to host the Electron app and its dependencies, and enter it.

```bash
mkdir app
cd app
```

With the `npm` command, we can install *electron* and *electron-builder* inside the current directory. They will provide the framework and tooling to build our app binary.

```bash
npm install electron --save-dev --save-exact
npm install electron-builder --save-dev
```

When this is done we can move to the next step: creating the app.

## Creating the app
Duration: 10:00

We are going to start by creating a `main.js` file.

Open your favorite editor and save the following code as `main.js`

```js
const electron = require('electron');
const { shell, app, BrowserWindow } = electron;
const HOMEPAGE = 'http://castlearena.io'

let mainWindow;

app.on('ready', () => {
    window = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
          nodeIntegration: false
        }
    });
    window.loadURL(HOMEPAGE);

    window.on('closed', () => {
        window = null;
    });
});

```

That's pretty much all we need to display a website in a standalone window.

Positive
: Note that we have defined a `HOMEPAGE` variable, which contains the base URL of our app.
This could point to a local file as well.

Now, from your project directory (`castlearena/app/`), let's try the app:

```bash
./node_modules/.bin/electron main.js
```

You should now see a new window!

![](https://assets.ubuntu.com/v1/38b307f0-snap-a-website-app-1.png)

### Some refinements

Our app runs, which is a good start, but we are going to refine it a little bit.

#### Hiding the menu

Electron apps show a menu by default. We can either keep it intact, customize it or hide it.

Since our HTML5 game doesn't need any menu, we are going to hide it with the `setMenuBarVisibility` function:

```js
window.setMenuBarVisibility(false);
```

Let's add this line right above the `loadURL` function call, so our file looks like this:

```js
const electron = require('electron');
const { shell, app, BrowserWindow } = electron;
const HOMEPAGE = 'http://castlearena.io'

let mainWindow;

app.on('ready', () => {
    window = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
          nodeIntegration: false
        }
    });
    window.setMenuBarVisibility(false);
    window.loadURL(HOMEPAGE);

    window.on('closed', () => {
        window = null;
    });
});

```

#### Opening external URLs in the default browser

External URLs are URLs leading outside our app. Since our app is not a web browser with navigation (back or forward) buttons, let's deal with them by opening them in the default web browser.

When a URL is about to be loaded, Electron triggers a `will-navigate` event. We are going to listen to these events and compare the URL they provide with the domain of our app. If they don't match, we will open the URL in the default browser.

This snippet takes care of it:

```js
window.webContents.on('will-navigate', (ev, url) => {
    parts = url.split('/');
    if (parts[0] + '//' + parts[2] != HOMEPAGE) {
        ev.preventDefault();
        shell.openExternal(url);
    };
});
```

We are going to add it to our code, so it looks like this:

```js
const electron = require('electron');
const { shell, app, BrowserWindow } = electron;
const HOMEPAGE = 'http://castlearena.io'

let mainWindow;

app.on('ready', () => {
    window = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
          nodeIntegration: false
        }
    });
    window.setMenuBarVisibility(false);
    window.loadURL(HOMEPAGE);

    window.webContents.on('will-navigate', (ev, url) => {
        parts = url.split('/');
        if (parts[0] + '//' + parts[2] != HOMEPAGE) {
            ev.preventDefault();
            shell.openExternal(url);
        };
    });

    window.on('closed', () => {
        window = null;
    });
});
```

We are done with refinements, and we are almost done with the app. You can test it some more to see if it behaves as you would expect:

```bash
./node_modules/.bin/electron main.js
```

 Next, we are going to add some metadata to the app project and use electron-builder to generate an executable file.

## Electron metadata (package.json)
Duration: 2:00

Now that we have a working app, we are going to turn it into an executable file using a dependency we installed earlier: electron-builder To build the executable, it requires a `package.json` file containing some basic metadata.

In your favorite editor, create a `package.json` file with the following content:

```json
{
  "name": "castlearena",
  "version": "0.1.0",
  "main": "./main.js",
  "scripts": {
    "start": "electron ."
  },
  "build": {
    "linux": {
      "target": ["dir"]
    }
  }
}
```

As you can see, all entries are self-explanatory. We have a name, a version, the location of our app, how to start the app using the `electron` command and instructions to build a linux executable without packaging (`dir` stands for `directory`).

Positive
: This is the simplest version of a `package.json` that works with electron-builder. You can extend it with "author", "description" and a lot of other fields, but since we are packaging this app as a snap, we can just focus (later in this tutorial) on the metadata provided by the snap package.

Save the file as `package.json` in our Electron project (`castlearena/app`), alongside `main.js`.

We are done with the app! Now, let's have a look at our snap packaging.

## Snapcraft setup
Duration: 5:00

To package our app as a snap, we are going to need two more pieces of software:

Snapcraft, the tool to create snaps, that you can install with:

```bash
sudo snap install snapcraft --classic --candidate
```
And LXD, a tool to manage Linux containers, that will provide a pristine Ubuntu 16.04 host for the snapping process. The following commands will take care of creating the `lxd` user group and installing the package:

```bash
sudo groupadd --system lxd
sudo usermod -a -G lxd $USER
newgrp lxd
sudo snap install lxd
```

LXD needs to be initialized: let's run the LXD wizard and choose the default answer to each question.

```bash
sudo lxd init
```

Our snapping tools are ready. Now, we need to move at the top level of our project directory (`castlearena\`) and initialized our `snapcraft` project:

```bash
cd ..
snapcraft init
```

This creates a `snap/` directory containing a `snapcraft.yaml` file.

Positive
: **A note on project structure**
As you can see, we are splitting our project directory into two parts: `app/` contains our Electron app and `snapcraft init` has just created a `snap/` directory for our snap metadata. This will allow us to declare `app/` as the source for our packaging and avoid potentially unwanted components in our snap, such as build artifacts from previous builds that can appear when you work on a snap.

Our project tree now looks like this:

```bash
castlearena/
├── app/
│   ├── main.js
│   ├── package.json
│   └── <node and electron dependencies>
└── snap/
    └── snapcraft.yaml
```

In the next step, we are going to edit this `snapcraft.yaml` file to teach snapcraft how to package our app and ensure our snap looks right to end users by setting a description, an icon, etc.

## Snap metadata (snapcraft.yaml)
Duration: 10:00

Snap metadata is provided by the `snapcraft.yaml` file. From user visible metadata (name, version, etc.) to internals (which command to run, source code to package, dependencies, etc.), this is where the snap is made.

Open `snapcraft.yaml` (located at `castlearena/snap/snapcraft.yaml`) in your favorite editor.

You can see a boilerplate, that we are going to edit step by step.

### General metadata

At the top of the file, we can start by setting some general metadata that are mostly user visible:

```yaml
name: castlearena
version: '0.1'
summary: Destroy your opponent's castle to win!
description: |
 Play online or against a bot, click and drag cards to your side of the field
 to deploy powerful buildings and units to attack your enemy.
```

Then, `confinement`, that expresses the level of security of the package (`strict`, `devmode` or `classic`) and `grade` that denotes the stability of your app (`stable` or `devel`).

```yaml
confinement: strict
grade: stable
```

### Parts

Snapcraft parts are pieces of code contained by the snap. In our case, mainly our `app/` directory.

#### Declaring an `electron-app` part

To declare a part, you need to give it an arbitrary name. In our case, let's call our part "electron-app":

```yaml
parts:
  electron-app:
    source: app/
    plugin: nodejs
```

A part needs a `source`, to declare where to pull its code from, relative to our project directory. In this case: `app/`.

The `plugin` is the type of part we are building: it's a `nodejs` app. This means snapcraft will use `nodejs` when building the snap, and bundle it (among other related dependencies) in the final snap package.

#### Runtime dependencies: `stage-packages`

We also need to declare other dependencies that will be downloaded from the Ubuntu archive and bundled in our snap using the `stage-packages` field. This list is common to most Electron apps, let's add it to our part:

```yaml
parts:
  electron-app:
    source: app/
    plugin: nodejs

    stage-packages:
      - libnotify4
      - libappindicator1
      - libxtst6
      - libnss3
      - libxss1
      - fontconfig-config
      - gconf2
      - libasound2
      - pulseaudio
```

#### Even more dependencies

Snapcraft allows users to share parts with other projects via a common parts repository. We are going to use it to pull a second part called `desktop-gtk2`, which provides a desktop launcher script that ensures Desktop apps are working correctly inside snap confinement and integrates seamlessly with Desktop notifications, input methods and global sound controls for example.

```yaml
parts:
  electron-app:
    source: app/
    plugin: nodejs

    stage-packages:
      - libnotify4
      - libappindicator1
      - libxtst6
      - libnss3
      - libxss1
      - fontconfig-config
      - gconf2
      - libasound2
      - pulseaudio

    after:
      - desktop-gtk2
```

The `after` field indicates that our "`electron-app`" part will only be built "after" the: `desktop-gtk2` part.

#### Build and post-build instructions

Then we need to provide the following information:

* **The command (or commands) to build the app**:
  Since we are using electron-builder, simply calling `electron-builder` in the project will pick up details from our `package.json` file and generate an executable.

* **What to do with the result of our build**:
  The result of running `electron-builder` is a `app/dist/linux-unpacked/`, this is what we want in the snap, in a dedicated `app/` directory for consistency.

* **What to package (and in our case, what not to package)**:
  To ensure the snap package doesn't contain unnecessary files, we tell snapcraft to trim what it pulls into the snap and exclude `app/node_modules/`, which only contains build dependencies.

The following fields are taking care of each step:

```yaml
    build: node_modules/.bin/electron-builder
    install: |
      mkdir $SNAPCRAFT_PART_INSTALL/app
      mv dist/linux-unpacked/* $SNAPCRAFT_PART_INSTALL/app
    prime:
      - -node_modules
```

And can be added at the end of our part.

Here is our `snapcraft.yaml` at this stage of the process:

```yaml
parts:
  electron-app:
    source: app/
    plugin: nodejs

    stage-packages:
      - libnotify4
      - libappindicator1
      - libxtst6
      - libnss3
      - libxss1
      - fontconfig-config
      - gconf2
      - libasound2
      - pulseaudio

    after:
      - desktop-gtk2

    build: node_modules/.bin/electron-builder
    install: |
      mkdir $SNAPCRAFT_PART_INSTALL/app
      mv dist/linux-unpacked/* $SNAPCRAFT_PART_INSTALL/app
    prime:
      - -node_modules
```

### Let's recap

We have added general metadata to ensure our app appears correctly in stores, and parts to ensure it bundles our executable and its dependencies in a confined package. But we are still missing one very important bit: the launcher.

## Launcher and desktop integration
Duration: 5:00

To launch the app, the snap needs to know which command to run. This is done within an `apps` section in the `snapcraft.yaml`, where we are going to declare: the name of the app, the command to run and which access we want the app to be granted outside of the snap confinement.

Positive
: **About confinement**
By default, a snap will be fully confined and will have no way to interact with other pieces of the system, such as accessing the network, the display and sound servers, etc. As a result, we need to declare explicitly what our app needs access to.

This is what our `apps` section needs to look like.

```yaml
apps:
  castlearena:
    command: env TMPDIR=$XDG_RUNTIME_DIR desktop-launch $SNAP/app/castlearena
    plugs:
      - home
      - x11
      - unity7
      - browser-support
      - network
      - gsettings
      - pulseaudio
      - opengl
```

The `command` field requires an explanation:
 * since we are launching the snap within a confined space with restricted write access, we need to tell the executable where some things are: in this case `TMPDIR`, a standard temporary directory, that we are assigning to `$XDG_RUNTIME_DIR` since it's writable by snaps.
 * The `desktop-launch` part is a helper script (coming from the `desktop-gtk2` part) that sets other environment variables for the snap to work seamlessly with the desktop.
 * `$SNAP` is an environment variable containing the install path of the snap.

This list of "`plugs`", which are permissions that connect into similarly named "`slots`" on the user system, is more or less what any desktop application would need.

### All the pieces together

By adding the `apps` section to your `snapcraft.yaml`, you should now have a file looking like this:

```yaml
name: castlearena
version: '0.1'
summary: Destroy your opponent's castle to win!
description: |
 Play online or against a bot, click and drag cards to your side of the field
 to deploy powerful buildings and units to attack your enemy.

confinement: strict
grade: stable

parts:
  electron-app:
    plugin: nodejs
    source: app/

    stage-packages:
      - libnotify4
      - libappindicator1
      - libxtst6
      - libnss3
      - libxss1
      - fontconfig-config
      - gconf2
      - libasound2
      - pulseaudio

    after:
      - desktop-gtk2

    build: node_modules/.bin/electron-builder
    install: |
      mkdir $SNAPCRAFT_PART_INSTALL/app
      mv dist/linux-unpacked/* $SNAPCRAFT_PART_INSTALL/app
    prime:
      - -node_modules

apps:
  castlearena:
    command: env TMPDIR=$XDG_RUNTIME_DIR desktop-launch $SNAP/app/castlearena
    plugs:
      - home
      - x11
      - unity7
      - browser-support
      - network
      - gsettings
      - pulseaudio
      - opengl
```

Our work on the `snapcraft.yaml` file is done.

### Icon and desktop file

The last bit of packaging we need is an icon and an `<app>.desktop` file so that desktop environments recognise our app as such. The icon and the desktop file will be picked up by snapcraft and handled accordingly by putting them in a `snap/gui/` directory.

Create this directory by running, from the root of our project:

```bash
mkdir snap/gui
```

Now, let's add an icon.

#### The icon

This one is a good match for our app, download it and save it as `icon.png` in the `snap/gui/` directory.

![](https://assets.ubuntu.com/v1/b2af323c-icon.png?w=256)

Positive
: A size of 256x256px is generally a safe bet for desktop icons to look good under most circumstances.

### The `<app>.desktop` file

`.desktop` files are a widely supported standard for Linux desktops. They allow the desktop shell to know about your application and display it along other apps.

Create the following file and save it as `castlearena.desktop` in the `snap/gui/` directory.

```bash
[Desktop Entry]
Type=Application
Name=Castle Arena
Icon=${SNAP}/meta/gui/icon.png
Categories=Game;ArcadeGame;
Exec=castlearena
Terminal=false
```

Most fields are self-explanatory, but note the importance of the `Name` field. We are using "Castle Arena" here for the first time and it's how our app will be presented to users in their app list once it's installed.

**We are done with packaging our app.**

In the next step, we are going to run snapcraft, install our new snap and test it.

## Building and testing the snap
Duration: 8:00

Now that we have created all the pieces: the app, the electron metadata (`package.json`), the snapcraft metadata (`snapcraft.yaml`) and the desktop file, it's time to run snapcraft!

The command we are going to use is `snapcraft cleanbuild`: it will create an Ubuntu container using LXD, copy our project into it, download and build our part, compress the result as a snap and move the resulting snap file back into our project directory.

From the root of our project (`castlearena/`), run:

```bash
snapcraft cleanbuild
```

Some details about the output you are now looking at:

1. The container is created (if it's the first time you create an Ubuntu 16.04 container on this computer, an Ubuntu image is downloaded as part of the process)
1. The project is copied in the container
1. Snapcraft is installed in the container
1. snapcraft pulls the source of each part
1. ...and downloads all the required dependencies
1. Each part is built following our instructions
1. Snapcraft creates a `stage` directory where the content of the snap is put together and curated based on parts declarations
1. `stage` is then copied into a `prime` directory, where snap metadata and desktop file are added
1. The `prime` directory is packed into a snap

When the process is over, you should see a new file at the root of your project:

`castlearena_0.1_amd64.snap`

**Congrats, you made a snap!**

### Time for some testing...

To install the snap on your system, run:

```bash
snap install --dangerous castlearena_0.1_amd64.snap
```

Positive
: **What does `--dangerous` mean?**
The `--dangerous` flag indicates that you are acknowledging that this snap could be unsafe to install, this is necessary when the snap hasn't been through store security checks. Since you are the developer of the snap, you know it's safe, but the snap command doesn't and would prevent the install if you omitted the flag.

Then, you can start the app with:

```bash
castlearena
```

If you followed each step, you should be greeted with a pretty fun game:

![victory](https://assets.ubuntu.com/v1/10195d75-Peek+2017-11-14+17-01.gif)

You should also search for the app in your desktop app list and check if the icon renders nicely! If something looks wrong, at this point you probably know where to fix it: the desktop file.

## What next?
Duration: 1:00

What a journey! If this is the first time you installed a snap or created a LXD container, you may have realised that most of the time spent in this tutorial was looking at downloads! When the tools have been used once, things get much faster, since most of them don't have to be installed or initialised anymore.

### Let's recap what we went through

  * You know how to use snap packaging tools and have them installed
  * You know how to create a basic Electron app
  * You know how to snap an Electron app in a clean environment
  * You know how to bundle dependencies inside your snap and tweak the build steps

### How to share my snap with the world?

To release it in the Snap Store and make it available to others, privately or publicly, follow the [publishing steps](https://docs.snapcraft.io/build-snaps/publish).

### What if the snap doesn't work?

Here are some commonly used techniques to debug snaps:

* Inspect system logs for security denials:
  `tail -f /var/log/syslog | grep <snap>`
* Run your snap in `devmode` (developer mode), to replace AppArmor security denials by warnings:
  `snap install --devmode <snap package>` will install the snap in `devmode`
  Then inspect system logs for security warnings with `tail -f /var/log/syslog | grep <snap>`
* Mount a directory as a snap (with write access):
  `unsquashfs <snap package>` will unpack the snap into a `squashfs-root` drectory.
  `snap try squashfs-root` will mount the directory as if it was an installed snap.
  You can then run the snap and edit its content at the same time.
* Enter a shell with the same confinement as the snap to inspect its environment, paths, and see what it sees:
  `snap run --shell <snap>`

### Where to find support?

The [snapcraft forum](https://forum.snapcraft.io) is the best place to get all your questions answered and get in touch with the community.
