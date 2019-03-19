---
id: create-custom-lxd-images
summary: Create custom Ubuntu or Debian LXD images to use locally or publish
categories: containers
tags: tutorial,desktop,server,lxd,lxc,debian, gci
difficulty: 3
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2018-07-04
author: Marcin Mikołajczak <me@m4sk.in>

---

# Creating custom LXD images

## Overview
Duration: 1:00

[LXD](https://linuxcontainers.org/lxd) is a container hypervisor providing a ReST API to manage LXC containers.

![logo](images/containers.png)

This tutorial will show how to create a custom LXD image based on a basic Debian (or Debian-based distribution like Ubuntu) installation, to use locally or to publish.

### Requirements

  - Ubuntu 16.04 or newer
  - You should know how to create and launch an LXD/LXC container

## Install required packages
Duration: 1:00

### Installing debootstrap

To create minimal Debian system in specified directory from existing Linux installation, we will use debootstrap. Install it using:

```bash
sudo apt install debootstrap
```

We assume that you have already installed and configured LXD. If not, complete the [“Setting up LXD on Ubuntu 16.04”](/tutorial/tutorial-setting-up-lxd-1604) tutorial.

## Creating basic system installation
Duration: 5:00

### Installing Debian with debootstrap

After installing debootstrap, we can create a minimal installation of Debian in a specified directory. The command takes two arguments: the release to create and the target directory . To install Debian Sid (unstable) in new temporary directory:

```bash
mkdir /tmp/sid-lxd
sudo debootstrap sid /tmp/sid-lxd
```

positive
: You can specify a mirror as a third argument to install another Debian-based distribution. For example, to install Ubuntu Artful, use `sudo debootstrap artful /tmp/somewhere http://archive.ubuntu.com/ubuntu/`.

Now, enter the created chroot and make some changes, just to make our container different. For example, we can preconfigure the repository for the popular JavaScript runtime, Node.js:

```bash
sudo chroot /tmp/sid-lxd
wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
echo 'deb https://deb.nodesource.com/node_8.x sid main' > /etc/apt/sources.list.d/nodesource.list
echo 'deb-src https://deb.nodesource.com/node_8.x sid main' >> /etc/apt/sources.list.d/nodesource.list
exit
```

### Compressing system root directory in .tar.gz file.

If everything worked fine, create a compressed tarball of the root directory of your newly installed system:

```bash
sudo tar -cvzf rootfs.tar.gz -C /tmp/sid-lxd .
```

## Creating a metadata file
Duration: 2:00

The `metadata.yaml` file describes things like image creation date, name, architecture and description. To create an LXD image, we need to provide such a file. Here's an example of how simple metadata file should look:

```
architecture: "x86_64"
creation_date: 1458040200 # To get current date in Unix time, use `date +%s` command
properties:
architecture: "x86_64"
description: "Debian Unstable (sid) with preconfigured Node.js repository (20171227)"
os: "debian"
release: "sid"
```

### Creating a tarball from the metadata file

After creating metadata file, we need to create tarball containing this file:

```bash
tar -cvzf metadata.tar.gz metadata.yaml
```

Now, it’s time for importing our new LXD image!

## Importing LXD images
Duration: 2:00

After creating them, let’s import our two tarballs as LXD images:

```bash
lxc image import metadata.tar.gz rootfs.tar.gz --alias sid-nodejs
```

We can now create a new container from this image:

```bash
lxc launch sid-nodejs tutorial
lxc exec tutorial bash
```

You can verify whether our container uses Node.js repository with `sudo apt update && sudo apt-cache show nodejs`. The `nodejs` package should contain `1nodesource1` in “Version”.


## Making images public
Duration: 3:00

### Configuring the LXD daemon

The LXD daemon works as an image server. In order to use it, we have to make LXD listen to the network and tag our image as public:

```bash
lxc config set core.https_address "[::]:8443"
```

Now, other users can add our server as a public image server using:

```bash
lxc remote add [name] [IP] --public
```

They can use following command to create containers from our image:

```bash
lxc launch [name]:[image-name]
```

### Making LXD images public

To make our LXD image available for our server users, we have to modify the `public` parameter, it’s `false` by default:

```bash
lxc image edit sid-nodejs
```

It will open image properties in system default text editor. Replace `false` in the last line with `true` and save the file. You have just shared your LXD image!

## That’s all!

Now you should know how to create LXD images and use LXD daemon to share them with others.

If you’d like to know more about LXD, take a look at the following resources:

* [LXD documentation in the source tree](https://github.com/lxc/lxd)
* [LXD 2.0 blog post series by Stéphane Graber](https://stgraber.org/2016/03/11/lxd-2-0-blog-post-series-012/)

Also, if you have questions or need help, you can find direct help here:

* [Linux Containers forum](https://discuss.linuxcontainers.org/)
* [Ask Ubuntu](https://askubuntu.com/)
* The `#lxcontainers` IRC channel on Freenode
