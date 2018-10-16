---
id: gpu-data-processing-inside-lxd
summary: Accelerate data processing within LXD containers by enabling direct access to your NVIDIA GPU's CUDA engine.
categories: containers
tags: lxd, cuda, nvidia, gpu, big data, lxc
difficulty: 4
status: published
published: 2018-10-15
author: Graham Morrison <graham.morrison@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# GPU data processing inside LXD
## Overview
Duration: 3:00

Hugely parallelised GPU data processing, using either [CUDA][nvidiacuda] or [OpenCL][opencl], is changing the shape of data science.
It even has its own snappy acronym - GPGPU - General-purpose computing on graphics processing units.

It's no surprise, then, that flexible, scalable access to these GPU resources is becoming a key requirement
in many cloud deployments (see the Canonical Distribution of [Kubernetes][kubernetes] for a good example).
But it's not always easy, nor cheap, to get started. Unless you use [LXD][lxd].

![cuda-lxd-logos](https://assets.ubuntu.com/v1/8546712c-rect5436.png)

LXD's unrivalled density in real-world cloud deployments, and its ability to run locally,
make it a game-changing tool for experimenting with cloud-like GPU data processing.

It enables you to create local scalable deployments using nothing more than a PC with a GPU or two.
As we'll now demonstrate.

### What you'll learn
- How to replace default NVIDIA drivers with the latest ones
- How to install the CUDA toolkit
- How to configure LXD to use NVIDIA GPUs and CUDA

### What you'll need
Our configuration is going to be based on the following:
- 1 or more NVIDIA GPUs
- [Ubuntu 18.04 LTS][bionic] (Bionic Beaver)
- [LXD][getstarted] version 3.0 or higher

positive
: LXD versioning is incremental, which means version 3.1 is more recent than version 3.0.1.

We'll be using NVIDIA hardware alongside NVIDIA's proprietary CUDA, as these
currently constitute the most widely used GPGPU platform.

However, LXD's hardware passthrough enables any GPU to appear natively to any
deployment, which means that using different GPUs or drivers with OpenCL should
be possible.

As both NVIDIA's drivers and CUDA are constantly in a rapid state of development,
we're going to install and use the latest versions we can get hold of.
This will mean using packages separate from those supplied by the distribution,
which we'll cover in the next step.

## Remove NVIDIA drivers
Duration: 13:00

With either a new or old Ubuntu 18.04 installation, it's likely that you'll
have NVIDIA drivers of one sort or another on your system. We need to make sure
these are fully removed before attempting to install a new set.

When working with graphics drivers, it's best to quit from the *X.org*
graphical environment and work on the command line. This can be done by
entering the following into a terminal:

```bash
sudo systemctl isolate multi-user.target
```

To remove your current NVIDIA or open source Nouveau drivers, enter the following:

```bash
sudo apt remove --purge nvidia*
```

It's safer to reboot your machine at this point, although this isn't strictly necessary.

### Remove Nouveau drivers
The *nouveau* driver, installed by default when you elect not to add NVIDIA's
proprietary drivers, may refuse to remove itself. You can check with the
following command:

```bash
lsmod | grep nouveau
```

If the output includes the `nouveau` module, you will need to blacklist this
module to stop it loading in future. You can do this by adding the following to
`/etc/modprobe.d/blacklist.conf` as root with your favourite text editor:

```no-highlight
blacklist amd76x_edac #this might not be required for x86 32 bit users.
blacklist vga16fb
blacklist nouveau
blacklist rivafb
blacklist nvidiafb
blacklist rivatv
```

## Install proprietary NVIDIA drivers
Duration: 5:00

With LXD, the host machine handles the drivers and passes the resultant device
nodes to the container. But CUDA still expects a local driver installation, and
this means we need to have identical versions of both the drivers and CUDA
on the host and any LXD containers we deploy.

Thankfully LXD 3.0 has a way to keep the two in sync without requiring
installation of all the NVIDIA packages in both host and container.

You can now use `apt` to install the latest version of the drivers, for example:

```bash
apt install nvidia-390
```

You'll need to reboot your machine after installing the NVIDIA drivers, after
which you can use the `nvidia-smi` command to check that the driver is
installed and operating correctly.

The output will include details similar to the following:

```no-highlight
Thu May 25 13:32:33 2017
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 390.77                 Driver Version: 390.77                    |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 1080    Off  | 0000:01:00.0      On |                  N/A |
| 43%   52C    P8    18W / 240W |    981MiB /  8110MiB |      1%      Default |
+-------------------------------+----------------------+----------------------+
```

## Install the CUDA toolkit
Duration: 8:00

With the drivers installed, the next step is to grab CUDA itself.
While there are Ubuntu packages available, we've found the most reliable option is to
download the latest version of CUDA directly from NVIDIA's developer website:

[https://developer.nvidia.com/cuda-downloads](https://developer.nvidia.com/cuda-downloads)

To get to the download, select 'Linux', select your architecture, choose 'Ubuntu', '18.04'
and finally the 'deb (network)' installer type. You will then be able to download the base installer.
In our example, this file is called `cuda-repo-ubuntu1804_10.0.130-1_amd64.deb`.

This package then needs to be installed with:

```bash
sudo apt install ./cuda-repo-ubuntu1804_10.0.130-1_amd64.deb
sudo apt-key adv --fetch-keys http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
sudo apt update
sudo apt install cuda nvidia-cuda-toolkit
```

And then you'll need to reboot your system again as installing `cuda` will most
likely bring a different set of drivers for your system.

You can then check CUDA is installed correctly by running `/usr/local/cuda-10.0/bin/nvcc -V`,
which produces output similar to the following:

```no-highlight
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2018 NVIDIA Corporation
Built on Sat_Aug_25_21:08:01_CDT_2018
Cuda compilation tools, release 10.0, V10.0.130
```

Being correctly installed doesn't necessarily mean CUDA is correctly linked to the NVIDIA driver.
To make sure this is working, use the `bandwidthTest` utility from CUDA's demo\_suite folder,
usually found in '/usr/local/cuda-10.0/extras/demo\_suite/'.

If everything is working correctly, you should see `Result = PASS` at the end of the output.

## Launch LXD
Duration: 5:00

With the host now correctly configured and ready to go, it's time to launch LXD.

If this is the first time you've used LXD, see our [setting up tutorial][getstarted] for a few pointers.

In particular, you will need to have a network and a storage pool defined.
The `lxd init` command will step you through the process if you've not done this already.

You can then launch a fresh deployment of Ubuntu 18.04 with the following command:

```bash
lxc launch ubuntu:18.04 cuda -c nvidia.runtime=true
```

We've given this new instance the name of 'cuda'. If this is the first time
you've deployed an LXD instance with 'ubuntu:18.04', its image will be
retrieved as part of the creation process.

```
Creating cuda
Retrieving image: rootfs: 21% (5.98MB/s)
Starting cuda
```

The `nvidia.runtime=true` has LXD setup passthrough for the NVIDIA libraries,
driver utilities and CUDA library. This ensures the container and host always
run the same version of the NVIDIA drivers and greatly reduces the amount of
duplicated binaries between host and container.

## Add your GPU to the container
Duration: 1:00

Now let's make all GPUs available to the container with:

```bash
lxc config device add cuda gpu gpu
```

At which point you can run `nvidia-smi` inside your container with:

```bash
lxc exec cuda -- nvidia-smi
```

And should get an output matching that from before.

## Add CUDA to LXD
Duration: 10:00

The `nvidia.runtime` property in LXD exposes both the NVIDIA utilities like
`nvidia-smi` but also the various libraries needed to run CUDA binaries.

It however doesn't expose the compiler, C headers or any of the other bits of the CUDA SDK.

If you want to build CUDA code inside the container, you should follow the CUDA
installation instructions again, this time running them in the container.

## Test CUDA within LXD
Duration: 3:00

Whether you chose to install the CUDA SDK in the container or not, you should
be able to run CUDA binaries.

So let's transfer the `bandwidthTest` binary from earlier and run it inside the container.

```bash
lxc file push /usr/local/cuda-10.0/extras/demo_suite/bandwidthTest cuda/root/
lxc exec cuda -- /root/bandwidthTest
```

This should produce output like this:

```no-highlight
 Bandwidth Test] - Starting...
Running on...

 Device 0: GeForce GTX 1080
 Quick Mode

 Host to Device Bandwidth, 1 Device(s)
 PINNED Memory Transfers
   Transfer Size (Bytes)        Bandwidth(MB/s)
   33554432                     12845.8

 Device to Host Bandwidth, 1 Device(s)
 PINNED Memory Transfers
   Transfer Size (Bytes)        Bandwidth(MB/s)
   33554432                     12887.7

 Device to Device Bandwidth, 1 Device(s)
 PINNED Memory Transfers
   Transfer Size (Bytes)        Bandwidth(MB/s)
   33554432                     226363.4

Result = PASS

NOTE: The CUDA Samples are not meant for performance measurements. Results may
vary when GPU Boost is enabled.
```

If you see output similar to the above - congratulations!
You can now start using CUDA at scale with your LXD deployment.

## Further reading
Duration: 1:00

If you're looking for inspiration on how to take your CUDA and LXD configuration further,
we'd recommend starting with NVIDIA's [CUDA Toolkit Documentation][cudadocs] and the [LXD documentation][lxd].

If your requirements outgrow your local LXD deployment, take a look using [GPUs with Kubernetes][cudakuber]
for deep learning - a solution that uses some of Canonical's best technologies.

### Finding help
Finally, if you get stuck, the Ubuntu community is always willing to help, even when dealing with complex issues like CUDA.

* [Ask Ubuntu](https://askubuntu.com/)
* [Ubuntu Forums](https://ubuntuforums.org/)
* [IRC-based support](https://wiki.ubuntu.com/IRC/ChannelList)


<!-- LINKS -->
[lxd]: https://www.ubuntu.com/containers/lxd
[bionic]: http://releases.ubuntu.com/18.04/
[nvidiacuda]: http://www.nvidia.com/object/cuda_home_new.html
[opencl]: https://www.khronos.org/opencl/
[kubernetes]: https://insights.ubuntu.com/2017/04/12/general-availability-of-kubernetes-1-6-on-ubuntu/
[ppa]: https://launchpad.net/~graphics-drivers/+archive/ubuntu/ppa
[getstarted]: https://tutorials.ubuntu.com/tutorial/tutorial-setting-up-lxd-1604#0
[cudadocs]: http://docs.nvidia.com/cuda/
[cudakuber]: https://insights.ubuntu.com/2017/02/15/gpus-kubernetes-for-deep-learning%E2%80%8A-%E2%80%8Apart-13/
