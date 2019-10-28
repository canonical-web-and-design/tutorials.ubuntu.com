---
id: charmed-kubernetes-kata-containers
summary: Ensuring security and isolation of workloads in a Charmed Kubernetes cluster with Kata Containers
categories: containers
tags: kubernetes, containers, kata, beginner
difficulty: 2
status: draft
published: 2019-10-16
author: Tytus Kurek <tytus.kurek@canonical.com>
feedback_url: https://bugs.launchpad.net/charmed-kubernetes/+filebug

---

# Ensuring security and isolation of workloads in a Charmed Kubernetes cluster with Kata Containers



## Overview

### What is Charmed Kubernetes?

[Charmed Kubernetes][kubernetes_charmed] is a Kubernetes distribution, developed and maintained by Canonical, that is fully compliant with the upstream [Kubernetes project][kubernetes_upstream]. It is production-grade and scales even in environments with hundreds of worker nodes. Charmed Kubernetes is based on [Juju charms][juju] which significantly simplify its deployments and operations and allow you to benefit from a model-driven, declarative approach. Charmed Kubernetes can be deployed on a variety of public clouds (AWS, GCE, Azure and more) and various on-premise solutions (MAAS, OpenStack, VMware vSphere).

### What are Kata Containers?

[Kata Conainers][kata_containers] is an open source project focused on improving the security and isolation of container technologies. By running on a shared kernel, containers are usually considered to be less secure than traditional virtual machines. Kata Containers allow launching container workloads inside of lightweight VMs which seamlessly plug into the existing container ecosystems, such as Kubernetes.

### In this tutorial you will learn how to:

- Deploy Kata Containers extension in a Charmed Kubernetes cluster
- Use Kata runtime to launch container workloads

### You will need:

* A Charmed Kubernetes cluster deployed on bare metal
* The `kubectl` CLI client which you can install from the [snap store][kubectl]

If you do not have an access to a Charmed Kubernetes cluster, you can easily get one up and running based on the following [tutorial][kubernetes_charmed_tutorial].

For the purpose of this tutorial we will use the kubernetes-core [bundle][kubernetes_core], however, you can use any other bundle that fits for your needs. We will also use AWS as a provider.

positive
: Since Kata Containers uses QEMU/KVM to launch VMs for containers, it is really important that your Charmed Kubernetes cluster is deployed on bare metal. You can use the `i3.metal` instance type when deploying on AWS or any other local provider that supports bare metal provisionins (e.g. [MAAS][maas] or [VMware vSphere][vsphere]).

## Prepare the kubectl client

Duration: 2:00

Before we get started, we have to prepare configs for the `kubectl` client, so that it could be able to talk to our Charmed Kubernetes cluster. Please follow the listing below to complete all necessary steps:

First of all, make sure that you Charmed Kubernetes cluster is in a healthy state. Run `juju status` command from the terminal and make sure that all applications and units are in the `active` state:

```bash
$ juju status
Model       Controller      Cloud/Region   Version  SLA          Timestamp
kubernetes  aws-controller  aws/us-east-1  2.6.9    unsupported  11:12:56+01:00

App                Version  Status  Scale  Charm              Store       Rev  OS      Notes
containerd                  active      2  containerd         jujucharms   33  ubuntu  
easyrsa            3.0.1    active      1  easyrsa            jujucharms  278  ubuntu  
etcd               3.2.10   active      1  etcd               jujucharms  460  ubuntu  
flannel            0.11.0   active      2  flannel            jujucharms  450  ubuntu  
kubernetes-master  1.16.2   active      1  kubernetes-master  jujucharms  754  ubuntu  exposed
kubernetes-worker  1.16.2   active      1  kubernetes-worker  jujucharms  590  ubuntu  exposed

Unit                  Workload  Agent  Machine  Public address  Ports           Message
easyrsa/0*            active    idle   0/lxd/0  252.44.235.195                  Certificate Authority connected.
etcd/0*               active    idle   0        54.167.235.18   2379/tcp        Healthy with 1 known peer
kubernetes-master/0*  active    idle   0        54.167.235.18   6443/tcp        Kubernetes master running.
  containerd/0*       active    idle            54.167.235.18                   Container runtime available
  flannel/0*          active    idle            54.167.235.18                   Flannel subnet 10.1.46.1/24
kubernetes-worker/0*  active    idle   1        3.227.255.168   80/tcp,443/tcp  Kubernetes worker running.
  containerd/1        active    idle            3.227.255.168                   Container runtime available
  flannel/1           active    idle            3.227.255.168                   Flannel subnet 10.1.61.1/24

Machine  State    DNS             Inst id              Series  AZ          Message
0        started  54.167.235.18   i-05ab0f89cf56e7a31  bionic  us-east-1a  running
0/lxd/0  started  252.44.235.195  juju-dcb302-0-lxd-0  bionic  us-east-1a  Container started
1        started  3.227.255.168   i-09580bdd3fbd7e4d5  bionic  us-east-1b  running
```

Then copy the config file from the Kubernetes Master:

```bash
$ mkdir -p ~/.kube
$ juju scp kubernetes-master/0:config ~/.kube/config
```

At this point you can interact with your Charmed Kubernetes cluster via the `kubectl` command:

```bash
$ kubectl cluster-info
Kubernetes master is running at https://54.167.235.18:6443
Heapster is running at https://54.167.235.18:6443/api/v1/namespaces/kube-system/services/heapster/proxy
CoreDNS is running at https://54.167.235.18:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://54.167.235.18:6443/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
Grafana is running at https://54.167.235.18:6443/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
InfluxDB is running at https://54.167.235.18:6443/api/v1/namespaces/kube-system/services/monitoring-influxdb:http/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

## Deploy Kata Containers extension

Duration: 4:00

Deploying Kata Containers extension in Charmed Kubernetes cluster is pretty straightforward. Simply deploy the `kata` subordinate charm and relate it to `kubernetes-master`, `kubernetes-worker` and `containerd` applications:

```bash
$ juju deploy cs:~containers/kata
Located charm "cs:~containers/kata-6".
Deploying charm "cs:~containers/kata-6".
$ juju add-relation kata kubernetes-master
$ juju add-relation kata kubernetes-worker
$ juju add-relation kata:untrusted containerd:untrusted
```

Verify the output of the `juju status` command again. You may see some applications in the `maintenance` state. It may take some time, but at the end all should turn into the `active` state:

```bash
$ juju status
Model       Controller      Cloud/Region   Version  SLA          Timestamp
kubernetes  aws-controller  aws/us-east-1  2.6.9    unsupported  11:39:38+01:00

App                Version  Status  Scale  Charm              Store       Rev  OS      Notes
containerd                  active      2  containerd         jujucharms   33  ubuntu  
easyrsa            3.0.1    active      1  easyrsa            jujucharms  278  ubuntu  
etcd               3.2.10   active      1  etcd               jujucharms  460  ubuntu  
flannel            0.11.0   active      2  flannel            jujucharms  450  ubuntu  
kata                        active      2  kata               jujucharms    6  ubuntu  
kubernetes-master  1.16.2   active      1  kubernetes-master  jujucharms  754  ubuntu  exposed
kubernetes-worker  1.16.2   active      1  kubernetes-worker  jujucharms  590  ubuntu  exposed

Unit                  Workload  Agent  Machine  Public address  Ports           Message
easyrsa/0*            active    idle   0/lxd/0  252.44.235.195                  Certificate Authority connected.
etcd/0*               active    idle   0        54.167.235.18   2379/tcp        Healthy with 1 known peer
kubernetes-master/0*  active    idle   0        54.167.235.18   6443/tcp        Kubernetes master running.
  containerd/0*       active    idle            54.167.235.18                   Container runtime available
  flannel/0*          active    idle            54.167.235.18                   Flannel subnet 10.1.46.1/24
  kata/0*             active    idle            54.167.235.18                   Kata runtime available
kubernetes-worker/0*  active    idle   1        3.227.255.168   80/tcp,443/tcp  Kubernetes worker running.
  containerd/1        active    idle            3.227.255.168                   Container runtime available
  flannel/1           active    idle            3.227.255.168                   Flannel subnet 10.1.61.1/24
  kata/1              active    idle            3.227.255.168                   Kata runtime available

Machine  State    DNS             Inst id              Series  AZ          Message
0        started  54.167.235.18   i-05ab0f89cf56e7a31  bionic  us-east-1a  running
0/lxd/0  started  252.44.235.195  juju-dcb302-0-lxd-0  bionic  us-east-1a  Container started
1        started  3.227.255.168   i-09580bdd3fbd7e4d5  bionic  us-east-1b  running
```

That's all. Your Charmed Kubernetes cluster is ready for launching container workloads via the Kata runtime.

## Use Kata runtime

Duration: 8:00

Let's take a look on the list of containers managed by `containerd` on the Kubernetes Worker node:

```bash
$ juju ssh kubernetes-worker/0 sudo ctr --namespace=k8s.io containers ls
CONTAINER                                                           IMAGE                                                                      RUNTIME                           
066a57c0eb19e2f13a53da0d161bff05abba6834fc823bd835c656654e8516c6    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
082dc1663483d2ad66900ff282374cf791e512e260cbe1f399c8e358eb7a9bc3    sha256:5d092e4b984acc2661bb4d2752ddd98ac87004d58c56ff41f768b1136a63a1f2    io.containerd.runtime.v1.linux    
13a9464d5c1ff0b822ca6edc98fb55e359bdf9d6b16932e25b70f142ae83716a    sha256:b5af743e598496e8ebd7a6eb3fea76a6464041581520d1c2315c95f993287303    io.containerd.runtime.v1.linux    
1e0110721c0962ce28d830544cbe79da8604c671814b71a931b73df939a38620    sha256:577260d221dbb1be2d83447402d0d7c5e15501a89b0e2cc1961f0b24ed56c77c    io.containerd.runtime.v1.linux    
248f628e85552d209ba985ee427b6766ec3b6c4c1ec98c0ac9e170c5d8113acd    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
2731f5c54b7197a7b00e3a09636e7a6c5b61cafef0e037534670fc835e3b7b31    sha256:bf261d157914477ee1a5969d28ec687f3fbfc9fb5a664b22df78e57023b0e03b    io.containerd.runtime.v1.linux    
3af887cc9d5fdb8329a03b7fadf35819cdef5683e15642a98fb3388e930c895c    sha256:71b13764bb0827aae7ff634592e32ed2fa9ee4ebe7573ad518ee940faae19402    io.containerd.runtime.v1.linux    
54c8c99d48902a047aa2f69064b691c63b3287e32e01bea1de17538cc822eb84    sha256:6802d83967b995c2c2499645ede60aa234727afc06079e635285f54c82acbceb    io.containerd.runtime.v1.linux    
5c81130a739f265077f13ea76dae183e9ec54baa766a11a5731a050388be36e1    sha256:bf261d157914477ee1a5969d28ec687f3fbfc9fb5a664b22df78e57023b0e03b    io.containerd.runtime.v1.linux    
617808e88222ecf22685fa97c9d9d3332126a423fe26ccd44090cc4619c7c88e    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
61e23851f589863bc152a5e7436a3088ef4fa71d02d6181a341b9ff52a42f904    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
66f2edb64ba85da66b5ff4861ac8d02cb8d02651ad84069c76c41250106e9647    sha256:71b13764bb0827aae7ff634592e32ed2fa9ee4ebe7573ad518ee940faae19402    io.containerd.runtime.v1.linux    
6f03ab0f3f7489b46376e4f24861cfc7220166805a6e4744aeb92dc343f6ec0f    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
8e9d9644102a8a22c2628a510a2165fc922c36a8341c2b8b9ed58ddc819e2311    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
94d040ca432ece2217f6bbe00510e053c56ed8fbe6188639425f96e26eeb3bc3    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
a0a5dc5e53e724cd3b44fc7a7c24fae1d6a1c29d8c52bb08b483178fd20d8886    sha256:8cb3de219af7bdf0b3ae66439aecccf94cebabb230171fa4b24d66d4a786f4f7    io.containerd.runtime.v1.linux    
a39f221bfd1436bc40879eecc286cf62f8fdac0799845f599ebe634133157ef3    sha256:709901356c11546f46256dd2028c390d2b4400fe439c678b87f050977672ae8e    io.containerd.runtime.v1.linux    
a54d4a154a231ec1759261f6da7fb988af809f874d1e2632a999e4d072dc3d68    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
af21885d19060770835b0f47d31484fdc4ff918d5285b11d8aaff9f8c7cc9e65    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
c54e3585e186497617842a976470358ececcdb17fa37ae8b9d89485eea16e61f    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
cf843e76d3489e84db44d7d891c0236155e13567a1bd1a0628e891f6b7c31fec    sha256:0439eb3e11f1927af2e0ef5f38271079cb74cacfe82d3f58b76b92fb03c644fc    io.containerd.runtime.v1.linux    
f512ee1d9d274d1638b7895b338d0e4e3739c48a58bd54fa75d86d278b3b9126    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
fa688b4faf7b422a1077065e977c84aeba8fee4bd6f6008b6f481050d6dd9ca7    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
Connection to 3.227.255.168 closed.
```

As you can see there are many containers already running. Those are hosting Kubernetes control services. But the output is really meaningless, so let's just count how many containers are running there:

```bash
$ juju ssh kubernetes-worker/0 sudo ctr --namespace=k8s.io containers ls | grep containerd | wc -l
Connection to 3.227.255.168 closed.
23
```

There are 23 containers running. Let's now create a sample pod based on the `nginx` image:

```bash
$ kubectl run nginx --image nginx --restart Never
pod/nginx created
```

We can check the pod's status by executing the following command:

```bash
$ kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          12s
```

Again, let's have a look on the container's list:

```bash
$ juju ssh kubernetes-worker/0 sudo ctr --namespace=k8s.io containers ls
CONTAINER                                                           IMAGE                                                                      RUNTIME                           
066a57c0eb19e2f13a53da0d161bff05abba6834fc823bd835c656654e8516c6    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
082da21e6840dbbf94c940a24ed42e6e26f636582d864792c9cf7d1b33ebeca4    rocks.canonical.com:443/cdk/pause-amd64:3.1                                io.containerd.runtime.v1.linux    
082dc1663483d2ad66900ff282374cf791e512e260cbe1f399c8e358eb7a9bc3    sha256:5d092e4b984acc2661bb4d2752ddd98ac87004d58c56ff41f768b1136a63a1f2    io.containerd.runtime.v1.linux    
13a9464d5c1ff0b822ca6edc98fb55e359bdf9d6b16932e25b70f142ae83716a    sha256:b5af743e598496e8ebd7a6eb3fea76a6464041581520d1c2315c95f993287303    io.containerd.runtime.v1.linux    
1e0110721c0962ce28d830544cbe79da8604c671814b71a931b73df939a38620    sha256:577260d221dbb1be2d83447402d0d7c5e15501a89b0e2cc1961f0b24ed56c77c    io.containerd.runtime.v1.linux    
2102015643e86832fbbcdcb62f82e3b2895e7287cc18e2d4276030d3a4935c2c    sha256:540a289bab6cb1bf880086a9b803cf0c4cefe38cbb5cdefa199b69614525199f    io.containerd.runtime.v1.linux    
248f628e85552d209ba985ee427b6766ec3b6c4c1ec98c0ac9e170c5d8113acd    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
2731f5c54b7197a7b00e3a09636e7a6c5b61cafef0e037534670fc835e3b7b31    sha256:bf261d157914477ee1a5969d28ec687f3fbfc9fb5a664b22df78e57023b0e03b    io.containerd.runtime.v1.linux    
3af887cc9d5fdb8329a03b7fadf35819cdef5683e15642a98fb3388e930c895c    sha256:71b13764bb0827aae7ff634592e32ed2fa9ee4ebe7573ad518ee940faae19402    io.containerd.runtime.v1.linux    
54c8c99d48902a047aa2f69064b691c63b3287e32e01bea1de17538cc822eb84    sha256:6802d83967b995c2c2499645ede60aa234727afc06079e635285f54c82acbceb    io.containerd.runtime.v1.linux    
5c81130a739f265077f13ea76dae183e9ec54baa766a11a5731a050388be36e1    sha256:bf261d157914477ee1a5969d28ec687f3fbfc9fb5a664b22df78e57023b0e03b    io.containerd.runtime.v1.linux    
617808e88222ecf22685fa97c9d9d3332126a423fe26ccd44090cc4619c7c88e    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
61e23851f589863bc152a5e7436a3088ef4fa71d02d6181a341b9ff52a42f904    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
66f2edb64ba85da66b5ff4861ac8d02cb8d02651ad84069c76c41250106e9647    sha256:71b13764bb0827aae7ff634592e32ed2fa9ee4ebe7573ad518ee940faae19402    io.containerd.runtime.v1.linux    
6f03ab0f3f7489b46376e4f24861cfc7220166805a6e4744aeb92dc343f6ec0f    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
8e9d9644102a8a22c2628a510a2165fc922c36a8341c2b8b9ed58ddc819e2311    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
94d040ca432ece2217f6bbe00510e053c56ed8fbe6188639425f96e26eeb3bc3    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
a0a5dc5e53e724cd3b44fc7a7c24fae1d6a1c29d8c52bb08b483178fd20d8886    sha256:8cb3de219af7bdf0b3ae66439aecccf94cebabb230171fa4b24d66d4a786f4f7    io.containerd.runtime.v1.linux    
a39f221bfd1436bc40879eecc286cf62f8fdac0799845f599ebe634133157ef3    sha256:709901356c11546f46256dd2028c390d2b4400fe439c678b87f050977672ae8e    io.containerd.runtime.v1.linux    
a54d4a154a231ec1759261f6da7fb988af809f874d1e2632a999e4d072dc3d68    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
af21885d19060770835b0f47d31484fdc4ff918d5285b11d8aaff9f8c7cc9e65    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
c54e3585e186497617842a976470358ececcdb17fa37ae8b9d89485eea16e61f    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
cf843e76d3489e84db44d7d891c0236155e13567a1bd1a0628e891f6b7c31fec    sha256:0439eb3e11f1927af2e0ef5f38271079cb74cacfe82d3f58b76b92fb03c644fc    io.containerd.runtime.v1.linux    
f512ee1d9d274d1638b7895b338d0e4e3739c48a58bd54fa75d86d278b3b9126    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
fa688b4faf7b422a1077065e977c84aeba8fee4bd6f6008b6f481050d6dd9ca7    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
Connection to 3.227.255.168 closed.

$ juju ssh kubernetes-worker/0 sudo ctr --namespace=k8s.io containers ls | grep containerd | wc -l
Connection to 3.227.255.168 closed.
25
```

The container which hosts the `nginx` pod has been created. Let's see whether there are any `qemu` processes running there:

```bash
$ juju ssh kubernetes-worker/0 sudo "ps -ef | grep qemu"
ubuntu   68878 68877  0 10:51 pts/0    00:00:00 bash -c sudo ps -ef | grep qemu
ubuntu   68880 68878  0 10:51 pts/0    00:00:00 grep qemu
Connection to 3.227.255.168 closed.
```

There is nothing! The reason is that you have to explicitely request to use the Kata runtime when launching container workloads.

### Creating kata class

For this purpose we have to create a kata class:

```bash
echo <EOF >> kata.yaml
apiVersion: node.k8s.io/v1beta1
kind: RuntimeClass
metadata:
  name: kata
handler: kata
EOF

$ kubectl create -f kata.yaml
runtimeclass.node.k8s.io/kata created
```

### Creating a pod via the Kata runtime

Now, as the kata class has been created, we can create another pod using the Kata runtime. We start with creating a YAML file for the pod:

```bash
$ kubectl run nginx-kata --image nginx --restart Never --dry-run --output yaml > nginx-kata.yaml
```

Then we add the `runtimeClassName: kata` line to the file:

```bash
$ cat nginx-kata.yaml 
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx-kata
  name: nginx-kata
spec:
  runtimeClassName: kata
  containers:
  - image: nginx
    name: nginx-kata
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

And finally, we create the pod:

```bash
$ kubectl create -f nginx-kata.yaml
pod/nginx-kata created
```

So let's now check the container's list again:

```bash
$ juju ssh kubernetes-worker/0 sudo ctr --namespace=k8s.io containers ls
CONTAINER                                                           IMAGE                                                                      RUNTIME                           
066a57c0eb19e2f13a53da0d161bff05abba6834fc823bd835c656654e8516c6    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
082da21e6840dbbf94c940a24ed42e6e26f636582d864792c9cf7d1b33ebeca4    rocks.canonical.com:443/cdk/pause-amd64:3.1                                io.containerd.runtime.v1.linux    
082dc1663483d2ad66900ff282374cf791e512e260cbe1f399c8e358eb7a9bc3    sha256:5d092e4b984acc2661bb4d2752ddd98ac87004d58c56ff41f768b1136a63a1f2    io.containerd.runtime.v1.linux    
13a9464d5c1ff0b822ca6edc98fb55e359bdf9d6b16932e25b70f142ae83716a    sha256:b5af743e598496e8ebd7a6eb3fea76a6464041581520d1c2315c95f993287303    io.containerd.runtime.v1.linux    
1e0110721c0962ce28d830544cbe79da8604c671814b71a931b73df939a38620    sha256:577260d221dbb1be2d83447402d0d7c5e15501a89b0e2cc1961f0b24ed56c77c    io.containerd.runtime.v1.linux    
2102015643e86832fbbcdcb62f82e3b2895e7287cc18e2d4276030d3a4935c2c    sha256:540a289bab6cb1bf880086a9b803cf0c4cefe38cbb5cdefa199b69614525199f    io.containerd.runtime.v1.linux    
248f628e85552d209ba985ee427b6766ec3b6c4c1ec98c0ac9e170c5d8113acd    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
2731f5c54b7197a7b00e3a09636e7a6c5b61cafef0e037534670fc835e3b7b31    sha256:bf261d157914477ee1a5969d28ec687f3fbfc9fb5a664b22df78e57023b0e03b    io.containerd.runtime.v1.linux    
3741ee057f93943a5e9ff1502a92a876bc8339a0d50ff887e899b37aef7a5357    sha256:540a289bab6cb1bf880086a9b803cf0c4cefe38cbb5cdefa199b69614525199f    io.containerd.kata.v2             
3af887cc9d5fdb8329a03b7fadf35819cdef5683e15642a98fb3388e930c895c    sha256:71b13764bb0827aae7ff634592e32ed2fa9ee4ebe7573ad518ee940faae19402    io.containerd.runtime.v1.linux    
54c8c99d48902a047aa2f69064b691c63b3287e32e01bea1de17538cc822eb84    sha256:6802d83967b995c2c2499645ede60aa234727afc06079e635285f54c82acbceb    io.containerd.runtime.v1.linux    
5c81130a739f265077f13ea76dae183e9ec54baa766a11a5731a050388be36e1    sha256:bf261d157914477ee1a5969d28ec687f3fbfc9fb5a664b22df78e57023b0e03b    io.containerd.runtime.v1.linux    
617808e88222ecf22685fa97c9d9d3332126a423fe26ccd44090cc4619c7c88e    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
61e23851f589863bc152a5e7436a3088ef4fa71d02d6181a341b9ff52a42f904    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
66f2edb64ba85da66b5ff4861ac8d02cb8d02651ad84069c76c41250106e9647    sha256:71b13764bb0827aae7ff634592e32ed2fa9ee4ebe7573ad518ee940faae19402    io.containerd.runtime.v1.linux    
6f03ab0f3f7489b46376e4f24861cfc7220166805a6e4744aeb92dc343f6ec0f    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
8e9d9644102a8a22c2628a510a2165fc922c36a8341c2b8b9ed58ddc819e2311    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
94d040ca432ece2217f6bbe00510e053c56ed8fbe6188639425f96e26eeb3bc3    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
a0a5dc5e53e724cd3b44fc7a7c24fae1d6a1c29d8c52bb08b483178fd20d8886    sha256:8cb3de219af7bdf0b3ae66439aecccf94cebabb230171fa4b24d66d4a786f4f7    io.containerd.runtime.v1.linux    
a39f221bfd1436bc40879eecc286cf62f8fdac0799845f599ebe634133157ef3    sha256:709901356c11546f46256dd2028c390d2b4400fe439c678b87f050977672ae8e    io.containerd.runtime.v1.linux    
a54d4a154a231ec1759261f6da7fb988af809f874d1e2632a999e4d072dc3d68    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
af21885d19060770835b0f47d31484fdc4ff918d5285b11d8aaff9f8c7cc9e65    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
c54e3585e186497617842a976470358ececcdb17fa37ae8b9d89485eea16e61f    sha256:f60a10c24e075bad56bac7a14559bb7fe6e601f2aad4982b2b8c2ed9c79ccfb6    io.containerd.runtime.v1.linux    
cf843e76d3489e84db44d7d891c0236155e13567a1bd1a0628e891f6b7c31fec    sha256:0439eb3e11f1927af2e0ef5f38271079cb74cacfe82d3f58b76b92fb03c644fc    io.containerd.runtime.v1.linux    
d53282f1cd5e37c2adbf8a76851ee942733965aa2732760700e5ad7a2f6e53cd    rocks.canonical.com:443/cdk/pause-amd64:3.1                                io.containerd.kata.v2             
f512ee1d9d274d1638b7895b338d0e4e3739c48a58bd54fa75d86d278b3b9126    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
fa688b4faf7b422a1077065e977c84aeba8fee4bd6f6008b6f481050d6dd9ca7    sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e    io.containerd.runtime.v1.linux    
Connection to 3.227.255.168 closed.

$ juju ssh kubernetes-worker/0 sudo ctr --namespace=k8s.io containers ls | grep containerd | wc -l
Connection to 3.227.255.168 closed.
27
```

The number has grown again and we can now see that the `io.containerd.kata.v2` is being used

We can also check if there are any `qemu` processes running on the Kubernetes Worker node:

```bash
$ juju ssh kubernetes-worker/0 sudo "ps -ef | grep qemu"
root     13702     1  1 11:07 ?        00:00:01 /usr/bin/qemu-vanilla-system-x86_64 -name sandbox-d53282f1cd5e37c2adbf8a76851ee942733965aa2732760700e5ad7a2f6e53cd -uuid 4ad3b074-b802-41f0-ae42-73a53cf27f50 -machine pc,accel=kvm,kernel_irqchip,nvdimm -cpu host -qmp unix:/run/vc/vm/d53282f1cd5e37c2adbf8a76851ee942733965aa2732760700e5ad7a2f6e53cd/qmp.sock,server,nowait -m 2048M,slots=10,maxmem=516891M -device pci-bridge,bus=pci.0,id=pci-bridge-0,chassis_nr=1,shpc=on,addr=2,romfile= -device virtio-serial-pci,disable-modern=false,id=serial0,romfile= -device virtconsole,chardev=charconsole0,id=console0 -chardev socket,id=charconsole0,path=/run/vc/vm/d53282f1cd5e37c2adbf8a76851ee942733965aa2732760700e5ad7a2f6e53cd/console.sock,server,nowait -device nvdimm,id=nv0,memdev=mem0 -object memory-backend-file,id=mem0,mem-path=/usr/share/kata-containers/kata-containers-image_clearlinux_1.9.0-rc0_agent_ba6ab83c16.img,size=134217728 -device virtio-scsi-pci,id=scsi0,disable-modern=false,romfile= -object rng-random,id=rng0,filename=/dev/urandom -device virtio-rng,rng=rng0,romfile= -device virtserialport,chardev=charch0,id=channel0,name=agent.channel.0 -chardev socket,id=charch0,path=/run/vc/vm/d53282f1cd5e37c2adbf8a76851ee942733965aa2732760700e5ad7a2f6e53cd/kata.sock,server,nowait -device virtio-9p-pci,disable-modern=false,fsdev=extra-9p-kataShared,mount_tag=kataShared,romfile= -fsdev local,id=extra-9p-kataShared,path=/run/kata-containers/shared/sandboxes/d53282f1cd5e37c2adbf8a76851ee942733965aa2732760700e5ad7a2f6e53cd,security_model=none -netdev tap,id=network-0,vhost=on,vhostfds=3,fds=4 -device driver=virtio-net-pci,netdev=network-0,mac=36:62:ea:9e:37:7f,disable-modern=false,mq=on,vectors=4,romfile= -global kvm-pit.lost_tick_policy=discard -vga none -no-user-config -nodefaults -nographic -daemonize -object memory-backend-ram,id=dimm1,size=2048M -numa node,memdev=dimm1 -kernel /usr/share/kata-containers/vmlinuz-4.19.75.54-42.container -append tsc=reliable no_timer_check rcupdate.rcu_expedited=1 i8042.direct=1 i8042.dumbkbd=1 i8042.nopnp=1 i8042.noaux=1 noreplace-smp reboot=k console=hvc0 console=hvc1 iommu=off cryptomgr.notests net.ifnames=0 pci=lastbus=0 root=/dev/pmem0p1 rootflags=dax,data=ordered,errors=remount-ro ro rootfstype=ext4 quiet systemd.show_status=false panic=1 nr_cpus=72 agent.use_vsock=false systemd.unit=kata-containers.target systemd.mask=systemd-networkd.service systemd.mask=systemd-networkd.socket -pidfile /run/vc/vm/d53282f1cd5e37c2adbf8a76851ee942733965aa2732760700e5ad7a2f6e53cd/pid -smp 1,cores=1,threads=1,sockets=72,maxcpus=72
ubuntu   14549 14548  0 11:09 pts/0    00:00:00 bash -c sudo ps -ef | grep qemu
ubuntu   14551 14549  0 11:09 pts/0    00:00:00 grep qemu
Connection to 3.227.255.168 closed.

$ juju ssh kubernetes-worker/0 sudo "ps -ef | grep qemu | grep root | wc -l"
Connection to 3.227.255.168 closed.
1
```

As you can see this time the `qemu` process has been created. The `nginx` pod is running as a container inside of the VM on the Kubernetes Worker node.

### Creating a deployment via the Kata runtime

Creating deployments via the Kata runtime does not differ much from creating pods. Let's start with creating a YAML file for an nginx-based deployment with 3 replicas:

```bash
$ kubectl run nginx-deployment-kata --image nginx --replicas 3 --restart Always --dry-run --output yaml > nginx-kata-deployment.yaml
```

Then add the `runtimeClassName: kata` line again:

```bash
$ cat nginx-kata-deployment.yaml 
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    run: nginx-deployment-kata
  name: nginx-deployment-kata
spec:
  replicas: 3
  selector:
    matchLabels:
      run: nginx-deployment-kata
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: nginx-deployment-kata
    spec:
      runtimeClassName: kata
      containers:
      - image: nginx
        name: nginx-deployment-kata
        resources: {}
status: {}
```

And create the deployment:

```bash
$ kubectl create -f nginx-kata-deployment.yaml
deployment.apps/nginx-deployment-kata created
```

Once we check the number of `qemu` processes running on the Kubernetes Worker node, we will notice that there are 4 of them:

```bash
$ juju ssh kubernetes-worker/0 sudo "ps -ef | grep qemu | grep root | wc -l"
Connection to 3.227.255.168 closed.
4
```

This means that apart from the VM created for the `nginx-kata` pod a separate VM has been created for each replica of the `nginx-deployment-kata` deployment.

## That’s all folks!

Duration: 1:00

Congratulations! You have made it!

In this tutorial you have learned how to deploy Kata Containers extension in Charmed Kubernetes environment and how to use the Kata runtime to launch container workloads. You can now use your newly learned skills to improve security and isolation of containers in your Charmed Kubernetes cluster.

### Where to go from here?

Read Kata Containers [documentation][kata_documentation]
Explore [Charmed Kubernetes][kubernetes_charmed]
Try [MicroK8s][kubernetes_microk8s]
Learn more about [Canonical's solutions for Kubernetes][kubernetes_canonical]
[Contact us!][contact]

<!-- LINKS -->
[contact]: https://ubuntu.com/kubernetes#get-in-touch
[juju]: https://jaas.ai/
[kata_containers]: https://katacontainers.io/
[kata_documentation]: https://katacontainers.io/docs/
[kubectl]: https://snapcraft.io/kubectl
[kubernetes_canonical]: https://ubuntu.com/kubernetes
[kubernetes_charmed]: https://jaas.ai/kubernetes
[kubernetes_charmed_tutorial]: https://tutorials.ubuntu.com/tutorial/get-started-charmed-kubernetes#0
[kubernetes_core]: https://jaas.ai/kubernetes-core/bundle
[kubernetes_microk8s]: https://microk8s.io/
[kubernetes_upstream]: https://kubernetes.io/
[maas]: https://jaas.ai/docs/maas-cloud
[vmware]: https://jaas.ai/docs/vsphere-cloud
