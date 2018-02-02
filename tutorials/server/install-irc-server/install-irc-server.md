---
id: tutorial-irc-server
summary: Learn how to install, configure and run the fantastic InspIRCd IRC server, direct from the latest source code.
categories: server
status: published
tags: irc, InspIRCd, chat, server, guide, tutorial, hidden
difficulty: 4
published: 2018-02-02
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Varun Patel <varun-patel@live.com>

---

# Run your own IRC server

## Overview
Duration: 2:00

Despite modern alternatives like Slack, the ancient *[IRC][irc-info]* is still hugely popular as an online interactive chat platform. 

This may be because there are IRC clients for almost every operating system and device, from the Commodore Amiga to your smartphone, and the technology behind IRC is reassuringly simplistic - it really is just raw text and a few control characters being bumped around the network.

Online servers, such as those offered by [Freenode][freenode], are wonderful for both public and private channels. But it's equally easy to run your own private IRC server, giving you complete control over your data, logs and configuration settings whilst avoiding all the risks and frustrations of dealing with IRC spammers and bots.

In this tutorial, we'll cover installing the [InspIRCd][inspircd] IRC server on Ubuntu, from installing its dependencies and building the latest version from GitHub, to configuration and execution.


### What you'll learn

* How to prepare your environment for the installation of InspIRCd
* How to build and install InspIRCd from GitHub
* How to start your first InspIRCd server
* How to configure InspIRCd

### What you'll need

* A computer running Ubuntu 16.04 LTS (Xenial) or later
* A network connection

positive
: This tutorial is recommended for users who are comfortable using the terminal.

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

## Dependencies
Duration: 3:00

For the first step, we'll install the dependencies needed to build and run InspIRCd, starting with *git*:

```bash
sudo apt-get install git
```

Next is *Perl* so we can run the configuration script included with InspIRCd:

```bash
sudo apt-get install perl
sudo apt-get install g++
```

And finally we need to make sure that *make* is installed:

```bash
sudo apt-get install make
```

## Download source
Duration: 3:00

The latest version of InspIRCd can be downloaded from:
[https://github.com/inspircd/inspircd/releases/latest](https://github.com/inspircd/inspircd/releases/latest)

As we're going to be building the latest version from the source code, we need to grab the *tar.gz* archive either with your browser or from the command line. To take version `2.0.25` as an example, you could use the following command to download the archive:

```bash
wget https://github.com/inspircd/inspircd/archive/v2.0.25.tar.gz
```

Use *tar* to extract the download: 

```bash
tar xvf ./v2.0.25.tar.gz
```

## Build configuration
Duration: 5:00

With the source code downloaded and extracted, we can now configure how we want InspIRCd built.

First, enter the installation directory:

```bash
cd inspircd-2.0.25
```

positive
: The version number above needs to correspond with your downloaded version.

To begin configuring the installation, enter the following:

```bash
perl ./configure
```

You are now asked a series of questions. When unsure, press *return* to answer with the default values.

The final question will ask whether you'd like to check for updates to third-party modules, and you should answer `y` for yes.

The final output should be similar to the following:

```no-output
Ok, 144 modules.
Writing inspircd_config.h
Writing GNUmakefile ...
Writing BSDmakefile ...
Writing inspircd ...
Writing cache file for future ./configures ...


To build your server with these settings, please run 'make' now.
*** Remember to edit your configuration files!!! ***
```

We can now proceed with the *build* step.


## Build the server
Duration: 15:00

The server can now be built by executing `make` in the installation directory. This process will take around 10 minutes, depending on your system speed, so feel free to step away from the computer.

With that complete, type `make install` to move the executable files into the locations configured earlier. An overview of this process is output upon completion:

```no-highlight
*************************************
*       BUILDING INSPIRCD           *
*                                   *
*   This will take a *long* time.   *
*     Why not read our wiki at      *
*     http://wiki.inspircd.org      *
*  while you wait for make to run?  *
*************************************

*************************************
*        INSTALL COMPLETE!          *
*************************************
Paths:
  Base install: /home/javier/build/inspircd-2.0.25/run
  Configuration: /home/javier/build/inspircd-2.0.25/run/conf
  Binaries: /home/javier/build/inspircd-2.0.25/run/bin
  Modules: /home/javier/build/inspircd-2.0.25/run/modules
  Data: /home/javier/build/inspircd-2.0.25/run/data
To start the ircd, run: /home/javier/build/inspircd-2.0.25/run/inspircd start
Remember to create your config file: /home/javier/build/inspircd-2.0.25/run/conf/inspircd.conf
Examples are available at: /home/javier/build/inspircd-2.0.25/run/conf/examples/
```

With InspIRCd fully installed, we can configure the server.


## Server configuration
Duration: 10:00

From the build directory, create a text file called `run/config/inspircd.conf` and insert the following:

```xml
<config format="xml">
<define name="bindip" value="1.2.2.3">
<define name="localips" value="&bindip;/24">

####### SERVER CONFIGURATION #######

<server
        name="SERVER_HOSTNAME/FQDN"
        description="SERVER_DESCRIPTION"
        id="SERVER_SID"
        network="NETWORK_NAME">


####### ADMIN INFO #######

<admin
       name="ADMIN_NAME"
       nick="ADMIN_NICK"
       email="ADMIN_EMAIL">

####### PORT CONFIGURATION #######

<bind
      address="SERVER_IP"
      port="SERVER_PORT"
      type="SERVER_TYPE">
```

Change the following values in the above text to reflect your own configuration:

* *SERVER_HOSTNAME/FQDN*: Hostname for the server
* *SERVER_DESCRIPTION*: A description for your server
* *SERVER_SID*: A unique sequence of 3 characters, the first being a number (make sure to capitalise)
* *NETWORK_NAME*: The name of your IRC network
* *ADNIN_NAME*: IRC *admin* name
* *ADMIN_NICK*: IRC *admin* nick
* *ADMIN_EMAIL*: IRC *admin* email
* *SERVER_IP*: Public IP for the server
* *SERVER_PORT*: Server port (usually 6697)
* *SERVER_TYPE*: The clients or servers type (clients should be fine here)

The configuration file should now look something like this:

```xml
<config format="xml">
<define name="bindip" value="1.2.2.3">
<define name="localips" value="&bindip;/24">

####### SERVER CONFIGURATION #######

<server
        name="tutorials.ubuntu.com"
        description="Welcome to Ubuntu Tutorials"
        id="97K"
        network="tutorials.ubuntu.com">


####### ADMIN INFO #######

<admin
       name="tutorial ubuntu"
       nick="tutorial"
       email="tutorials@ubuntu.com">

####### PORT CONFIGURATION #######

<bind
      address="23.54.785.654"
      port="6697"
      type="clients">
```

Make sure you save your changes!

## Run the server
Duration: 2:00

It's now time to start up InspIRCd for the first time!

In your the terminal window, type:

```bash
./inspircd start
./inspircd status
```

If successful, you will see the following output:

```no-highlight
InspIRCd is running (PID: 13301)
```

Congratulations! Your server is now online!

Any IRC client capable of accessing your server will now be able to connect to your IRC server.

## Congratulations!
Duration: 2:00

### You now know how to:

* Grab source code from GitHub
* Prepare an environment to build InspIRCd
* Configure InspIRCd using a `.conf` file
* Start the service

### What's Next?

* Modify your external internet connection to forward port 6697
* Ensure your network has a static IP address
* Get a URL to easily send traffic to your server (optional)

Changes to your IRC server need to be made to the config file and a list of supported commands and other useful information can be found at [InspIRCd's Wiki](https://wiki.InspIRCd.org/).

### Need Help?

* Double Check that the port is available
* Ensure the `.config` file is correct
* Make sure you typed the commands properly
* Try using sudo (if you aren't already)
* Ask a question on [Ask Ubuntu][ask-ubuntu]


<!-- LINKS -->
[irc-info]: https://en.wikipedia.org/wiki/Internet_Relay_Chat
[freenode]: https://freenode.net/
[inspircd]: http://www.inspircd.org/
[ask-ubuntu]: https://askubuntu.com/
