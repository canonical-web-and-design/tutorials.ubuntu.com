---
id: basic-snap-usage
summary: In this tutorial, we are going to cover the very basic on how to use snaps on your distributions, and the main benefits from them.
categories: packaging
status: Published
feedback link: https://github.com/ubuntu/codelabs/issues
tags: snap, usage, beginner, idf-2016
difficulty: 1
published: 2016-08-15

---

# Basic snap usage

## Introduction
Duration: 1:00

Welcome to the world of snaps! In this tutorial, we are going to cover the very basics on how to use [snaps] on your Linux distribution, and you’ll directly see the main benefits of them in action.


![IMAGE](./snaps-hero.png)


### What you’ll learn

  - How to install the snapd service on your system.
  - How to search for software.
  - How to check the list of installed pieces of software.
  - How snaps are updated.
  - What snap channels are and how to use them.
  - How to roll back to the previous version of a snap.

If this looks like a long list to you, you will find that you are going to get through it in a breeze. All of the above is very easy to do thanks to the simplicity of the snap command line interface.

### What you’ll need

  - Any supported GNU/Linux distribution (see next step of the tutorial for more details).
  - Some very basic knowledge of command line use.

This tutorial is focused on using the snap command. Some command line tools are provided for you to simply copy and paste.

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

## Getting set up
Duration: 2:00

### Installing snapd
`snapd` is the service which runs on your machine and keeps track of your installed snaps, interacts with the store and provides the snap command for you to interact with it. Installing it on any of the Linux distributions mentioned below is straight-forward.


![IMAGE](./hero-artwork.png)



### Different distributions:

**Arch**

```bash
$ sudo pacman -S snapd

# enable the snapd systemd service:
sudo systemctl enable --now snapd.socket
```

**Debian (Sid only)**

```bash
$ sudo apt install snapd
```

**Fedora**

```bash
$ sudo dnf copr enable zyga/snapcore
$ sudo dnf install snapd

# enable the snapd systemd service:
$ sudo systemctl enable --now snapd.service

# SELinux support is in beta, so currently:
$ sudo setenforce 0

# to persist, edit /etc/selinux/config to set SELINUX=permissive and reboot.
```

**Gentoo**

Install the [gentoo-snappy overlay].
OpenEmbedded/Yocto
Install the [snap meta layer].

**openSuSE**

```bash
$ sudo zypper addrepo http://download.opensuse.org/repositories/system:/snappy/openSUSE_Leap_42.2/ snappy
$ sudo zypper install snapd
```

**OpenWrt**

Enable the [snap-openwrt feed].

**Ubuntu**
You should already be all set on ubuntu 16.04 LTS desktop. On 14.04, you need to install it though via:

```bash
$ sudo apt install snapd
```

Now that your system is all ready to go, let’s install your first snap on it!

negative
: Important: we are currently disabling SELinux for some distributions and as such don’t provide full confinement and security on those platforms yet. We are working heavily on this so that all Linux distributions benefit from these features as soon as possible.


## Installing and running your first snap
Duration: 3:00

### Searching for a snap

`snapd` is up and running now, so let’s start using it! Here is how you can find any “hello world” kind of snaps in the store:

```bash
$ snap find hello
hello-node-snap       1.0.2        bhdouglass      -  	A simple hello world command
hello-mdeslaur        2.10 	mdeslaur	-  	GNU Hello, the "hello world" snap
hello-snap    	0.01 	muhammad	-  	GNU hello-snap, the "Hello, Snap!" snap
hello         	2.10 	canonical       -  	GNU Hello, the "hello world" snap
hello-world   	6.3  	canonical       -  	The 'hello-world' of snaps
hello-sergiusens      1.0  	sergiusens      -  	hello world example
hello-gabriell	0.1  	gabriell	-  	Qt Hello World example
hello-bluet   	0.1  	bluet   	-  	Qt Hello World example
so-hello-world	0.2  	shadowen	-  	the old classic
hello-huge    	1.0  	noise   	-  	a really big snap
```

`snap find <search terms>` will query the store and list the results with their version number, developer names and description.

### Install and execution

As you can see, a number of developers uploaded snaps related to “hello world”. Let’s just install one of them.

```bash
$ sudo snap install hello

hello (stable) 2.10 from 'canonical' installed
```

positive
: Note: when you install the first snap, snapd will download the base OS snap (which includes the very minimal bits required apps in confinement and amounts to some megabytes). Consequently, your first snap download time can take a little bit longer than it will be in the future for any other snap.


To run the command, simply type hello in the command line (which is a command provided by the `hello` snap):

```bash
$ hello
Hello, world!
```

This is obviously just a simple example, what it has in common with all other snaps though, is that it runs fully confined and can only access its own data.

### Check which snaps are installed

See the snaps installed on your system with `snap list`, which will also tell you the software version, the unique revision, the developer of the installed snap, and any optional extra information.


```bash
$ snap list
Name             	Version	Rev  Developer   Notes
hello            	2.10   	20   canonical   -
core      	16.04.1	423  canonical   -
```

You will note that the `core` snap, containing the base snap system is also part of the list. Among other things, it includes a newer snapd, which will make sure you will always be up to date).

### Keeping your system up to date

The good news is that snaps are updated automatically in the background every day! If you want, you can still get the latest version of all your snaps manually by running `snap refresh`. It will bring you completely up to date for all snaps, unless you specify a particular snap to refresh.


```bash
$ sudo snap refresh hello
error: cannot refresh "hello": snap "hello" has no updates available
$ sudo snap refresh
core updated
hello 64.75 MB [=====================================>___]   12s

```

But these aren’t the only features of the snap command: you can get way more fine-grained in terms of tracking various versions of the same app, depending on how close to current development you want to be. This is all possible thanks to the channel feature! We might delve into this later on.

## More snap features
Duration: 1:00

### Snap can ship one or more commands

Our first example was simple and shipped only one command, but in general snap packages can contain more than one command (for example a set of tools shipped in one snap). All commands are then namespaced by the snap package name. Run the steps below to see an example in action:


```bash
$ sudo snap install hello-world
0 B / 20.00 KB [_______________________________________________________] 0.00 %

hello-world (stable) 6.3 from 'canonical' installed
$ hello-world
Hello World!
$ hello-world.env
< env variables >
```


positive
: Note: for our first command, there is no command name suffix. This is due to the fact that the snap can have a default command.

### Snap can also host services

What is a service? A service is simply a long running command, which will ideally always be on or for a definite period of time to answer some requests.
Snaps can also ship system-wide services. If you install the snap package called **shout** (a self-contained web irc client), you can see this live in action - simply point your browser to [http://localhost:9000/] to interact with the service.

Services of snaps are simply started/stopped on system startup and shutdown. They can be configured to be activated on demand as well.

### Removing a snap

Removing a snap is just a command away, all you need to do is run `snap remove <snap name>`. In our case just do:


```bash
$ sudo snap remove hello-world

hello-world removed
```

Nice and clean, nothing is left-over! Application code, its run time dependencies and associated user data are all cleaned up. If your snap declared a service, they will as well be shut down and removed.


## Using versions and channels
Duration: 2:00

Developers can release stable, candidate, beta and edge versions of a snap at the same time, to engage with a community who are willing to test upcoming changes. You decide how close to the leading edge you want to be.

By default, snaps are installed from the `stable` channel. By convention, developers use the `candidate` channel to provide a heads-up of a new stable revision, putting it in candidate a few days before stable so that people can test it out. The `beta` channel is for unfinished but interesting milestones, and the `edge` channel is conventionally used for regular or daily development builds that have passed some lightweight smoke-testing.

### Switching channel for installed apps


```bash
$ sudo snap refresh hello --channel=beta

hello (beta) 2.10.1 from 'canonical' refreshed
```

Now, you can run the beta version of the snap and see its output is different:


```bash
$ hello
Hello, snap padawan!
```

`snapd` will now track the `beta` channel of the `hello` snap and get any updates delivered through it.


```bash
Note that we could also have installed this snap directly from the beta channel via
`$ sudo snap install hello --beta`
```

### And revert if something goes wrong!

One of the features of `snapd` is to be able to simply roll back to a previous version of an application (including the data associated with the snap) for any reason:


```bash
$ sudo snap revert hello

hello reverted to 2.10
$ hello
Hello, world!
```

With this rollback system built-in, you can confidently update knowing that you will always have a way to go back to the previous working state!


## That’s all folks!
Duration: 1:00

### Easy, wasn’t it?

Congratulations! You made it!

By now you should have found snaps in the store, installed and updated them, changed between channels and much more. The `snap` command line is designed to be as simple and memorisable as possible. After using it just a couple of times, it should become second nature to you.

### Next steps

  - Jump into more advanced features and techniques of snaps, by reading the exhaustive “[Advanced snap usage]” tutorial.
  - Be amazed by the ease of creating a snap for your project by following the snapcraft tutorial called “[Creating your first snap]”.
  - Join the snapcraft.io community on the [snapcraft forum].

### Further reading

  - [Snapcraft.io documentation] is a good place to start reading the whole snap and snapcraft doc.
  - Check how you can [contact us and the broader community].





[snaps]: http://snapcraft.io/
[gentoo-snappy overlay]: https://github.com/zyga/gentoo-snappy
[snap meta layer]: https://github.com/morphis/meta-snappy/blob/master/README.md
[snap-openwrt feed]: https://github.com/teknoraver/snap-openwrt/blob/master/README.md
[http://localhost:9000/]: http://localhost:9000/
[Advanced snap usage]: https://tutorials.ubuntu.com/tutorial/advanced-snap-usage
[Creating your first snap]: https://tutorials.ubuntu.com/tutorial/create-your-first-snap
[snapcraft forum]: https://forum.snapcraft.io/
[Snapcraft.io documentation]: http://snapcraft.io/docs/
[contact us and the broader community]: http://snapcraft.io/community/
