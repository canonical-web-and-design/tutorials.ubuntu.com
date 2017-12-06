---
id: create-kvm-pods-with-maas
summary: Learn how to create KVM pods with MAAS. MAAS is an enterprise-grade infrastructure management tool.
categories: server
tags: maas, virtualization, pod, kvm, cloud
difficulty: 4
status: published
published: 2017-10-08
author: Canonical Web Team <webteam@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Create KVM pods with MAAS

## Overview
Duration: 0:02

MAAS enables you to treat physical servers like an elastic cloud-like resource.

### Building elastic test environments with MAAS pods

MAAS version 2.2 introduces “pods” as an operational concept. A MAAS pod describes the availability of resources and enables the creation (or composition) of a machine with a set of those resources. Each pod represents a pool of various available hardware resources, such as CPU, RAM, and (local or remote) storage capacity.

A user can allocate the needed resources manually (using the MAAS UI or CLI) or dynamically (using Juju or the MAAS API). That is, machines can be allocated "just in time", based on CPU, RAM, and storage constraints of a specific workload.

MAAS 2.2 supports two types of pods, (1) Physical systems with Intel RSD and (2) Virtual Machines with KVM (using the virsh interface). Since we want to explore how to better utilise existing hardware, let’s build a test environment with KVM pods.

### Requirements

A testbed environment would require a server running the latest Ubuntu Server LTS ([How to install Ubuntu Server](/tutorial/tutorial-install-ubuntu-server)), with at least:
- 4 CPU cores
- 16GB RAM
- 100GB free disk space, preferably SSD
- 2 NICs, one connected to an external network (possibly a DMZ) and the second NIC will be the internal network.
MAAS will act as an HTTP proxy and IP gateway between the two networks. MAAS will also provide DNS for all the VMs and servers/pods it will be managing, as well as DHCP. MAAS needs to be installed on only one server/pod and it will be managing all the other pods remotely. MAAS is very versatile. We are focusing here only on one out of many potential KVM pod scenarios.

## Getting started
Duration: 0:10

Start by installing the latest LTS version of Ubuntu Server (16.04.3), selecting only `OpenSSH server` from the `Software selection` menu. When the Ubuntu installation completed, you can connect to it through SSH.

Now, ensure the latest stable MAAS version is available, update the system and install the needed virtualization tools:

```bash
sudo add-apt-repository ppa:maas/stable -y  
sudo apt update
sudo apt upgrade -y
sudo apt install bridge-utils qemu-kvm libvirt-bin
```

## Networking configuration
Duration: 0:03

It’s now time to update the networking configuration: we need to add a new bridge and connect the second NIC (eth1) to it.

Edit `/etc/network/interfaces` to look like this:

```no-highlight
auto lo  
iface lo inet loopback  
	dns-nameservers 172.27.28.1  
	dns-search maas  

auto eth0  
iface eth0 inet static  
	gateway 172.27.28.1  
	dns-nameservers 172.27.28.1  
	address 172.27.28.172/23  
	mtu 1500  

auto eth1  
iface eth1 inet manual  
	mtu 1500  

auto br1  
iface br1 inet static  
	address 192.168.30.1  
	netmask 255.255.255.0  
	bridge_ports eth1  
	bridge_stp off  
	bridge_fd 0  
	bridge_maxwait 0
```

Bring up the newly created bridge, before we move on to configure virsh.

## Virsh configuration
Duration: 0:02

Libvirt creates a `default` DHCP enabled network for guests upon installation with you can see by running `sudo virsh net-list`:

```bash
Name	State	Autostart	Persistent  
----------------------------------------------------------  
default	active	yes	yes  
```

Since we don't need it, let's delete it by running:

```
sudo virsh net-destroy default  
sudo virsh net-undefine default
```

Instead, we will be using bridged networking with our existing bridge (`br1`) created during the previous step, along with the necessary minimal configuration.

To do so, create a `net-default.xml` file with the following content:

```no-highlight
<network>  
	<name>default</name>  
	<forward mode="bridge" />  
	<bridge name="br1" />  
</network>
```

Then, add it to virsh:

```bash
virsh net-define net-default.xml
virsh net-autostart default  
virsh net-start default
```

Next, create a storage pool for the VMs. By default, none are defined, so let’s confirm and configure a directory-based pool:

```bash
virsh pool-define-as default dir - - - - "/var/lib/libvirt/images"  
virsh pool-autostart default  
virsh pool-start default
```

## Routing configuration
Duration: 0:02

We will enable NATing and routing on our MAAS pod only, and all the other pods will be using MAAS as a gateway.

```bash
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  
sudo iptables -A FORWARD -i eth0 -o br1 -m state \
    --state RELATED,ESTABLISHED -j ACCEPT  
sudo iptables -A FORWARD -i br1 -o eth0 -j ACCEPT  
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf  
sudo sysctl -p
```

The iptables rules here are not persistent, consider using UFW (Uncomplicated Firewall) for persistency, but for now, let’s move on and install MAAS.

## MAAS installation
Duration: 0:07

The pods environment we are targeting here (<10 pods) can be accommodated with a co-located region and rack controller for MAAS, so the installation process is very simple:

```bash
sudo apt install maas -y
```

When the installation is complete, the MAAS UI will become available, but we won’t be able to log in until we create the first administrator “admin” user:

```
sudo maas createadmin
```

Then, configure it as follow:

```
Username: admin  
Password:  
Again:  
Email: admin@localhost.local  
Import SSH keys [] (lp:user-id or gh:user-id):
```

You can now use these credentials to access the MAAS UI at http://172.27.28.172/MAAS/ where you will be prompted with some basic setup questions.

![screenshot](https://assets.ubuntu.com/v1/a15faa51-maas23-login.png)


## MAAS configuration
Duration: 0:05

Follow the configuration steps and provide the "Region name", "Connectivity" details (setting MAAS as the Default Gateway) and select the OS sources for MAAS to import (the default Ubuntu LTS for amd64 is sufficient for the vast majority of cases).

Next, import the SSH keys for "admin".

Positive
: Importing the SSH keys for your user is a very important step as the machines we will be deploying use public key authentication by default.

If you visit the "Nodes" tab, you should see the warning: "DHCP is not enabled on any VLAN. This will prevent machines from being able to PXE boot, unless an external DHCP server is being used." Let's fix that:  

On the "Subnets" tab, select `192.168.30.0/24`, and at the "Reserved" section create a dynamic range starting at `192.168.30.33` and ending at `192.168.30.127`.  

Return to the "Subnets" tab, select the "untagged" VLAN next to the `192.168.30.0/24` subnet and from the "Take action" drop down menu on the top right, choose "Provide DHCP". Confirm that the autodetected info is correct ("Rack controller" name, "Gateway IP" and "Subnet") and accept the configuration.  

If we visit again the "Nodes" tab, the warning must have vanished.

## Pod configuration
Duration: 0:05

For MAAS to query and manage machines as pods, both remotely and the local host, we will be using secure communication for libvirt over SSH.

First, we need to enable a login shell for the ‘maas’ user and generate an SSH keypair (with a null passphrase) for the user:  

```  
sudo chsh -s /bin/bash maas  
sudo su - maas  
ssh-keygen -f ~/.ssh/id\_rsa -N ''  
logout  
sudo cat ~maas/.ssh/id\_rsa.pub | tee -a ~/.ssh/authorized_keys
```

With the keys in place, let’s test our connection to the local hypervisor:

```
sudo -H -u maas \
    bash -c 'virsh -c qemu+ssh://ubuntu@192.168.30.1/system list --all'
```

The last command should return successfully an empty list of VMs, since we haven’t instantiated any yet.

Now, let's go back to the MAAS UI to add the local machine as a pod:

Select the “Pod” tab, and click “Add Pod” on the top right corner. Provide the requested info:
- Name: **MAAS Pod**  
- Pod type: **Virsh (virtual systems)**
- Virsh address: **qemu+ssh://ubuntu@192.168.30.1/system**

In a few moments “MAAS Pod” will show up in the pods list, along with information on the available local storage capacity, iSCSI storage, CPU cores, RAM and Composed machines, which should be 0.

![screenshot](https://assets.ubuntu.com/v1/26ceb595-maas-22-pod.png)

## Compose a VM
Duration: 0:01

Let’s compose a VM, by clicking on the “MAAS Pod” and select “Compose” from the “Take action” drop down menu on the top right.

You will be prompted to provide a Hostname, CPU cores, speed, RAM as well as storage capacity and devices. Even if you don’t provide any of the information, by default a VM with 1 core, 1GB RAM, and 8GB of storage will be created and a random name will be assigned to it as soon as you hit the “Compose machine” button.

Moreover, MAAS will automatically commission and then you can deploy Ubuntu (or any other OS) on the new VM. You can connect through SSH into your freshly installed Ubuntu using the public key we generated during the maas installation process and username “ubuntu” and start testing your applications!

## Next steps and finding help
Duration: 0:01

MAAS has been designed to be a modern, agile machine provisioning solution, enabling both physical and virtual infrastructure. MAAS can optimize the utilisation of existing small to medium scale IT infrastructure using VM pods. We have quickly transformed a single physical server into a lightweight, reliable virtual machine management node. The pod abstraction is very powerful and flexible, and if you need help as you are using it reach out to:

-   [Ask Ubuntu](https://askubuntu.com/)
-   [Ubuntu Forums](https://ubuntuforums.org/)
-   [IRC-based support](https://wiki.ubuntu.com/IRC/ChannelList)

### Reference literature:

- [MAAS website](https://maas.io/)
- [Intel RSD documentation](https://docs.ubuntu.com/maas/2.2/en/nodes-power-types#bmc-driver-support)
- [Tutorial: Install Ubuntu Server](https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-server#0)
- [How to configure network bridges](https://help.ubuntu.com/community/NetworkConnectionBridge)
- [How to configure virsh](https://help.ubuntu.com/lts/serverguide/libvirt.html)
- [NAT configuration with ufw](https://help.ubuntu.com/lts/serverguide/firewall.html#ip-masquerading)
