---
id: deploying-storageos-on-kubernetes
summary: Learn how to deploy StorageOS on Charmed Kubernetes
categories: containers, kubernetes, csi, storageos
tags: juju, kubernetes, beginner, container, storageos, cloud
difficulty: 3
status: draft
published: 2019-09-16
author: Peter De Sousa <peter.de.sousa@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Deploying StorageOS on Charmed Kubernetes

## Overview
Duration: 1:00

### In this tutorial you'll learn how to...

- Deploy the StorageOS operator
- Create a secret for StorageOS


### You will only need

- Multipass [for Windows](6https://ubuntu.com/blog/kubernetes-on-windows-how-to-set-up) or [Mac](https://tutorials.ubuntu.com/tutorial/install-microk8s-on-mac-os#0) if using [MicroK8s](https://tutorials.ubuntu.com/tutorial/install-a-local-kubernetes-with-microk8s#0)
- or a Charmed Kubernetes deployment


## Installing StorageOS

Make sure that your kubernetes-master is configured to allow privileged.

`$ juju config kubernetes-worker allow-privileged=true`


## Setting Up

### Getting Started

To get StorageOS up and started there are three steps:
- Install the Storage OS operator
- Create a secret
- Trigger bootstrap using a CustomResource***


### Install the StorageOS Operator
```
kubectl create -f https://github.com/storageos/cluster-operator/releases/download/1.4.0/storageos-operator.yaml
```
### Create a the initial StorageOS user account

When installing Storage OS the install will create a user and password using the secret defined below, this is important if you wish to use the StorageOS CLI later:
```
kubectl create -f - <<END
apiVersion: v1
kind: Secret
metadata:
  name: "storageos-api"
  namespace: "storageos-operator"
  labels:
    app: "storageos"
type: "kubernetes.io/storageos"
data:
  apiUsername: dWJ1bnR1
  apiPassword: dWJ1bnR1
               ^^^^^^^^
 echo ‘ubuntu’ | base64
END
```

Now that you have the StorageOS initial account configured you can go ahead and install StorageOS, this step is important and if not configured properly you may get an error similar to this:

```
storageos-daemonset-qpwfn             0/1     Init:Error              11         14m
storageos-daemonset-qpwfn             0/1     PodInitializing         0          14m
```

## Install StorageOS

To configure StorageOS we can use the YAML from the StorageOS docs, for this to work you will require your cluster policy to allow privileged.

```
apiVersion: "storageos.com/v1"
kind: StorageOSCluster
metadata:
  name: "example-storageos"
  namespace: "storageos-operator"
spec:
  secretRefName: "storageos-api" # Reference the Secret created in the previous step
  secretRefNamespace: "storageos-operator"  # Namespace of the Secret
  k8sDistro: "kubernetes"
  images:
    nodeContainer: "storageos/node:1.4.0" # StorageOS version
  resources:
    requests:
    memory: "512Mi"
```

This will trigger 3 daemonset pods to install and 1 scheduler pod, you can check the installation status with:

```
$ kubectl -n storageos get pods -w
```

## Mounting a volume

Ok, now you can create a Persistent Volume Claim:

```
kubectl create -f - <<END
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-first-storage-os-volume
  annotations:
    volume.beta.kubernetes.io/storage-class: fast
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
END
```

And check its status:

```
$ kubectl -n storageos get pods -w
```

You should get something like this:

```
[My-first…] Bound pvc-72866c11-fe5b-40e4-a156-6bcfe7ade53e 5Gi RWO fast 4m14s
```

## Deploying on a workload

Now you can create a pod on our Charmed Kubernetes cluster and try out the newly bound PVC, this can be generalised for any deployment on Kubernetes.

```
kubectl -f - <<END
apiVersion: v1
kind: Pod
metadata:
  name: storageos-ubuntu
spec:
  containers:
    - name: ubuntu
      image: ubuntu:bionic
      command: ["/bin/sleep"]
      args: [ "3600" ]
      volumeMounts:
        - mountPath: /mnt
          name: my-mount
  volumes:
    - name: my-mount
      persistentVolumeClaim:
        claimName: my-first-storage-os-volume
END
```
Check its status:
```
$ kc get pods
```
You should see something like this:
```
NAME               READY   STATUS    RESTARTS   AGE
storageos-ubuntu   1/1     Running   0          2m43s
```

So now you can write and read from our new mounted volume:
```
$ kubectl exec -it storageos-ubuntu -- bash
```
Write something to the new volume:
```
root@storageos-ubuntu:/# echo "Ubuntu + StorageOS!" > /mnt/myfile
```
And read it!
```
root@storageos-ubuntu:/# cat /mnt/myfile
```