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
Duration: 5:00
In the same terminal, run the deploy nodes command 
* To run the deploy node command, enter:

```
./gradlew deployNodes
```
Wait while the nodes are being configured.

To start up the node network, enter the following command:
```
kotlin-source/build/nodes/runnodes
```
negative
: **Warning** 
If this command fails with error message `Exception in thread "main" java.io.IOException: Cannot run program "xterm"` you will need to install the xterm terminal. This can be done using apt, with the command 
```
sudo apt-get install xterm
```
Now, rerun the `runnodes` command. 

Wait while seven additional terminal windows open. The start up process is finished when all the terminal windows display either “Webserver started up in XX.X sec” or “Node for “PartyX” started up and registered in XX.XX sec”. 

Test that the CorDapp is running correctly by visiting PartyA's web frontend at <http://localhost:10009/web/example/>
* From this frontend you can create IOUs and send them to other parties. 

## Running from IntelliJ
### Setting up the project 
To start IntelliJ, open a terminal and navigate to the extracted install location.
* Run the command: 
```
bin/idea.sh
```
From the IntelliJ splash screen, click open and navigate to the directory where the CorDapp was cloned. Click `OK`. 
Once the project is open click `File`, then `Project Structure` 

Under `Project SDK` click `New`, then `JDK`. Select the location of the Oracle JDK. The default installation location is `/usr/lib/jvm/java-8-oracle` 
Click `OK`

Back in the project structure menu, click `Apply`. Select `Modules` from the left hand navigation pane. 
Click the green plus button and select `Import Module`. The CorDapp installation location should be selected by default. If not, navigate to it and click `OK`. 
Select `Import module from external module`, choosing Gradle and clicking `Next`. 
Click `Finish`, leaving default settings. 

Wait while Gradle builds and indexes the project. 

### Running the project 
Once indexing is finished, at the top-right of the screen, to the left of the green play arrow, click the dropdown and select `Run Example Cordapp - Kotlin`. Then click the green play arrow to start the network of nodes.

Wait until the run windows displays the message `Webserver started up in XX.X sec`. 

Test that the CorDapp is running correctly by visiting PartyA's web frontend at <http://localhost:10009/web/example/>
* From this frontend, you can create IOUs and send them to other parties (as when running from terminal).  


## Next steps
To learn more about Corda, or get support, check out the following resources: 

### Corda source code
The Corda platform source code is available here:

https://github.com/corda/corda.git
A CorDapp template that you can use as the basis for your own CorDapps is available in both Java and Kotlin versions:

https://github.com/corda/cordapp-template-java.git

https://github.com/corda/cordapp-template-kotlin.git

And a list of simple sample CorDapps for you to explore basic concepts is available here:

https://www.corda.net/samples/
You can clone these repos to your local machine by running the command git clone [repo URL].

### Next steps
The best way to check that everything is working fine is by taking a deeper look at the example CorDapp.

Next, you should read through Corda Key Concepts to understand how Corda works.

By then, you’ll be ready to start writing your own CorDapps. Learn how to do this in the Hello, World tutorial. You may want to refer to the API documentation, the flow cookbook and the samples along the way.

### Support
If you encounter any issues, please see the Troubleshooting page, or ask on Stack Overflow or via our Slack channels.
