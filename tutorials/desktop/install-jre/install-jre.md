---
id: install-jre
summary: Installation of Java Runtime Environment (JRE) on Ubuntu
categories: desktop
tags: tutorial,installation,ubuntu,desktop,java,jre, gci, hidden
difficulty: 1
status: published
published: 2017-12-02
author: Aden Padilla <adenpadilla@gmail.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Install Java Runtime Environment (JRE)

## Overview
Duration: 1:00

The Java Runtime Environment (JRE) is required to run Java programs. While there are multiple JRE variants available, the two most popular ones on Ubuntu are OpenJRE and Oracle JRE. Using one over the other should not create any functional difference in most applications, however, some prefer OpenJRE over Oracle JRE as it doesn't contain closed-source components and is maintained as part of the Ubuntu archive, with easier installation and upgrades.

In this guide, we'll be going through the installation of both of them. Of course, you generally only need to pick the one that best suits your needs.

### What you'll learn
- How to install OpenJRE
- How to install Oracle JRE

### What you'll need
- A machine running Ubuntu 16.04 LTS

That's all you need. If you have that, let's proceed to the next step!


## Installing OpenJRE
Duration: 1:00

To install OpenJRE, we run:
```bash
sudo apt install openjdk-8-jre
```

We can check if OpenJRE was properly installed by running:
```bash
java -version
```

It should output the following:
```bash
openjdk version "1.8.0_151"
OpenJDK Runtime Environment (build 1.8.0_151-8u151-b12-0ubuntu0.16.04.2-b12)
OpenJDK 64-Bit Server VM (build 25.151-b12, mixed mode)

```
And that's it!

In the next step we'll install Oracle JRE.

## Installing Oracle JRE
Duration: 3:00

### Downloading JRE Binaries

Download JRE binaries in *.tar.gz (tarball)* by heading over to [their website](http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html).

### Installing

Create a directory to install JRE in with:
```bash
sudo mkdir /usr/local/java
```

Move the JRE binaries into the directory:
```bash
sudo mv jre-8u151-linux-x64.tar.gz /usr/local/java
```

Go into the install directory:
```bash
cd /usr/local/java
```

Unpack the tarball:
```bash
sudo tar zxvf jre-8u151-linux-x64.tar.gz
```

### Post-installation steps

To save space, delete the tarball by running:
```bash
sudo rm jre-8u151-linux-x64.tar.gz
```

Let the system know where JRE is installed:
```bash
sudo update-alternatives --install "/usr/bin/java" "java" "/usr/local/java/jre1.8.0_151/bin/java" 1
```

After that's done, check the installation by running:
```bash
java -version
```
It should output the following:
```bash
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)
```


### Need further assistance?
- [Java Help Center](https://java.com/en/download/help/)
