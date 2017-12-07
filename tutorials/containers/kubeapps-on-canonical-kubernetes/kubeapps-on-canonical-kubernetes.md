---
id: kubeapps-on-canonical-kubernetes
summary: This tutorial will guide you through the installation of Kubeapps on the Canonical Distribution of Kubernetes.
categories: containers
status: published
tags: kubeapps, kubeless, bitnami, kubernetes
difficulty: 3
published: 2017-12-07
author: Sameer Naik <sameer@bitnami.com>
feedback_url: https://github.com/kubeapps/kubeapps/issues

---

# Supercharge your Kubernetes cluster with Kubeapps

## Overview
Duration: 1

This tutorial will guide you through the installation of Kubeapps on the Canonical Distribution of Kubernetes.

### Kubeapps

[Kubeapps](https://www.kubeapps.com/) is a Kubernetes dashboard that supercharges your Kubernetes cluster with simple browse and click deployment of applications. Kubeapps provides a complete application delivery environment that empowers users to launch, review and share applications.

![kubeapps hub](images/kubeapps-dashboard.png)

### What you'll learn

- How to configure dynamic volume provisioning for your Kubernetes cluster on AWS
- How to supercharge your cluster

### What you'll need

- A Linux system with [snapd](https://snapcraft.io/docs/core/install) installed
- Account credentials for AWS

positive
: Note: If you need to install snapd on your Linux system, detailed instructions can be found in the [snapcraft.io documentation](https://snapcraft.io/docs/core/install).

Survey
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

## Create your cluster
Duration: 5:00

On your local machine install `conjure-up` with the following command:

```bash
sudo snap install conjure-up --classic
```

Install the Canonical Distribution of Kubernetes using `conjure-up`.

```bash
conjure-up canonical-kubernetes --channel edge
```

positive
: The `--channel edge` argument in the above command is a temporary workaround for the issue described [here](https://github.com/juju-solutions/bundle-canonical-kubernetes/issues/451). This will not be required in future releases of Kubernetes.

Follow the on-screen instructions to select AWS as the cloud provider and specify the AWS credentials in subsequent prompts.

To add support for dynamic volume provisioning; navigate to the **Advanced Configuration** page of the **kubernetes-master** application and set the value of the `api-extra-args` field to `admission-control=Initializers,NamespaceLifecycle,LimitRanger,ServiceAccount,ResourceQuota,DefaultTolerationSeconds,DefaultStorageClass`.

![kubernetes-master-customization](images/kubernetes-master-advanced-configuration.gif)

After the installation has completed, configure `kubectl` to talk to our cluster.

```bash
mkdir -p ~/.kube
juju scp kubernetes-master/0:config ~/.kube/config
```

positive
: The `conjure-up` command automatically installs the `juju` snap package if the command cannot be found.

Now let's verify that we're able to communicate with our Kubernetes cluster:

```bash
kubectl cluster-info
```

If you do not have the `kubectl` command already installed, install it using the following command:

```bash
sudo snap install kubectl --classic
```

## Setup dynamic disk provisioning
Duration: 2:00

The Canonical Distribution of Kubernetes does not define a default storage class and since we've setup our cluster on the AWS cloud, we'll define a storage class named `gp2` which will dynamically provision storage from Amazon EBS.

Create a file named `gp2-storageclass.yaml` with the following content:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2
  annotations:
    storageclass.beta.kubernetes.io/is-default-class: "true"
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Delete
```

Let's create the storage class with the following command:

```bash
kubectl create -f gp2-storageclass.yaml
```

Verify that the storage class was created using the command:

```bash
kubectl get storageclass
```

## Deploy kubeapps
Duration: 2:00

Use the following commands to install the Kubeapps CLI to your local Linux machine:

```bash
curl -s https://api.github.com/repos/kubeapps/kubeapps/releases/latest | grep linux | grep browser_download_url | cut -d '"' -f 4 | wget -i -
chmod +x kubeapps-linux-amd64
sudo mv kubeapps-linux-amd64 /usr/local/bin/kubeapps
```

Fasten your seatbelt! the moment has come where you will supercharge your cluster with Kubeapps.

```bash
kubeapps up
```

Kubeapps will be installed to your cluster under the `kubeapps` namespace. We can check the status of the deployments using the following command:

```bash
kubectl get pods --namespace kubeapps
```

To access the in-cluster dashboard, execute the following command:

```bash
kubeapps dashboard
```

That's it! Deploy your favorite applications and functions to your Kubernetes cluster with a single click from the Kubeapps dashboard.

![kubeapps deploy](images/kubeapps-wordpress-deploy.png)

### Further readings

* To learn more about Kubeapps refer to the [documentation](https://github.com/kubeapps/kubeapps/tree/master/docs)
