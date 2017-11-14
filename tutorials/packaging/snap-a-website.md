---
id: snap-a-website
summary: In this tutorial, you’ll learn how to create a desktop web app with Electron and package it as a snap.
categories: packaging
tags: snapcraft, snap, beginner, nodejs, electron, website
status: Published
feedback Link: https://github.com/ubuntu/codelabs/issues:
author: David Callé <david.calle@canonical.com>
difficulty: 2
published: 2017-11-14

---

# Snap a website with Electron

## Overview
Duration: 1:00

Turning your website into a desktop integrated app is a relatively simple thing to do, but distributing it as such and making it noticeable in app stores is another story. This tutorial will show you how to leverage Electron and snaps to create a website-based desktop app from scratch and publish it on a multi-million users app store shared between many Linux distributions.

For this tutorial, the website we are going to package is an HTML5 game called [Castle Arena](http://castlearena.io).

### What you'll learn

- How to create a website-based desktop app using Electron
- How to turn it into a snap package
- How to make your first release in the Snap Store

### What you'll need

- Ubuntu Desktop 16.04 or above
- Some basic command-line knowledge

We are going to start by downloading some dev tools and set up the project.

## Electron setup
Duration: 10:00

Open a terminal to create a `castlearena` project directory and enter it:

```bash
mkdir castlearena
cd castlearena
```

Inside our project, let's create an `app` directory to host the Electron app and its dependencies, and enter it.

```bash
mkdir app
cd app
```

Let's start by installing nodejs, which will provide the `npm` command line tool.

```bash
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Now that we have the `npm` command, we can use it to install electron and electron-builder inside the current directory. They will provide the runtime and tooling to build the app binary.

```bash
npm install electron --save-dev --save-exact
npm install electron-builder --save-dev
```

When this is done we can move to the next step: creating the app.

## Creating the app

We are going to start by creating an `main.js` file at the root of our project.

Open your favorite editor and save the following code as `main.js`

```js
const electron = require('electron');
const { shell, app, BrowserWindow } = electron;
const HOMEPAGE = 'http://castlearena.io/'

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
    })

    window.on('closed', () => {
        window = null;
    });
});

```

That's pretty much all we need to display a website in a standalone window.

Positive
: Note that we have defined a `HOMEPAGE` variable, which contains the base URL of our app.
This could point to a local file as well.

Now, from your project directory (`castlearena/app/`), start the app:

```bash
npm start
```

You should now see a new window!

<screenshot>

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
const HOMEPAGE = 'http://castlearena.io/'

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
    })

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
  parts = url.split("/");
  if (parts[0] + "//" + parts[2] != HOMEPAGE){
    ev.preventDefault()
    shell.openExternal(url)
  };
})
```

We are going to add it to our code, so it looks like this:

```js
const electron = require('electron');
const { shell, app, BrowserWindow } = electron;
const HOMEPAGE = 'http://castlearena.io/'

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
      parts = url.split("/");
      if (parts[0] + "//" + parts[2] != HOMEPAGE){
        ev.preventDefault()
        shell.openExternal(url)
      };
    })

    window.on('closed', () => {
        window = null;
    });
});
```

We are done with refinements, and we are almost done with the app. All we need, is to add some metadata, that electron-builder will use to generate a executable file.

## Electron metadata (package.json)
Duration: 2:00

Now that we have a working app, we need to turn it into an executable file. To do this, we are going to use a dependency we installed earlier: electron-builder. To work, it needs a `package.json` file containing some basic metadata.

In your favorite editor, create a `package.json` file with the following content:

```json
{
  "name": "castlearena",
  "version": "0.1",
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

As you can see, all entries are self-explicit. We have a name, a version, the location of our app, how to start the app using the `electron` command and instructions to build a linux executable without packaging (`dir` stands for `directory`).

Positive
: This is the simplest version of a `package.json` that works with electron-builder. You can extend it with "author", "description" and a lot of other fields, but since we are packaging this app as a snap, we can just focus (later in this tutorial) on the metadata provided by the snap package.

Save the file as `package.json` in our Electron project (`castlearena/app`), alongside `main.js`.

We are done with the app! Now, let's have a look at our snap packaging.

## Snapcraft setup

To package our app as a snap, we are going to need two more pieces of software:

Snapcraft, the tool to create snaps, that you can install with:

```bash
sudo snap install snapcraft --classic --candidate
```
And LXD, that will provide a pristine Ubuntu 16.04 container for the snapping process. The following commands will take care of installing it:

```bash
sudo groupadd --system lxd
sudo usermod -a -G lxd $USER
newgrp lxd
sudo snap install lxd
```

LXD also needs to be initialized, so let's run the LXD wizard and choose the default response for each question (this will only take a few seconds):

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
Duration: 5:00

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
 to deploy powerful building and units to attack your ennemy.
```

Then, `confinement`, that expresses the level of security of the package (`strict`, `devmode` or `classic`) and `grade` that denotes the stability of your app (`stable` or `devel`).

```yaml
confinement: strict
grade: stable
```

### Parts

Snapcraft parts are pieces of code contained by the snap. In our case, mainly our `app/` directory.

#### Declaring an `electron-app` part

To declare a part, you need to give it an arbitrary name. In our case, let's call our part "electron-app". Then, we need to declare where to pull its code from, relatively to our project directory: `app/`. The plugin is the type of part we are building: it's a `nodejs` app. Which means snapcraft will use `nodejs` when building the snap, and bundle it (among other related dependencies) in the final snap package.

```yaml
parts:
  electron-app:
    source: app/
    plugin: nodejs
```

#### Runtime dependencies: `stage-packages`

We also need to declare other dependencies that will be bundled in our snap using the `stage-packages` field. This list is common to most Electron apps:

```yaml
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

The `after` field indicates that our part will be built "after" the: `desktop-glib-only` part. It's a part taken from a common repository snapcraft has access to. It provides a desktop launcher script that ensures Desktop apps are working correctly inside snap confinement and integrates seamlessly: with Desktop notifications and global sound controls for example.

```yaml
    after:
      - desktop-glib-only
```

#### Build and post-build instructions

Then we need to provide the following information:

* **The command (or commands) to build the app**:
  Since we are using electron-builder and simply calling `electron-builder` in the project will pick up details from our `package.json` file and generate an executable.

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



## Desktop integration

We are getting to it: how to showcase your webapp on the desktop.

Let's start with an icon. 256x256px is generally a safe bet for desktop icons to look good under most circumstances.

Download this one and save it as `icon.png`

![](https://assets.ubuntu.com/v1/b2af323c-icon.png?w=256)

Create a desktop file

```bash
[Desktop Entry]
Type=Application
Name=Castle Arena
Icon=${SNAP}/meta/gui/icon.png
Categories=Game;ArcadeGame;
Exec=castlearena
Terminal=false
```

## Building and testing the snap
Duration: 1:00

```bash
snapcraft cleanbuild
```

* Download dependencies for each part
* Build each part
* Stage what needs to be in the snap
* Package the staging area into a snap

### Time to test our snap!

```bash
snap install --dangerous castlearena_0_amd64.snap
```

From the command-line:

```bash
castlearena
```

#### See the snap as users would

From the command-line:

```bash
snap info castlerena
```

Elsewhere:

Search for it, and notice the name and icon of the desktop file are being used. If something looks wrong, you can fix it by editing the desktop file.

## What next?

### What if the snap doesn't work?

Here are some commonly used tools to debug snaps:

* Mount a directory as a snap (with write access):
  `unsquashfs <snap package>` will unpack the snap into a `squashfs-root` drectory
  `snap try squashfs-root` will mount the directory as if it was an installed snap
* Inspect apparmor logs for security denials:
  `tail -f /var/log/syslog | grep <snap>`
* Enter a shell with the same confinement as the snap to inspect the environment:
  `snap run --shell <snap>`


### How to share my snap with the world?

You can release your snap in the Snap Store, privately or publicly. Publishing steps are available at ...

### Where to find support?

The snapcraft forum is the best place to get your questions answered.
