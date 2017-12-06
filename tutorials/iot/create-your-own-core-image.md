---
id: create-your-own-core-image
summary: Create your own Ubuntu Core image for a particular model, by assembling snaps available in the store. Make your own device image with some snap preinstalled or additional functionalities!
categories: iot
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: snap, ubuntu-image, image, device, assertion, model
difficulty: 3
published: 2016-09-13
author: Canonical Web Team <webteam@canonical.com>

---


# Create your own Ubuntu Core image


## Overview
Duration: 1:00

We are going to build an image for the [Intel Joule] device. Including extra snaps compared to the default provided Intel Joule Ubuntu Core image. The same techniques can be replicated on any other devices.

We are going to create your own **authority keys**, making the snap store aware of them, create and sign your **model assertion** before building your image.

This document will walk you through all the steps to build an image for a device family. You will learn how to:

### What you’ll learn
  - Different fundamental snap notions on the board, like gadget, kernel and core snap.
  - Assembling a kernel and gadget snaps.
  - Creating and using your authority keys.
  - Create a model assertion for your target device.
  - Compose and build a custom image using the ubuntu-image command.

### What you’ll need

  - Ubuntu 16.04 LTS desktop. You can’t do this on an Ubuntu Core device directly as creating your image can take quite some disk spaces. A VM can work as well.
  - A [snap store] account to register your authority keys
  - Some very basic knowledge of command line use, know how to edit files.


Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient


## Getting started
Duration: 1:00

If you are on Ubuntu 16.04 LTS or Ubuntu 16.10, getting all the required tools is very easy.


positive
: Note: other GNU/Linux distributions are currently in the process of building images.


Now simply run:

```bash
$ sudo apt install ubuntu-image snapd snapcraft
```

This will install **ubuntu-image** and some additional tools we are going to need for creating our own images. snapcraft and snapd are needed register the authority key and sign your model assertion.

Ensure that ubuntu-image works as expected:


```bash
$ ubuntu-image --help
usage: ubuntu-image [-h] [--version] [-d] [-o FILENAME] [--image-size SIZE]
                    [--extra-snaps EXTRA_SNAPS] [--cloud-init USER-DATA-FILE]
                    [-c CHANNEL] [-w DIRECTORY] [-u STEP | -t STEP | -r]
                    [model_assertion]

Generate a bootable disk image.

optional arguments:
  -h, --help            show this help message and exit
  --version             show program's version number and exit

Common options:
  model_assertion       Path to the model assertion file. This argument must
                        be given unless the state machine is being resumed, in
                        which case it cannot be given.
  -d, --debug           Enable debugging output
  -o FILENAME, --output FILENAME
                        The generated disk image file. If not given, the image
                        will be put in a file called disk.img in the working
                        directory (in which case, you probably want to specify
                        -w).
  --image-size SIZE     The size of the generated disk image file (see
                        -o/--output). If this size is smaller than the minimum
                        calculated size of the image a warning will be issued
                        and --image-size will be ignored. The value is the
                        size in bytes, with allowable suffixes 'M' for MiB and
                        'G' for GiB.

Image contents options:
  Additional options for defining the contents of snap-based images.

  --extra-snaps EXTRA_SNAPS
                        Extra snaps to install. This is passed through to
                        `snap prepare-image`.
  --cloud-init USER-DATA-FILE
                        cloud-config data to be copied to the image
  -c CHANNEL, --channel CHANNEL
                        The snap channel to use

State machine options:
  Options for controlling the internal state machine. Other than -w, these
  options are mutually exclusive. When -u or -t is given, the state machine
  can be resumed later with -r, but -w must be given in that case since the
  state is saved in a .ubuntu-image.pck file in the working directory.

  -w DIRECTORY, --workdir DIRECTORY
                        The working directory in which to download and unpack
                        all the source files for the image. This directory can
                        exist or not, and it is not removed after this program
                        exits. If not given, a temporary working directory is
                        used instead, which *is* deleted after this program
                        exits. Use -w if you want to be able to resume a
                        partial state machine run.
  -u STEP, --until STEP
                        Run the state machine until the given STEP, non-
                        inclusively. STEP can be a name or number.
  -t STEP, --thru STEP  Run the state machine through the given STEP,
                        inclusively. STEP can be a name or number.
  -r, --resume          Continue the state machine from the previously saved
                        state. It is an error if there is no previous state.
```

You will see that the requirement argument for ubuntu-image is the model assertion. Let’s discuss about what this is and what compose an Ubuntu Core image exactly.


## Dissection of an Ubuntu Core image
Duration: 4:00

### What your image is made of

![IMAGE](https://assets.ubuntu.com/v1/e997c521-snap-content.png)


If you simply run `snap list` on your Ubuntu Core image, you will see that your image is already composed of many snap. For instance, on our Intel Joule:


```bash
$ snap list
Name         Version                 Rev  Developer  Notes
core         16.04.1                 714  canonical  -
joule        16.04-0.8+1             1    canonical  -
joule-linux  4.4.0-1000-0+joule08-1  1    canonical  -
```

You will always have at least 3 snaps installed on your Ubuntu device:

  - A Core snap
  - A Kernel snap
  - A Gadget snap

Optionally, you will have default application snaps installed on your image. We are going to add one to our custom device image.

#### Core snap


```bash
$ snap info core
name:      core
summary:   "snapd runtime environment"
publisher: canonical
description: |
  The core runtime environment for snapd
type:        core
tracking:    
installed:   16.04.1 (714) 79MB -
refreshed:   2016-12-16 04:28:38 +0000 UTC
channels:                  
  stable:    16.04.1 (714) 0B -
  candidate: 16.04.1 (714) 0B -
  beta:      16.04.1 (714) 0B -
  edge:      16.04.1 (866) 0B -
```

The Core snap (previously called Ubuntu Core snap) is the base system your system is running on. It contains for instance the init system, basic services like networking, default files and libraries like libc. It also has snapd installed and running within it, which is managing other snaps and reboot for the device.
You can basically see this core snap as the “/” of your system.

You will not normally need to ship your own Core snap and rely on the maintained Ubuntu one.

#### Kernel snap


```bash
$ snap info joule-linux
name:      joule-linux
summary:   "linux kernel for Intel Joule"
publisher: canonical
description: |
  Kernel snap for Intel Joule
type:        kernel
tracking:    
installed:   4.4.0-1000-0+joule08-1 (1) 140MB -
refreshed:   2016-12-11 12:03:09 +0000 UTC
channels:                               
  candidate: 4.4.0-1000-0+joule08-1 (1) 0B -
  beta:      4.4.0-1000-0+joule08-1 (1) 0B -
  edge:      4.4.0-1000-0+joule08-1 (1) 0B -
```

The kernel snap ships the Ubuntu Core kernel, specific for a device hardware. It doesn't limit itself to the kernel, as it includes other parts like drivers.

You can build your own kernel snap via **snapcraft** if desired, but most of the time, you won’t differentiate on the kernel and rely on the one provided for your device if already enabled. If not, you are more than welcome to build your own kernel snap and share it with the community of course!

We are going to reuse the one that is already provided in the store for our device.

#### Gadget snap


```bash
$ snap info joule
name:      joule
summary:   "Joule system package"
publisher: canonical
description: |
  system configuration of Intel Joule platform

type:      gadget
tracking:  
installed: 16.04-0.8+1 (1) 1MB -
refreshed: 2016-11-18 08:47:45 +0000 UTC
```

The gadget snap is a key snap for device boot, as it contains the description of the boot and file system layout, which is then used for image building. The gadget snap is also responsible for defining and manipulating the system properties which are specific to one or more devices (like default configuration for some services). You can thus have multiple devices with the exact same hardware, but different gadget snap for different level of use (beginner, intermediate, experts) or different kind of use (home router, enterprise configuration…).

You can as well build your own gadget snap, upload it to the store after signing it, but here, we are going to reuse the existing one as well.

### Model assertion

The model is a json file that specifies which model you are building, what Ubuntu Core series you are tracking for which architecture, and what gadget and kernel snaps you are using in your image creation for your device.
You can as well specify extra required snaps that will be installed by default on the image.

An assertion is a digitally signed document that expresses a fact or policy by a particular authority about a particular object in the snap universe. An assertion consists of a set of structured headers, which vary based on the type of assertion, an optional body (variable format, depends on type of assertion) and the signature.

We are thus going to create a model json file, and then sign it with our authority account to create a model assertion that will be accepted by **ubuntu-image**.

Let’s create those keys for signing before diving into the model itself!


## Create your signature keys
Duration: 5:00

Before starting with building the image, you need to create a key to sign your future store uploads. You will only to do this one for your signature authority.

### Create a key

As a first step, you have to generate a key that will be linked to your Ubuntu Store account. To do so, run:


```bash
$ snap create-key my-key-name
Passphrase:
Confirm passphrase:
```

This command will ask you for a password to protect the key. Note it down!

It will take some time, as it's creating a 4096 bit long key and needs some entropy to complete. To speed up the process, you can install the **rng-tools** package beforehand.


positive
: Note that my-key-name is optional, but it enables you to have multiple keys and select each time which key you want to sign with (can be useful if you have personal keys for testing, company keys for production).


Once the key is generated, you can list your keys with:


```bash
$ snap keys
Name           SHA3-384
my-key-name    zSC0HgMmN76pF7Y-ZbeCkmDkRB7nGDARS6CPlyOlPcJ5jgdsIanVnN3NIrV3lItg
```

### Upload your new key to the store

Next, you will need to upload it to the store, effectively linking your key to your account and thus, identifying your future device to the store.

```bash
$ snapcraft register-key
Select a key:

  Number  Name           SHA3-384 fingerprint
       1  test-joule-img  sFR2R2By6JArEvp5DbniCm7L_mnTISHYiewRtO-uv98fC2MRU2UDjKckwaKL97g7
       2  my-key-name    zSC0HgMmN76pF7Y-ZbeCkmDkRB7nGDARS6CPlyOlPcJ5jgdsIanVnN3NIrV3lItg

Key number: 2
Enter your Ubuntu One SSO credentials.
Email: my-email@ubuntu.com
Password:
Second-factor auth:

Login successful.
Registering key ...

You need a passphrase to unlock the secret key for user: “ my-key-name “
4096-bit RSA key, ID 0B79B865, created 2016-01-01

Done. The key "my-key-name" (zSC0HgMmN76pF7Y-ZbeCkmDkRB7nGDARS6CPlyOlPcJ5jgdsIanVnN3NIrV3lItg) may be used to sign your assertions.

```

During this step, you will be asked to select an existing key, then login with your store account credentials and test your passphrase to unlock your key locally.

The key is now registered with the store and you can start creating the model assertion!

## Creating a model assertion
Duration: 3:00

Let’s create a model definition file, specifying the definition of our device and what snaps composes it by default.

### Model definition

The model definition is a json simple file. In a directory create `joule-model.json` with that content:


```bash
{
  "type": "model",
  "series": "16",
  "model": "joule",
  "architecture": "amd64",
  "gadget": "joule",
  "kernel": "joule-linux",
  "authority-id": "TODO",
  "brand-id": "TODO",
  "timestamp": "TODO"
}
```

Here are the keys we are defining:

  - **type**: the assertion type you are creating (here a model assertion)
  - **series**: the Ubuntu Core series you are targeting. We are targeting here Core 16.
  - **model**: a free form lower-case name for your target device.
  - **architecture**: the architecture of the device you are building the image for. Note that every snaps that will be installed on that image will respect that architecture. As Intel Joule is an 64 bits intel base processor, we set here amd64 as the architecture name. On other model, you can specify x86 (intel 32 bits), armhf (armel 32 bits) or amr64 (armel 64 bits).
  - **gadget**: name of the gadget snap as published on the store. Note that this snap can be a file on disk.
  - **kernel**: name of the gadget snap as published on the store. Similarly to the gadget snap, it can be a file on disk.

Let’s now precise **authority-id** and **brand-id**. Those refer to the store account. We will set the same value for both (but you can have a different brand and authority in theory) using the account ID that you will find it on [your account page] in the "Snap account-id" field. Note that the signing keys will be validated against this account id.
Finally, timestamp is a valid timestamp you need to generate using:


```bash
$ date -Iseconds --utc
2017-01-06T15:54:34+00:00
```


positive
: Note that this timestamp should be posterior to the signing key creation.


### Adding additional default snaps

Let’s add one more key (the order doesn’t really matter, but I suggest adding it after the kernel snap definition for coherence) in `joule-model.json`:


```bash
{
  […]
  "kernel": "joule-linux",
  "required-snaps": ["hello", "hello-world"],
  […]
}
```

This will specify to install both “**hello**” and “**hello-world**” snaps during image creation.



Despite the “required” name, a known bug make it possible to remove those snaps after booting on the final image. This is known with current version of snapd (2.16) and will get fixed in the future.


### Sign the model assertion
As we already discussed, we need now to sign with our previously created key this model definition in json to create a model assertion, consumable by ubuntu-image. This is as simple as:


```bash
$ cat joule-model.json | snap sign -k my-key-name > joule.model
You need a passphrase to unlock the secret key for
user: "my-key-name"
4096-bit RSA key, ID 0B79B865, created 2016-01-01

Enter passphrase:
```

After giving your passphrase, a `joule.model` file is created, which is a sign document which will look like:


```bash
$ cat joule.model
type: model
authority-id: <YOURID>
series: 16
brand-id: <YOURID>
model: joule
architecture: amd64
gadget: joule
kernel: joule-linux
required-snaps:
  - hello
  - hello-world
timestamp: 2016-12-15T08:01:00+00:00
sign-key-sha3-384: zSC0HgMmN76pF7Y-ZbeCkmDkRB7nBAERS6CPlyOlPcJ5jgdsIanVnN3NIrV3lItg

AcLLAABCFZoABgUCWG/AkAAKCRBXzJG8C3m4ZaMRD/92lEpwGmXIPM+aT4I3i1/qKJQDCMtjCFqv
DOWfd2Hb4ky48HG4Tp5xXCcGj1x8sXoChRZ9LZrkgjGCfHHvMTEIkT4PR8uSBf6PuaDl/nYoh0CV
CBaGTr9Zkm4ECopGOIjRNtXyCeZHl7OI47W0IUh1XK5NaZv43EMLojEBU40EqlOHuny/Nxqv/G8H
bp3hIxg6+x7OhZWoFUhD5mjqOf7c1rue1JaxCo9ZBbmISWjf3dKWmKT26IhEc9zsnIAG/4/QIabf
A6mC+RJTfLbTUqqbMgS1qplC4OdxWxFtCvpikj8ZGe0CiZbSZ/PGT0yVCsSu+xMb/N+mJ6rqQ7BK
KmU+L4R7NW49+WmOXUsa2xGy9eO/0KS23baeeztaiVBqBzlIgx4A0cjq7X3nNiS8fqCX++UB6OXm
VWIgnNhUWIVPPeDxC6ymmGLOsvvSTYSmxrpkf8J7st5RxvQk+cdYuePm+Fy/BeALPA0lN+Nl8t74
BXDFOcNdhvDEeX2/wrywT/2qCPikfqeKk8ghAme0bv7KeYBU8eOect9Hfz1O1o4sytMNj0DNptfl
8TmaR8EaWvlYLo+rh4KO1TJrxrM+8XpBD0A1jJWBAfKBgenfvi+sUigMG0SCbJ/2BESRRKonvWC5
LmMuuAPwoeDkimRr9M6WY6XAso9Qku25kIH2IyDFMQ==


```

You will find back the information you gave in a YAML format, followed by a signature authenticating this document.
Every time you change your model definition in the JSON format, you will thus need to generate this corresponding model assertion.

The last step will be the easiest: actually building the image!

## Building the image
Duration: 3:00

Now that we have a signed model assertions, defining all bits we need to create our image, it’s time to build it!

### Using ubuntu-image

`ubuntu-image` is the command line tool used to create your device image. For making this workshop a little bit more exciting, we are going to fetch the snaps from the **beta** channel, and write its output to `joule.img`.


```bash
$ sudo ubuntu-image -o joule.img -c beta joule.model
Fetching core
Fetching joule-linux
Fetching joule
Fetching hello
Fetching hello-world
```

You can see that the core, gadget, kernel, hello and hello-world snaps are downloaded one after another from the beta channel. They are then all assembled to form this device image.


```bash
$ ls -lh joule.img
-rw-rw-r-- 1 didrocks didrocks 695M Jan  6 17:20 joule.img
```



positive
: Note that the device image default size (that can be changed via the **--image-size** option) will only match the needed space for all those snaps. First Ubuntu Core image boot will take longer than usual as it match the image size with the space available on disk.


And here is your device image file, which contains your extra snaps! This one can be copied to any removable device like


```bash
$ sudo dd if=joule.img of=/dev/sdXX bs=32M; sync;
```

## That’s all folks!
Duration: 1:00

Congratulations! You now have your own device image file for your specific device. This image is easily flashable on any SDCard or eMMC and can be booted right away.

You should by now be familiar with the various snaps composing an Ubuntu image: Core snap, kernel, gadget. You know that snapd is using a model assertion to define all pieces composing an image and this is what is used to build the image via the ubuntu-image tool.
Finally, you know also that you can change those default snaps, and add more applications snaps as you require them. If you produce your own gadget or kernel snap, you can swap as well default ones and enable a new board that way.

### Next steps
  - You should flash your new image to your device to test how this one behaves, checking that those
  - Learn some more advanced techniques on how to use your snap system looking for our others codelabs!
  - Join the snapcraft.io community on the [snapcraft forum].

### Further readings
  - The [board enablement documentation] is a good complement to this codelab, refining some of the terms and definition we used there, and giving you example on creating your own gadget and kernel snaps.
  - Some [more definition] of the gadget snaps and some prepare-device hooks.
  - Definition and theory of [an assertion].
  - Check how you can [contact us and the broader community].





[Intel Joule]: https://software.intel.com/en-us/iot/hardware/joule/dev-kit
[snapcraft forum]: https://forum.snapcraft.io/
[board enablement documentation]: https://docs.ubuntu.com/core/en/guides/build-device/board-enablement#the-model-assertion
[more definition]: https://docs.ubuntu.com/core/en/guides/build-device/gadget
[an assertion]: https://docs.ubuntu.com/core/en/guides/build-device/assertions
[contact us and the broader community]: http://snapcraft.io/community/
[snap store]: https://dashboard.snapcraft.io
[your account page]: https://dashboard.snapcraft.io/dev/account/
