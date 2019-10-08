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
Duration: 5

Kubernetes offers a range of storage solutions out of the box, but the majority of these are specific to cloud providers, for example, AWS or Google Cloud. This means that the options left for bare metal deployments are Ceph, NFS or local.

StorageOS is a newcomer to this area providing an easy to setup solution for storage in Charmed Kubernetes which is up and running within minutes.

### In this tutorial you'll learn how to...

- Deploy the StorageOS operator
- Create a secret for StorageOS
- Create a workload on top of StorageOS


### You will only need

- a Charmed Kubernetes cluster

positive
: If you do not have a Charmed Kubernetes cluster, you can refer to the following [tutorial](https://tutorials.ubuntu.com/tutorial/get-started-charmed-kubernetes) to spin up one in minutes. Charmed Kubernetes is a production-grade Kubernetes offering from Canonical which is fully compliant with the upstream project. Get Charmed Kubernetes right away and benefit from simplified deployments and operations provided by Juju charms.

## Cluster preparation
Duration: 2

Make sure that your Kubernetes Master is configured to allow kubeapi-server to run in privileged mode.

`juju config kubernetes-master allow-privileged=true`


## Setting up StorageOS
Duration: 5
### Getting started

To get StorageOS up and running follow these three easy steps:

- Install the StorageOS operator
- Create a secret
- Deploy the daemonsets

### Install the StorageOS operator

To get started with our deployment of StorageOS we need to first deploy the StorageOS operator:

```
kubectl create -f https://github.com/storageos/cluster-operator/releases/download/1.4.0/storageos-operator.yaml
```

This operator YAML also creates a new Kubernetes storage class 'fast' which will be important later.

### Create an initial StorageOS user account

When deploying Storage OS the deployment will create a user and password using the secret defined below. This is important if you wish to use the StorageOS CLI later:

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
#              ^^^^^^^^
# echo ‘ubuntu’ | base64
END
```

Now that you have the StorageOS initial account configured you can go ahead and deploy the StorageOS daemon sets. This step is important and if not configured properly you may get an error similar to this:

```
storageos-daemonset-qpwfn             0/1     Init:Error              11         14m
```

## Deploy the StorageOS cluster
Duration: 10

The following yaml will deploy a StorageOS cluster of three daemon sets:

```
kubectl create -f - <<END
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
END
```

You can check the status of the deployment by watching the daemonset pods:

```
kubectl -n storageos get pods -w
```

## Deploying a workload on StorageOS
Duration: 10

Now to try out your new StorageOS solution you can use a customised version of MySQL Wordpress Deployment from the Kubernetes docs.

Run each of these commands to create a kustomization.yaml, mysql-deployment.yaml and wordpress-deployment.yaml.

### Kustomization.yaml

Create a file with the following content:

```
cat <<END > kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=ubuntu
resources:
  - mysql-deployment.yaml
  - wordpress-deployment.yaml
END
```

### Mysql-deployment.yaml

Create a file with the following content:

```
cat <<END > mysql-deployment.yaml
apiVersion: v1
kind: Service
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
spec:
  ports:
    - port: 3306
  selector:
    app: wordpress
    tier: mysql
  clusterIP: None
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
  annotations:
    volume.beta.kubernetes.io/storage-class: fast
  labels:
    app: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: mysql
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: mysql
    spec:
      containers:
      - image: mysql:5.6
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pv-claim
END
```

### Wordpress-deployment.yaml

Create a file with the following content:

```
cat <<END > wordpress-deployment.yaml
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  ports:
    - port: 80
  selector:
    app: wordpress
    tier: frontend
  type: NodePort
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wp-pv-claim
  labels:
    app: wordpress
  annotations:
    volume.beta.kubernetes.io/storage-class: fast
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: frontend
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: frontend
    spec:
      containers:
      - image: wordpress:4.8-apache
        name: wordpress
        env:
        - name: WORDPRESS_DB_HOST
          value: wordpress-mysql
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password
        ports:
        - containerPort: 80
          name: wordpress
        volumeMounts:
        - name: wordpress-persistent-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-persistent-storage
        persistentVolumeClaim:
          claimName: wp-pv-claim
END
```

The key point of these deployments is the PVC found in both WordPress and MySQL deployments:

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wp-pv-claim
  labels:
    app: wordpress
  annotations:
    volume.beta.kubernetes.io/storage-class: fast
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

This example was taken from the Wordpress deployment, the annotation here has been replaced with StorageOS's 'fast' storage class, this will ask Kubernetes/StorageOS to provision a volume according to the spec.

Once all of the files have been created, run:

```
kubectl create -k ./
```

This will deploy all of the secrets and deployments needed for a WordPress site to operate.

## Access your new site
Duration: 5

Check the service status:
```
kubectl get pods
```
You should see something like this:

```
NAME                               READY   STATUS    RESTARTS   AGE
csi-rbdplugin-attacher-0           1/1     Running   1          60m
csi-rbdplugin-bxgsk                2/2     Running   1          59m
csi-rbdplugin-kcmdd                2/2     Running   2          35m
csi-rbdplugin-provisioner-0        3/3     Running   0          60m
csi-rbdplugin-zlglm                2/2     Running   1          59m
wordpress-74db446497-2724m         1/1     Running   1          10m
wordpress-mysql-7c795bf6dc-9t7dj   1/1     Running   0          10m
```

Once the wordpress and mysql pods are running, you can run:

```
kubectl get svc
```

This will give you the service address:

```
NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
csi-rbdplugin-attacher      ClusterIP   10.152.183.137   <none>        12345/TCP      56m
csi-rbdplugin-provisioner   ClusterIP   10.152.183.170   <none>        12345/TCP      55m
kubernetes                  ClusterIP   10.152.183.1     <none>        443/TCP        61m
wordpress                   NodePort    10.152.183.16    <none>        80:31625/TCP   6m11s
wordpress-mysql             ClusterIP   None             <none>        3306/TCP       6m12s
```

Now you can try to access the WordPress site by navigating to:

`https://10.152.183.16/`


You can go through the WordPress to create an account you should get something like this:

![Wordpress site](images/wp-site.png)

## That's all folks!

Congratulations! In this tutorial, you deployed StorageOS on Charmed Kubernetes and created a WordPress site which used StorageOS as it's storage backend.

This tutorial can be adapted for other tasks which require persistent volumes and shows you the ease of using a solution such as StorageOS offers.

### Where to go from here?
- Explore [Charmed Kubernetes](https://jaas.ai/kubernetes)
- Use Kubernetes straight away for free with [MicroK8s](https://microk8s.io/)
- Looking for production-grade [Kubernetes?](https://ubuntu.com/kubernetes/contact-us)
- StorageOS [docs](https://docs.storageos.com/)
