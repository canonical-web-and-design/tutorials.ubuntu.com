---
id: using-gitlab-as-a-container-registry
summary: Learn how to use GitLab as a private container registry for Kubernetes
categories: containers
tags: kubernetes, containers, gitlab, cicd
difficulty: 3
status: draft
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2019-09-02
author: Peter De Sousa <peter.de.sousa@canonical.com>

---

# Using GitLab as a container registry for Kubernetes

## Overview

Container orchestration solutions such as Kubernetes allow development teams to be quick and agile with their software deployments. The main feature of these orchestration tools is the ability to reduce the deployment of version piece of software down to a simple tag name on the end of a string. For example `image: someApplication:canary`.

This opens the doors to streamlined deployments, but creates another problem. How do we streamline? We can do this manually, but it's not very streamlined. Or we can do this automatically, but we need to be smart. We can't just deploy as soon as a new version is released. We need to check it first. This is where container registries and CI/CD come in.

GitLab has the ability to store up to 10 GB in a container registry for projects. You can incorporate the building of these containers into your own CI/CD pipeline or you can use Gitlab’s own CI/CD functionality to do this for you. For the purposes of this tutorial, you will do this by hand so you can get a grasp of the process.

### In this tutorial you'll learn how to:

- Create a private container registry on GitLab
- Create deployment keys
- Create a container
- Push to the container registry
- Pull using your deployment key

### You will only need

- Kubernetes cluster

Find yourself a healthy Kubernetes cluster. If you don’t have access to one, install [MicroK8s](https://tutorials.ubuntu.com/tutorial/install-a-local-kubernetes-with-microk8s#0) on your laptop at no cost. If you’re on Windows or Mac you may need to follow the [Multipass](https://multipass.run/#install) guide first to get a VM with Ubuntu before you start.

![Charmed Kubernetes](./images/charmed_kubernetes.png)

## Process

To create your container registry on GitLab you will need to complete the following steps:

- Create a project
- Add a Dockerfile
- Enable Container Registry
- Build our image
- Push our image
- Create a token
- Pull our image

These steps will create a private registry, but you can use them as a guide for a public registry, just miss the deployment token steps.

## Choose or create a project
Duration: 3

To begin with, you can use an existing project or create a new one. I will be creating a new project called `gitlabregistries`, for the purposes of experimentation, you will create a private project.

![Creating a gitlab project](./images/create_project.png)

Grab the git repository address and clone the repository to a directory of your choice.

![Cloning the repo via ssh](./images/gl_ssh.png)

## Create the docker file

Firstly, get a terminal inside of the newly cloned directory:

![Terminal on open on the repository](./images/repo_terminal.png)

To set up our shell project, you are going to do two things: create the dockerfile and add a small program to show that our image has deployed to Kubernetes.

Let's start with the program:

```
vi main.py
```

Add these lines to the new file:

```
import time


def main():
    while True:
       print("Ubuntu runs containers!")
       time.sleep(5)


 if __name__ == "__main__":
     main()

```
Now that is done you can move onto the Dockerfile:

```
vi Dockerfile
```

Add these lines:

```
FROM ubuntu:latest
RUN apt-get update && apt-get -y install python3
COPY ./ /opt/vb
CMD [“python3”, “/opt/vb/main.py”]
```

You can now build our container, but before this you need to enable container registries on Gitlab and grab the URL. Here we have a screenshot of an already enabled projected, but you can find the settings to enable in **Settings > General > Visibility, project features, permissions** and press the expand button.

![Gitlab visibility and permission settings](./images/gl_settings.png)

## Build our container
Duration: 5

The command here to build can be copied and used in your terminal:
```
docker build -t registry.gitlab.com/<YOUR_USERNAME>/gitlabregistries .
```
Before you can push to the repository you need to login to docker:
```
docker login registry.gitlab.com -u <USERNAME>
```
You should see a message similar to this if the login was successful:

![Successful login](./images/successful_login.png)

## Push our container
Duration: 5

We can then push to our project’s repository:
```
docker push registry.gitlab.com/<YOUR_USERNAME>/gitlabregistries
```
## Pull our container
Duration: 10
### Create a token

Before you can pull from the private repository a secret for Kubernetes needs to be created to allow pulling:

In this case I have used the username `k8s`, take note of the token, and following the [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials), you can create a new secret:

```
kubectl create secret docker-registry regcred --docker-server=registry.gitlab.com --docker-username=k8s --docker-password=<token>
```

Run `kubectl get secret regcred` just to check, mine looks like this:

```
apiVersion: v1
data:
  .dockerconfigjson: eyJhdXRocyI6eyJyZWdpc3RyeS5naXRsYWIuY29tIjp7InVzZXJuYW1lIjoiazhzIiwicGFzc3dvcmQiOiJ6enJQNk0zUEJkX0tuZE5INmt1cCIsImF1dGgiOiJhemh6T25wNmNsQTJUVE5RUW1SZlMyNWtUa2cyYTNWdyJ9fX0=
kind: Secret
metadata:
  creationTimestamp: "2019-08-30T13:55:11Z"
  name: regcred
  namespace: default
  resourceVersion: "19552"
  selfLink: /api/v1/namespaces/default/secrets/regcred
  uid: be61c809-1572-431f-8a73-43c80e934923
type: kubernetes.io/dockerconfigjson
```

Now you can create a deployment with our newly uploaded container image:

```
kubectl create deployment gitlabrepositories --image=registry.gitlab.com/<YOUR_USERNAME>/gitlabregistries
```

Now wait for it to come up:

```
watch kubectl get pods
```

Initially, Kubernetes will fail to pull the image, and you should see something like this:

```
gitlabrepositories-86d4b9bf87-q86rx   0/1     ImagePullBackOff    0          3m39s
```

This is because there's no secret, you need to edit the deployment:

```
kubectl edit deployment gitlabrepositories
```

Under the `containers` spec you need to add `imagePullSecrets` so that it looks something like this:
```
     spec:
       containers:
       - image: registry.gitlab.com/variabledeclared/gitlabregistries
         imagePullPolicy: Always
         name: gitlabregistries
         resources: {}
         terminationMessagePath: /dev/termination-log
         terminationMessagePolicy: File
       dnsPolicy: ClusterFirst
       imagePullSecrets:
       - name: regcred
```

Check the pods again, your container should now have started.

If your pod has started then let's check the logs for logging!

```
kubectl logs -f <YOUR_POD_NAME>
```

Hmm, there seems to be a problem:

![No logging on the pod](./images/no_logging.png)

I forgot something! But that’s fine because you have a (semi) automatic process setup now. Let's go into the docker file and add this line just before `CMD`:

```
ENV PYTHONUNBUFFERED=0
```

Rebuild:

```
docker build -t registry.gitlab.com/<YOUR_USERNAME>/gitlabregistries:v1 .
```

Push:

```
docker push registry.gitlab.com/variabledeclared/gitlabregistries:v1
```

And update our deployment with the new image tag:
```
   spec:
       containers:
       - image: registry.gitlab.com/variabledeclared/gitlabregistries:v1
         imagePullPolicy: Always
         name: gitlabregistries
         resources: {}
         terminationMessagePath: /dev/termination-log
         terminationMessagePolicy: File
       dnsPolicy: ClusterFirst
       imagePullSecrets:
       - name: regcred
       restartPolicy: Always
       schedulerName: default-scheduler
       securityContext: {}
      terminationGracePeriodSeconds: 30
```
OK lets check the logs now:

![Program is logging](./images/logging_screenshot.png)

Voila!

## That's all folks!

In this tutorial you learnt how to use GitLab as a container repository, albeit with some human labour involved. You can checkout GitLab’s documentation on how to take your newly learned skills and apply them to your own CI/CD or create one in GitLab.

If you don’t wish to use a private repository then you can use these steps as a guide, ignoring the generate token steps.

### Where to go from here?

- [GitLab's CI/CD Docs](https://docs.gitlab.com/ee/ci/README.html)
- [Explore MicroK8s](https://microk8s.io/)
- [Report a bug in MicroK8s](https://github.com/ubuntu/microk8s/issues)
- [Try Charmed Kubernetes](https://jaas.ai/kubernetes)
- [Get in touch with Canonical](https://ubuntu.com/contact-us/form?product=generic-contact-us)
