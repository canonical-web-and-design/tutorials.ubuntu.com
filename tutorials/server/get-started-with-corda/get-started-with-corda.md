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
Duration: 1:00

Corda is a blockchain platform built for business. Corda removes costly friction in business transactions by enabling businesses to transact directly. Using smart contract and blockchain technology, Corda allows existing business networks to reduce transaction and record-keeping costs and to streamline business operations. 

Corda enables an interoperable, open network that empowers organisations to collaborate and transfer value directly with trust. Corda achieves this with complete privacy in a freely available open source software platform.


In this tutorial, we will cover all the steps needed to successfully run an example Corda Application.

## Environment setup 
Duration: 8:00

### Installing the Java Development Kit (JDK)

In order to install the Oracle Java JDK, you must add their repository to your system

* Open a terminal window, and add Oracle's PPA and update your package list

```
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update 
```
* Install the Oracle JDK 8

```
sudo apt-get install oracle-java8-installer
```
* Verify that the JDK was installed correctly by typing `java -version`. You should see `Java version "1.8.xxx"` (where xxx is the minor version number)

### Installing Git 

Git can be installed using apt with the command
```
sudo apt-get install git
``` 
* Verify that the Git was installed correctly by typing `git --version`. You should see a version number. 

### Installing IntelliJ 

To download IntelliJ from Jetbrains, navigate to [the download page](https://www.jetbrains.com/idea/download/#section=linux).
* Select Community Edition

Extract the .tar file 
* Open with archive manager 
* Extract the archive to desired installation location 

Install IntelliJ
* Open a terminal and navigate into the extracted directory  
* Follow the installation instructions contained in `Install-Linux-tar.txt`

**Now that our environment is set up, we can start working with Corda**

## Cloning example CorDapp 
Duration: 1:30

Distributed applications running on the Corda platform are known as CorDapps. In this step we will be installing an example CorDapp written by the Corda Team. It will demonstrate sending IOU contracts across a network of three nodes. 

Open a terminal and navigate to the directory where you wish to clone the example CorDapp
* To clone the Github repository, enter:

```
git clone https://github.com/corda/cordapp-example.git
```

**Navigate into the cloned directory - we can now run this CorDapp from the terminal**


## Running from terminal





## Running from IntelliJ

## Next steps
