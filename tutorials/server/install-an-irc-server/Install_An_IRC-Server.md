---
id: tutorial-irc-server
summary: Learn how to install and configure an InspIRCd IRC server. this is for more advanced users comfortable with the command line.
categories: server
status: draft
tags: irc, InspIRCd, chat, server, guide, tutorial
difficulty: 3
published: 2017-12-03
feedback-url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Varun Patel <varun-patel@live.com>

---
#Set up an IRC Server Using InspIRCd

##Overview
Duration: 2:00

In this tutorial, you will learn now to install an Internet Relay Chat server onto your existing Ubuntu installation. This tutorial is recommended for users who are comfortable with using the terminal.

Over the course of this tutorial, we will install dependencies for InspIRCd, download the latest version from GitHub, install the program and learn how to run it.

###What you'll learn

* How to prepare your environment for the installation of InspIRCd
* How to install InspIRCd from GitHub
* How to Run InspIRCd
* How to Start your first InspIRCd Server

### What you'll need

* A computer running Ubuntu 14.04 Trusty Tahr or above
* The `git` command line client (can be installed using `sudo apt-get install git` in terminal)
* Updated apt packages `sudo apt-get update`

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

##Dependencies
Duration: 3:00

Before we begin, it is important to install the dependencies needed by InspIRCd.
We begin by updating our packages,
```markdown
sudo apt-get update
```
The first thing we should do is make sure git is installed, we can do so by entering
```markdown
sudo apt-get install git
```
Next we will install perl dependencies so we can run the configuration script included with InspIRCd.
```markdown
sudo apt-get install perl
sudo apt-get install g++
```
And finally we need to make sure that make is installed
```markdown
sudo apt-get install make
```
You are now ready to move on to the next step, Downloading the program!

##Downloading From Github
Duration: 3:00

To begin, we must choose the version we would like to install, this can be found at [InspIRCd's website](http://www.InspIRCd.org/). Here you will find the latest release name, at the time of writing this is V2.0.25. From this we can formulate the download path. The file must be retreived form GitHub, this can be done by:
```markdown
wget https://github.com/InspIRCd/archive/v2.0.25.tar.gz
```
* please note that you must replace the 2.0.25 with your version number

Now we must unpack this folder, to do so we enter into terminal:
```markdown
tar xvf ./v2.0.25.tar.gz
```
* please note that you must replace the 2.0.25 with your version number

Your program is now reday to configure, when ready click next.
##Configuring the installer
Duration: 5:00

Now it is time to configure the installation, here we can choose where to install all the files and any additional features. First we must enter the installation directory:
```markdown
cd inspircd-2.0.25
```
* please note that you must replace the 2.0.25 with your version number

To begin configuring the installation, we must enter the following command in our terminal:
```markdown
perl ./configure
```
Now a series of questions will be asked, if you are unsure defaults will work. Press enter whenever asked a question. The last question will ask,
```markdown
Would you like to check for updates to third-party modules?
```
For this you should type y and then press enter.

Now it is time to install the program using make.
##Make and Make Install
Duration: 15:00

Installation is done in two steps, first we must build the program into the directories, next we copy the built program to the correct location.

As you are already in the installation directory, you can simply type `make`. this process will take around 10 minutes so feel free to step away from the computer.

Next to copy the program, we type:
```markdown
make install
```
Now reboot your computer by typing `reboot`, make sure there are no other running programs.

Great! Now we have InspIRCd fully installed, we can continue to set up an IRC Server.
##Running the Server
Duration: 10:00

The first step is to create a configuration file for the program. To begin, navigate into your installation directory. If you used defaults back in Configuring the Insaller, you can now enter:
```markdown
cd inspircd-2.0.25
```
* please note that you must replace the 2.0.25 with your version number

Now we must enter the information required to start the server.
Copy and paste the following into an editor:
```markdown
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
Now we need to change some values.
* *SERVER_HOSTNAME/FQDN* --> Your server's hostname
* *SERVER_DESCRIPTION* --> Your server's description
* *SERVER_SID* --> Must be a unique sequence of 3 characters the first being a number. (make sure to capitalize)
* *NETWORK_NAME* --> The name of your network
* *ADNIN_NAME* --> The chat admin's name
* *ADMIN_NICK* --> The chat admin's nick
* *ADMIN_EMAIL* --> The chat admin's email
* *SERVER_IP* --> The server's public IP
* *SERVER_PORT* --> The server's port (usually 6697 works)
* *SERVER_TYPE* --> The clients or servers type. (cleints should be fine here)

The configuration file should look like this:
```markdown
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

To create and edit the configuration file type:
```markdown
nano run/config/inspircd.conf
```
Now paste your edited configuration file's contents

We're almost there!
##You're Done!
Duration: 2:00

Its now time to start up InspIRCd for the first time!
In your the terminal window you already have open, type:
```markdown
./inspircd start
./inspircd status
```
If you see a message that says InspIRCd is already running, your server is now online.

Changes to your web server are made to the config file, a list of supported commands and other useful information can be found at [InspIRCd's Wiki](https://wiki.InspIRCd.org/).

###You now know how to:
* Prepare an environment to install an IRC Server using InspIRCd
* Install InspIRCd using GitHub
* Configure InspIRCd using a `.conf` file
* Start the service

###What's Next?
* Modify your external internet connection to forward port 6697
* Ensure your network has a static IP address
* Get a URL to easily send traffic to your server (optional)

###I Need Help
* Double Check that the port is available
* Ensure the `.config` file is correct
* Make sure you typed the commands properly
* Try using sudo (if you arent already)
* Ask a question on [Ask Ubuntu](https://askubuntu.com/)
