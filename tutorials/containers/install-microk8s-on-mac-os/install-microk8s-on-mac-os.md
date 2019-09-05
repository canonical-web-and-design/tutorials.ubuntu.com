---
id: install-microk8s-on-mac-os
summary: Get a local Kubernetes on MacOS with Microk8s and Multipass.
categories: containers
tags: kubernetes, beginner, multipass, container, microk8s
difficulty: 3
status: draft
published: 2019-09-06
author: Ammar Naqvi <ammar.naqvi@canonical.com>, Konstantinos Tsakalozos <kos.tsakalozos@canonical.com>
feedback_url: https://github.com/ubuntu/microk8s/issues/

---

# Install MicroK8s on a Mac using Multipass

## Overview

### What is Kubernetes

[Kubernetes][kubernetes] clusters host containerised applications in a reliable and scalable way. Having DevOps in mind, Kubernetes makes maintenance tasks such as upgrades dead simple.


### What is MicroK8s

[MicroK8s][microk8s] is a [CNCF certified][cncf-cert] upstream Kubernetes deployment that runs entirely on your workstation or edge device. Being a [snap][snap] it runs all Kubernetes services natively (i.e. no virtual machines) while packing the entire set of libraries and binaries needed. Installation is limited by how fast you can download a couple of hundred megabytes and the removal of MicroK8s leaves nothing behind.


### What is Multipass

[Multipass][multipass] is a lightweight VM manager for Linux, Windows and macOS. It's designed for developers who want a fresh Ubuntu environment with a single command. It uses KVM on Linux, Hyper-V on Windows and HyperKit on macOS to run the VM with minimal overhead. It can also use VirtualBox on Windows and macOS. Multipass will fetch images for you and keep them up to date.

### In this tutorial you’ll learn how to...

- Setting up Multipass on MacOS
- Setting up MicroK8s on your Multipass VM
- Enabling MicroK8s add-ons in Multipass

### You will only need ...

* A machine with Mac OS with at least 8GB of RAM
* Multipass installed on your Mac, you can download the latest package on [GitHub][multipass-releases]



## Spinning up a VM with MicroK8s
Duration: 5:00

To install MicroK8s from the command line, use the following commands (make sure you have Multipass installed):

```bash
multipass launch --name microk8s-vm --mem 4G --disk 40G
```

```bash
multipass exec microk8s-vm -- sudo snap install microk8s --classic
```

```bash
multipass exec microk8s-vm -- sudo iptables -P FORWARD ACCEPT
```

positive
: Make sure you reserve enough resources to host your deployments; above, we got 4GB of RAM and 40GB of hard disk. We also make sure packets to/from the pod network interface can be forwarded to/from the default interface.

The VM has an IP address that you can check with the command:

```bash
multipass list
Name                    State             IPv4             Release
microk8s-vm             RUNNING           10.72.145.216    Ubuntu 18.04 LTS
```

The services once enabled will be available at the IP address shown in your console.

Before we move on, a few quick handy commands:

Create a shell inside the VM

```bash
multipass shell microk8s-vm
```

Shutdown the VM

```bash
multipass stop microk8s-vm
```

Delete the VM and cleanup

```bash
multipass delete microk8s-vm 
```
```bash
multipass purge 
```

## Using MicroK8s
Duration: 2:00

Open a shell in Multipass with a MicroK8s VM
```bash
multipass shell microk8s-vm
```
To execute a command without getting a shell, you can use multipass exec as in the example below:
```
multipass exec microk8s-vm -- /snap/bin/microk8s.status
```
This will show us the status of our MicroK8s deployment and components. 

## Testing Add-ons
Duration: 6:00

While MicroK8s has a lot of useful add-ons, for simplicity's sake we'll enable and use the dns and dashboard addons. We can view the Grafana dashboard for our deployment.

Let's enable the add-ons. Use the follwoing command:

```
multipass exec microk8s-vm -- /snap/bin/microk8s.enable dns dashboard
```
Let's access hosted services. The API server proxies our services, here is how to get to them:
```bash
multipass exec microk8s-vm -- /snap/bin/microk8s.kubectl cluster-info
Kubernetes master is running at https://127.0.0.1:16443
Heapster is running at https://127.0.0.1:16443/api/v1/namespaces/kube-system/services/heapster/proxy
CoreDNS is running at https://127.0.0.1:16443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Grafana is running at https://127.0.0.1:16443/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
InfluxDB is running at https://127.0.0.1:16443/api/v1/namespaces/kube-system/services/monitoring-influxdb:http/proxy
```

We need to point our browser to [https://127.0.0.1:16443/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy](https://127.0.0.1:16443/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy).
Get the username and password using the command
```
multipass exec microk8s-vm -- /snap/bin/microk8s.config
```

![Grafana Dashboard](../install-a-local-kubernetes-with-microk8s/images/grafana.png)


## Host your first service in Kubernetes
Duration: 7:00

We start by creating a microbot deployment with two pods via the kubectl cli:
```bash
multipass exec microk8s-vm -- /snap/bin/microk8s.kubectl create deployment microbot --image=dontrebootme/microbot:v1
multipass exec microk8s-vm -- /snap/bin/microk8s.kubectl scale deployment microbot --replicas=2
```

To expose our deployment we need to create a service:
```bash
multipass exec microk8s-vm -- /snap/bin/microk8s.kubectl expose deployment microbot --type=NodePort --port=80 --name=microbot-service
```

After a few minutes our cluster looks like this:
```
> multipass exec microk8s-vm -- /snap/bin/microk8s.kubectl get all --all-namespaces
NAMESPACE     NAME                                                  READY   STATUS    RESTARTS   AGE
default       pod/microbot-7dd47b8fd6-4rzt6                         1/1     Running   0          46s
default       pod/microbot-7dd47b8fd6-xr49r                         1/1     Running   0          39s
kube-system   pod/coredns-f7867546d-zb9t5                           1/1     Running   0          10m
kube-system   pod/heapster-v1.5.2-844b564688-5bpzs                  4/4     Running   0          8m22s
kube-system   pod/kubernetes-dashboard-7d75c474bb-jcglw             1/1     Running   0          10m
kube-system   pod/monitoring-influxdb-grafana-v4-6b6954958c-nc6bq   2/2     Running   0          10m


NAMESPACE     NAME                           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                  AGE
default       service/kubernetes             ClusterIP   10.152.183.1     <none>        443/TCP                  10m
default       service/microbot-service       NodePort    10.152.183.69    <none>        80:32648/TCP             25s
kube-system   service/heapster               ClusterIP   10.152.183.7     <none>        80/TCP                   10m
kube-system   service/kube-dns               ClusterIP   10.152.183.10    <none>        53/UDP,53/TCP,9153/TCP   10m
kube-system   service/kubernetes-dashboard   ClusterIP   10.152.183.64    <none>        443/TCP                  10m
kube-system   service/monitoring-grafana     ClusterIP   10.152.183.3     <none>        80/TCP                   10m
kube-system   service/monitoring-influxdb    ClusterIP   10.152.183.203   <none>        8083/TCP,8086/TCP        10m


NAMESPACE     NAME                                             READY   UP-TO-DATE   AVAILABLE   AGE
default       deployment.apps/microbot                         2/2     2            2           46s
kube-system   deployment.apps/coredns                          1/1     1            1           10m
kube-system   deployment.apps/heapster-v1.5.2                  1/1     1            1           10m
kube-system   deployment.apps/kubernetes-dashboard             1/1     1            1           10m
kube-system   deployment.apps/monitoring-influxdb-grafana-v4   1/1     1            1           10m

NAMESPACE     NAME                                                        DESIRED   CURRENT   READY   AGE
default       replicaset.apps/microbot-7dd47b8fd6                         2         2         2       46s
kube-system   replicaset.apps/coredns-f7867546d                           1         1         1       10m
kube-system   replicaset.apps/heapster-v1.5.2-6b794f77c8                  0         0         0       10m
kube-system   replicaset.apps/heapster-v1.5.2-6f5d55456                   0         0         0       8m42s
kube-system   replicaset.apps/heapster-v1.5.2-844b564688                  1         1         1       8m22s
kube-system   replicaset.apps/kubernetes-dashboard-7d75c474bb             1         1         1       10m
kube-system   replicaset.apps/monitoring-influxdb-grafana-v4-6b6954958c   1         1         1       10m
```

At the very top we have the microbot pods, `service/microbot-service` is the second in the services list. Our service has a ClusterIP through which we can access it. Notice, however, that our service is of type [NodePort][nodeport]. This means that our deployment is also available on a port on the host machine; that port is randomly selected and in this case it happens to be `32648`. All we need to do is to point our browser to `http://localhost:32648`.

![Microbot](../install-a-local-kubernetes-with-microk8s/images/microbot.png)

## That’s all folks!
Duration: 1:00

Congratulations, you got your MicroK8s deployment running on Mac!

Until next time, stop all MicroK8s services:
```bash
multipass exec microk8s-vm -- /snap/bin/microk8s.stop
```

### Where to go from here?

* Learn more about [MicroK8s][microk8s]
* Tell us what you think and [fill in feature requests][microk8s-issues]
* Discover Kubernetes opportunities with [Canonical][ubuntu-kubernetes]
* Try [Charmed Kubernetes][charmed-kubernetes]
* Contact [us][contact]


<!-- LINKS -->
[kubernetes]: https://kubernetes.io/
[multipass]: https://multipass.run/
[k8s-docs]: https://kubernetes.io/docs/
[microk8s]: https://microk8s.io/
[microk8s-issues]: https://github.com/ubuntu/microk8s/issues/
[cncf-cert]: https://www.cncf.io/certification/software-conformance/
[snap]: https://snapcraft.io
[microk8s-snap]: https://snapcraft.io/microk8s
[nodeport]: https://kubernetes.io/docs/concepts/services-networking/service/#nodeport
[snap-channels]: https://docs.snapcraft.io/channels/551
[ubuntu-kubernetes]: https://ubuntu.com/kubernetes
[charmed-kubernetes]: https://tutorials.ubuntu.com/tutorial/get-started-canonical-kubernetes#0
[contact]: https://ubuntu.com/kubernetes#get-in-touch
[snapd-documentation]: https://snapcraft.io/docs/installing-snapd
[multipass-releases]: https://github.com/CanonicalLtd/multipass/releases
