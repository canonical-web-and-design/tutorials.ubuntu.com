---
id: gpu-data-processing-inside-lxd
summary: Accelerate data processing within LXD containers by enabling direct access to your Nvidia GPU's CUDA engine.
categories: containers
tags: lxd, cuda, nvidia, gpu, big data, lxc
difficulty: 4
status: published
published: 2017-07-12
author: Graham Morrison <graham.morrison@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# GPU data processing inside LXD

## Overview
Duration: 3:00

Hugely parallelised GPU data processing, using either [CUDA][nvidiacuda] or [OpenCL][opencl], is changing the shape of data science. It even has its own snappy acronym - GPGPU - General-purpose computing on graphics processing units.  It's no surprise, then, that flexible, scalable access to these GPU resources is becoming a key requirement in many cloud deployments (see the Canonical Distribution of [Kubernetes][kubernetes] for a good example). But it's not always easy, nor cheap, to get started. Unless you use [LXD][lxd].

![cuda-lxd-logos](https://assets.ubuntu.com/v1/8546712c-rect5436.png)

LXD's unrivalled density in real-world cloud deployments, and its ability to run locally, make it a game-changing tool for experimenting with cloud-like GPU data processing. It enables you to create local scalable deployments using nothing more than a PC with a GPU or two. As we'll now demonstrate.

### What you'll learn

- How to replace default Nvidia drivers with the latest ones
- How to install the CUDA toolkit
- How to configure LXD to use Nvidia GPUs and CUDA

### What you'll need

Our configuration is going to be based on the following:
- 1 or more Nvidia GPUs
- [Ubuntu 16.04 LTS][xenial] (Xenial)
- [LXD](https://tutorials.ubuntu.com/tutorial/tutorial-setting-up-lxd-1604) version 2.5 or higher (2.13 is the current Xenial version)

positive
: LXD versioning is incremental, which means version 2.13 is more recent than version 2.5.

We'll be using Nvidia hardware alongside Nvidia's proprietary CUDA, as these currently constitute the most widely used GPGPU platform.

However, LXD's hardware passthrough enables any GPU to appear natively to any deployment, which means that using different GPUs or drivers with OpenCL should be possible.

As both Nvidia's drivers and CUDA are constantly in a rapid state of development, we're going to install and use the latest versions we can get hold of. This will mean using packages separate from those supplied by the distribution, which we'll cover in the next step.

## Remove Nvidia drivers
Duration: 13:00

With either a new or old Ubuntu 16.04 installation, it's likely that you'll have Nvidia drivers of one sort or another on your system. We need to make sure these are fully removed before attempting to install a new set.

When working with graphics drivers, it's best to quit from the *X.org* graphical environment and work on the command line. This can be done by entering the following into a terminal:

```bash
sudo systemctl isolate multi-user.target
```

To remove your current Nvidia or open source Nouveau drivers, enter the following:

```bash
sudo apt remove --purge nvidia*
```

It's safer to reboot your machine at this point, although this isn't strictly necessary.

### Remove Nouveau drivers

The *nouveau* driver, installed by default when you elect not to add Nvidia's proprietary drivers, may refuse to remove itself. You can check with the following command:

```bash
lsmod | grep nouveau
```

If the output includes the `nouveau` module, you will need to blacklist this module to stop it loading in future. You can do this by adding the following to `/etc/modprobe.d/blacklist.conf` as root with your favourite text editor:

```no-highlight
blacklist amd76x_edac #this might not be required for x86 32 bit users.
blacklist vga16fb
blacklist nouveau
blacklist rivafb
blacklist nvidiafb
blacklist rivatv
```

## Install proprietary Nvidia drivers
Duration: 5:00

With LXD, the host machine handles the drivers and passes the resultant device nodes to the container. But CUDA still expects a local driver installation, and this means we need to install identical versions of both the drivers and CUDA on the host and any LXD containers we deploy.

For this reason, we've opted to use a PPA ([https://launchpad.net/~graphics-drivers/+archive/ubuntu/ppa][ppa]) for the drivers. This simplifies installation across both the host and any container instances you deploy. The alternative is to manually build the drivers directly from Nvidia's website, but this takes more effort and is harder to maintain across multiple deployments.

To add the PPA and update your local package database, enter the following:

```bash
sudo add-apt-repository --update ppa:graphics-drivers/ppa
```

You can now use `apt` to install the latest version of the drivers, for example:

```bash
apt install nvidia-381
```

positive
: Take a look at the PPA, or use `apt search nvidia`, to find the version number of the latest drivers.

You'll need to reboot your machine after installing the Nvidia drivers, after which you can use the `nvidia-smi` command to check that the driver is installed and operating correctly. The output will include details similar to the following:

```no-highlight
Thu May 25 13:32:33 2017
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 381.22                 Driver Version: 381.22                    |
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

With the drivers installed, the next step is to grab CUDA itself. While there are Ubuntu packages available, we've found the most reliable option is to download the latest version of CUDA directly from Nvidia's developer website:

[https://developer.nvidia.com/cuda-downloads](https://developer.nvidia.com/cuda-downloads)

To get to the download, select 'Linux', select your architecture, choose 'Ubuntu', '16.04' and finally the 'runfile (local)' installer type. You will then be able to download the base installer. In our example, this file is called `cuda_8.0.61_375.26_linux.run`.

This file will need to be made executable and run with administrator privileges:

```bash
chmod +x cuda_8.0.61_375.26_linux.run
sudo ./cuda_8.0.61_375.26_linux.run
```

The installer will ask a few questions.

Accept the licence but answer `n` when asked whether you want to install the Nvidia accelerated driver. This is because the installer typically bundles an older version of the driver, such as 375.26 with our example, and you don't want this installed on-top of the driver we already have. All further questions can be answered `y` to accept their default values.

To add CUDA to your path, add the following to your bash configuration file, eg. `~/.bashrc`, and either re-source the file or log out and back in again:

```bash
export PATH=/usr/local/cuda-8.0/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda-8.0/lib64:$LD_LIBRARY_PATH
```

Alternatively, add `/usr/local/cuda-8.0/lib64` to `/etc/ld.so.conf` and run 'sudo ldconfig'.

You can check CUDA is installed correctly by running `nvcc -V`, which produces output similar to the following:

```no-highlight
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2016 NVIDIA Corporation
Built on Tue_Jan_10_13:22:03_CST_2017
Cuda compilation tools, release 8.0, V8.0.61
```

Being correctly installed doesn't necessarily mean CUDA is correctly linked to the Nvidia driver. To make sure this is working, use the `bandwidthTest` utility from CUDA's demo_suite folder, usually found in '/usr/local/cuda-8.0/extras/demo_suite/'.

If everything is working correctly, you should see `Result = PASS` at the end of the output.

## Launch LXD
Duration: 5:00

With the host now correctly configured and ready to go, it's time to launch LXD.

If this is the first time you've used LXD, see our [setting up tutorial][getstarted] for a few pointers.

In particular, you will need to have a network and a storage pool defined. The `lxd init` command will step you through the process if you've not done this already.

You can then launch a fresh deployment of Ubuntu 16.04 with the following command:

```bash
lxc launch ubuntu:16.04 cuda
```

We've given this new instance the name of 'cuda'. If this is the first time you've deployed an LXD instance with 'ubuntu:16.04', its image will be retrieved as part of the creation process.

```
Creating cuda
Retrieving image: rootfs: 21% (5.98MB/s)
Starting cuda
```

Our 'cuda' instance is now running!

## Add drivers to LXD
Duration: 5:00

We're now going install CUDA onto our LXD instance and configure it to talk to our Nvidia hardware.

There are two ways of easily executing commands on the instance. The first is to launch bash as root on the container and run commands directly:

```bash
lxc exec cuda -- /bin/bash
```

The second is to run each command using the `lxc exec cuda -- new-command` syntax. We're going to opt for the former.

We now need to go through the same series of steps to install the drivers and CUDA in LXD as we did for the host machine. This is because CUDA needs the drivers and the drivers within LXD need to correlate with those of the host.

Let's start with the Nvidia driver:

```bash
sudo add-apt-repository --update ppa:graphics-drivers/ppa
sudo apt install nvidia-381
```

After the above driver installation has completed, you may notice that you can't check the driver in the same way we did earlier. The output from running `nvidia-smi`, for example, will show a failure to communicate with the driver:


```bash
NVIDIA-SMI has failed because it could not communicate with the NVIDIA driver.
Make sure that the latest NVIDIA driver is installed and running.
```

For this to work, we need to push our Nvidia hardware from the host environment into LXD.

This can be done with the following command:

```bash
lxc config device add cuda gpu gpu id=0
```

Omitting `id-0` from the end of this command will allow LXD to access all GPUs, rather than the one with the first id.

Running `nvidia-smi` within the LXD environment should now produce the same output we retrieved from the host environment, showing that your Nvidia hardware is now correctly configured for use within LXD.  

## Add CUDA to LXD
Duration: 5:00

With the proprietary Nvidia drivers installed on both the host and LXD, and with LXD seeing the Nvidia hardware, we now need to step through the same CUDA install process we did for the host machine:

You can avoid the download step by using SFTP to copy the CUDA installer to the LXD instance:

```bash
sftp username@192.168.1.124:/path/to/cuda_8.0.61_375.26_linux.run .
```

Now install CUDA and answer the same installation questions from earlier:

```bash
chmod +x cuda_8.0.61_375.26_linux.run
sudo ./cuda_8.0.61_375.26_linux.run
```

Don't forget to make sure the CUDA libraries and binaries are in your path.

## Test CUDA within LXD
Duration: 3:00

With everything installed and configured, it's now time to test CUDA from within LXD.

Running `bandwidthTest`, for example should produce output like this:

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

If you see output similar to the above - congratulations! You can now start using CUDA at scale with your LXD deployment.

## Further reading
Duration: 1:00

If you're looking for inspiration on how to take your CUDA and LXD configuration further, we'd recommend starting with Nvidia's [CUDA Toolkit Documentation][cudadocs] and the [LXD documentation][lxd].

If your requirements outgrow your local LXD deployment, take a look using [GPUs with Kubernetes][cudakuber] for deep learning - a solution that uses some of Canonical's best technologies.

### Finding help

Finally, if you get stuck, the Ubuntu community is always willing to help, even when dealing with complex issues like CUDA.

* [Ask Ubuntu](https://askubuntu.com/)
* [Ubuntu Forums](https://ubuntuforums.org/)
* [IRC-based support](https://wiki.ubuntu.com/IRC/ChannelList)


<!-- LINKS -->
[lxd]: https://www.ubuntu.com/containers/lxd
[xenial]: http://releases.ubuntu.com/16.04/
[nvidiacuda]: http://www.nvidia.com/object/cuda_home_new.html
[opencl]: https://www.khronos.org/opencl/
[kubernetes]: https://insights.ubuntu.com/2017/04/12/general-availability-of-kubernetes-1-6-on-ubuntu/
[ppa]: https://launchpad.net/~graphics-drivers/+archive/ubuntu/ppa
[getstarted]: https://tutorials.ubuntu.com/tutorial/tutorial-setting-up-lxd-1604#0
[cudadocs]: http://docs.nvidia.com/cuda/
[cudakuber]: https://insights.ubuntu.com/2017/02/15/gpus-kubernetes-for-deep-learning%E2%80%8A-%E2%80%8Apart-13/
