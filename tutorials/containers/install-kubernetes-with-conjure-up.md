---
id: install-kubernetes-with-conjure-up
summary: This tutorial will guide you through the installation of the Canonical Distribution of Kubernetes with a few simple commands using conjure-up.
categories: containers
status: published
tags: kubernetes, conjure-up
difficulty: 2
published: 2017-08-21
author: Karl Williams <karl.williams@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---


# Install Kubernetes with conjure-up


## Overview
Duration: 1

This tutorial will guide you through the installation of the Canonical Distribution of Kubernetes®* with a few simple commands using conjure-up.

### The Canonical Distribution of Kubernetes®

In partnership with Google, Canonical now delivers a ‘pure K8s’ experience, tested across a wide range of clouds and integrated with modern metrics and monitoring.

The Canonical Distribution of Kubernetes works across all major public clouds and private infrastructure, enabling your teams to operate Kubernetes clusters on demand, anywhere.

### conjure-up

conjure-up lets you easily deploy and configure complex big-software solutions on public clouds, private clouds and developer laptops.

### What you’ll learn
  - How to install software using a conjure-up spell
  - The simplest way to install The Canonical Distribution of Kubernetes

### What you’ll need

A Linux system with [snapd installed](https://snapcraft.io/docs/core/install)

#### For cloud deployment
Account credentials for one of the following public cloud providers:
  - AWS
  - Azure
  - CloudSigma
  - Google
  - Joyent

#### For local deployment

Although this tutorial will assume a public cloud installation, if you wish to install locally the following minimum specifications are recommended:
 - 2 cores
 - 16G RAM
 - 32G Swap
 - 250G SSD with a separate block device for ZFS. Our recommendation for that device is 100G.

positive
: Note: ZFS is recommended, but not required.

_* Kubernetes® is a registered trademark of The Linux Foundation in the United States and other countries, and is used pursuant to a license from The Linux Foundation_

## Getting started
Duration: 5

If you have not done so on your local machine, install conjure-up.

On a Linux system with snapd, we simply type the following:

```bash
sudo snap install conjure-up --classic
```

positive
: Note: If you need to install snapd on your Linux system, detailed instructions can be found in the [snapcraft.io documentation](https://snapcraft.io/docs/core/install).

Now that we've installed conjure-up, let's run it:

```bash
conjure-up
```

Next we see a list of recommended spells. From this list, select "The Canonical Distribution of Kubernetes" and press enter.

![IMAGE](https://assets.ubuntu.com/v1/042c1dd7-select-canonical-distribution-of-kubernetes.png)

## Select your cloud
Duration: 3

conjure-up will then ask where we would like to deploy the applications.

For this tutorial we're going to demonstrate installation on a public cloud using Amazon AWS.

Although each cloud provider will differ slightly, the required configuration steps will generally include choosing a region and providing credentials.

![IMAGE](https://assets.ubuntu.com/v1/43eb777a-Screenshot+from+2017-08-18+11-57-29.png)


## Deploy the controller and applications
Duration: 13

Now that we have configured our cloud provider, we're presented with a screen titled "CHOOSE A CONTROLLER OR CREATE NEW".

For the purposes of this tutorial we'll start from scratch and select "Deploy New Self-Hosted Controller".

![IMAGE](https://assets.ubuntu.com/v1/ed7970a6-new-controller.png)

We will now see a list of the applications required for a Kubernetes installation. Each application can be configured individually, but for now, let's select "Deploy all remaining applications" to use the suggested default configuration.

![IMAGE](https://assets.ubuntu.com/v1/73946c3f-deploy-all.png)

You'll see verbose output as machines are automatically provisioned and the Kubernetes cluster components are installed and configured.

![IMAGE](https://assets.ubuntu.com/v1/1e9223dc-machine-status.png)

## Additional configuration
Duration: 3

You will be asked if you want to download and install [kubectl](https://kubernetes.io/docs/user-guide/kubectl-overview/) and [kubefed](https://kubernetes.io/docs/admin/kubefed/) on your local machine. These are command line utilities for interacting with your new Kubernetes cluster.

Check the box to install the applications and enter your sudo password when prompted.

![image](https://assets.ubuntu.com/v1/430ae051-sudo-install.png)

## That’s all folks!

Congratulations, you have installed and configured a cluster running the Canonical Distribution of Kubernetes.

### Next steps

Now that you have your cluster, you can put it to work:

* [The easy way to commoditise GPUs for Kubernetes][kubegpu]
* [Build a transcoding platform in minutes][kubetransform]
* [Transform your solution into a private PaaS][kubepaas]

### Further reading

* Learn more about the [Canonical Distribution of Kubernetes][canonicalkubernetes] bundle
* Discover [Kubernetes][cankube]
* Get involved and connect with the [Kubernetes community][kubecommunity]

[kubegpu]: https://medium.com/intuitionmachine/how-we-commoditized-gpus-for-kubernetes-7131f3e9231f
[kubetransform]: https://insights.ubuntu.com/2017/03/27/job-concurrency-in-kubernetes-lxd-cpu-pinning-to-the-rescue/
[kubepaas]: https://github.com/deis/workflow
[canonicalkubernetes]: https://jujucharms.com/canonical-kubernetes
[cankube]: https://jujucharms.com/kubernetes  
[kubecommunity]: https://kubernetes.io/community/
