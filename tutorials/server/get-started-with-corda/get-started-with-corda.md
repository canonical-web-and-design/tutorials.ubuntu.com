---
id: get-started-with-Corda
summary: Learn how to get started with Corda
categories: server
tags: corda, blockchain, opensource
difficulty: 2
status: draft
image: https://foo.png
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2018-06-21
author: R3 Education Team <education@r3.com>

---

# Get started with Corda

## Overview

## Environment setup 

### Installing the Java Development Kit (JDK)

In order to install the official Oracle Java JDK, you must add thier repository to your system 
* To do this open up a terminal, and add Oracle's PPA and update your package list
``` 
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update 
```
* Install the Oracle JDK 8

```
sudo apt-get install oracle-java8-installer
```
* Verify that the JDK was installed correctly by typing `java -version` , you should see `Java version "1.8.xxx"` (where xxx is the minor version number)

### Installing Git 

Git can be installed from the default repositories using the command 

```
sudo apt-get install git
``` 
* Verify that the Git was installed correctly by typing `git --version` , you should see a version number. 

### Installing IntelliJ 

To download IntelliJ open [the JetBrains download page](https://www.jetbrains.com/idea/download/#section=linux) in a browser 
* download the Community edition 

Extract the .tar file 
* open with archive manager 
* extract the archive to desired installation location 

Open a Terminal and Naviagate to the Installation Location 
* Follow the installation instructions contained in `Install-Linux-tar.txt` file 

postive 
: Now that our environment is set up, we can start working with Corda 

## Cloning example CorDapp 
The applications that run on Corda are CorDapps. In this step we will be installing an example CorDapp provided by the Corda Team. It will allow for sending simple IOU contracts across a network of three nodes. 

* Open a terminal and navigate to the directory where you wish to clone the example CorDapp
* To clone the Git repository, enter:
```
git clone https://github.com/corda/cordapp-example.git
```

* Navigate into the directory...


## Running from terminal





## Running from IntelliJ

## Next steps
