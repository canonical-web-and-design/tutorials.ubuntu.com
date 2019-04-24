---
id: introduction-to-lxd-projects
summary: An introduction to the projects feature in LXD
categories: containers
tags: tutorial,desktop,server,lxd,lxc,projects
difficulty: 3
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2019-04-24
author: Thomas Parrott <thomas.parrott@canonical.com>

---

# Introduction to LXD projects

## Overview
Duration: 2:00

[LXD](https://linuxcontainers.org/lxd) is a container hypervisor providing a REST API to manage LXC containers.
It provides a virtual machine like experience without incurring the overhead of a traditional hypervisor.


![logo](images/containers.png)

However when you are managing lots of containers providing different services, it can become confusing to see which containers are dependent on each other.

The projects feature is designed to help in this situation by providing the ability to group one or more containers together into related "projects" that can be used with the `lxc` tool.

This tutorial will show how to create LXD projects, add containers into a project and explore the features that can be specified at a project level.

### Requirements

  - LXD snap installed and running (although we will cover this briefly if not)
  - You should know how to create and launch a LXD container

## Installing LXD Snap
Duration: 3:00

We will need LXD installed and running before we can use it to create a project.

The easiest way to stay up to date with LXD is to use the Snap package.

We can install LXD using Snap as follows:

```bash
snap install lxd
```

If you are running Ubuntu 18.04 LTS or earlier then you may already have LXD installed as an apt package.

You can migrate your containers to the newer Snap package and remove the old packages by running:

```bash
lxd.migrate -yes
```

If this is the first time you have used LXD, then you also need to initialise it.

positive
: You can run `lxd init` without the `--auto` flag if you want to answer a series of questions about how it should be setup. Otherwise if you want to accept the defaults then `lxd init --auto` will do.

```bash
lxd init --auto
```

Lets check that LXD is working by running:

```bash
lxc ls
```

If you don't get any errors, then we can move onto the next step!

positive
: Note: If you already had LXD installed you may need to logout and log back in again for the `lxc` command to recognise the new Snap package.

## Creating our first project
Duration: 3:00

Imagine we have a scenario where we are setting up a web site for a particular client.
We want to create two containers; one for the web service and one for the database service.
Because we have lots of different web sites for different clients we want to ensure that we can quickly see and manage all of the containers for this particular web site.

Projects help us in this situation because we can create a project called `client-website` and add the containers to it that are related to providing the client's web site.

```bash
lxc project create client-website -c features.images=false -c features.profiles=false
```

In the above command we have passed the `-c features.images=false` and `-c features.profiles=false` flags so that our new project will still use the images and profiles of the `default` project and will not namespace them (we'll come onto that some more later in the tutorial).

Now we switch the `lxc` tool into that project.

```bash
lxc project switch client-website
```

Let's check that we have switched to the new empty project:

```bash
lxc ls
```

We would expect to see an empty list at this point.

## Creating containers in our project
Duration: 2:00

Now that we have an empty project, we can go ahead and create our two containers (the web server and the database server).

```bash
lxc launch ubuntu:18.04 webserver
lxc launch ubuntu:18.04 dbserver
```

Lets check we now have those containers created:

```bash
lxc ls
```

We should expect to see output similar to this:

```bash
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
|   NAME    |  STATE  |         IPV4         |                     IPV6                      |    TYPE    | SNAPSHOTS |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
| dbserver  | RUNNING | 10.140.78.128 (eth0) | fd42:bc8c:c2b1:32fa:216:3eff:feb8:2bec (eth0) | PERSISTENT |           |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
| webserver | RUNNING | 10.140.78.202 (eth0) | fd42:bc8c:c2b1:32fa:216:3eff:fea5:e8a9 (eth0) | PERSISTENT |           |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
```

## Listing projects
Duration: 02:00

Sometimes you don't know which project you want to work in, so LXD allows you to list the projects we have.

Lets list our projects so that we can see our `client-website` project in relation to the `default` project:

```bash
lxc project ls
```

You should see output that looks like this:

```bash
+--------------------------+--------+----------+---------+
|           NAME           | IMAGES | PROFILES | USED BY |
+--------------------------+--------+----------+---------+
| client-website (current) | NO     | NO       | 2       |
+--------------------------+--------+----------+---------+
| default                  | YES    | YES      | 4       |
+--------------------------+--------+----------+---------+
```

positive
: You can see the current project you are switched to as it has `(current)` after its name.
The `default` project is the project that LXD uses normally for resources (containers, profiles, images) that don't belong to any other project.

## Listing containers in a project
Duration: 5:00

At this point lets reflect on how our project behaves in relation to the other projects by experimenting with ways we can list the containers within them.

Let's switch back to the `default` project (this is the project that LXD uses normally).

```bash
lxc project switch default
```

To prove that we can create a container of the same name as one in another project, lets create another `webserver` container:

```bash
lxc launch ubuntu:18.04 webserver
```

Now lets list our containers in the current `default` project:

```bash
lxc ls
```

You should expect to see a list of all of your existing containers, including the `webserver` we just created. 
Importantly, however, the list should not contain the two `client-website` containers we created earlier.

```bash
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
|   NAME    |  STATE  |         IPV4         |                     IPV6                      |    TYPE    | SNAPSHOTS |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
| tutorials | RUNNING | 172.17.0.1 (docker0) | fd42:bc8c:c2b1:32fa:216:3eff:fec4:1b34 (eth0) | PERSISTENT |           |
|           |         | 10.140.78.67 (eth0)  |                                               |            |           |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
| webserver | RUNNING | 10.140.78.34 (eth0)  | fd42:bc8c:c2b1:32fa:216:3eff:fea9:5ea (eth0)  | PERSISTENT |           |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
```

Now lets list the containers in our `client-website` project, but without switching into it.

```bash
lxc ls --project client-website
```

This should give you the output:

```bash
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
|   NAME    |  STATE  |         IPV4         |                     IPV6                      |    TYPE    | SNAPSHOTS |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
| dbserver  | RUNNING | 10.140.78.128 (eth0) | fd42:bc8c:c2b1:32fa:216:3eff:feb8:2bec (eth0) | PERSISTENT |           |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
| webserver | RUNNING | 10.140.78.202 (eth0) | fd42:bc8c:c2b1:32fa:216:3eff:fea5:e8a9 (eth0) | PERSISTENT |           |
+-----------+---------+----------------------+-----------------------------------------------+------------+-----------+
```

You can see that we now have 2 containers called `webserver`, but with different IP addresses and inside different projects.

## Creating further isolated projects
Duration: 5:00

So far we have created a project that allowed containers of the same name to be created in different projects.

However both the `default` and `client-website` projects shared the same profiles and image libraries.

This means that the the `default` profile in `client-website` project is the same as the `default` profile in the `default` project.

But there are scenarios where we may want to further isolate a project such that profile and image names are not shared beyond it.

### A new client project

Lets imagine we have now taken on a new client and we need to create a new project for them.
However this client requires a different network configuration than the previous client required.

We could create a new global profile called `client2-default` with the required networking configuration and then assign that profile to the containers in this new project.

However this would mean that the `client2-default` profile would be accessible to all containers that shared the `default` project (including our previously created `client-website` project). This would be confusing.

Instead, lets create a new project called `client2-website`, but this time specify that it should not share the `default` project's profiles and image library.

```bash
lxc project create client2-website -c features.images=true -c features.profiles=true
```

This is equivalent to running just:

```bash
lxc project create client2-website
```

Now lets create a container in the new project:

```bash
lxc launch ubuntu:18.04 webserver --project client2-website
```

positive
: Note: We are using the `--project` flag on the `lxc launch` command to save switching into the new project. 

Oops! Something went wrong though, you will get this output:

```
Creating webserver
Error: Failed container creation: Create container: Create LXC container: Invalid devices: Detect root disk device: No root device could be found
```

Continue to the next step to find out what is going wrong!

## Setting up a new project profile
Duration: 5:00

In the last step we created a new isolated project and then tried to create a new container inside it.
Unfortunately we were unable to because we got a `No root device could be found` error.
This is because the default profile within the new project has not been configured yet.

Lets do so now...

### Comparing profiles

First, we can compare the `default` profile from our `default` project:

```bash
lxc profile show default --project default
```

```bash
config: {}
description: Default LXD profile
devices:
  eth0:
    name: eth0
    nictype: bridged
    parent: lxdbr0
    type: nic
  root:
    path: /
    pool: default
    type: disk
name: default
used_by:
- /1.0/containers/tutorials
- /1.0/containers/webserver?project=client-website
- /1.0/containers/dbserver?project=client-website
- /1.0/containers/webserver
```

With the `default` profile in the `client2-website` project:

```bash
lxc profile show default --project client2-website
```

```bash
config: {}
description: Default LXD profile for project client2-website
devices: {}
name: default
used_by: []
```

We can see that the missing configuration is for the `devices` section, specifically the `nic` and `disk` devices.

### Creating the disk device

Lets add a `root` disk device sharing the global `default` storage pool:

```bash
lxc profile device add default root disk path=/ pool=default --project client2-website
```

### Creating the nic device

Next we add an `eth0` nic device to the default profile:

```bash
lxc profile device add default eth0 nic name=eth0 nictype=p2p --project client2-website
```

positive
: Note: We have changed the networking config for this nic device to be p2p rather than bridge to demonstrate the ability to have different `default` profiles in separate projects.


### Create the containers

Now lets try again to create the containers for this project:

```bash
lxc launch ubuntu:18.04 webserver --project client2-website
lxc launch ubuntu:18.04 dbserver --project client2-website
```

And check they are created:

```bash
lxc ls --project client2-website
```

```bash
+-----------+---------+------+------+------------+-----------+
|   NAME    |  STATE  | IPV4 | IPV6 |    TYPE    | SNAPSHOTS |
+-----------+---------+------+------+------------+-----------+
| dbserver  | RUNNING |      |      | PERSISTENT |           |
+-----------+---------+------+------+------------+-----------+
| webserver | RUNNING |      |      | PERSISTENT |           |
+-----------+---------+------+------+------------+-----------+
```

## Moving containers between projects
Duration: 03:00

So far we have seen how containers can be grouped together and isolated to varying levels.

The last feature we can explore is how to move a container from one project to another.

Lets move the `dbserver` from `client-website` project into the `client2-website` project.

```bash
lxc move dbserver dbserver --project client-website --target-project client2-website
```

But we have got an error again:

```bash
Error: Add container info to the database: This container already exists
```

This is because you cannot have 2 containers with the same name existing in the same project, and we already have a container called `dbserver` in project `client2-website`.

There are two courses of action here; either delete the existing `dbserver` container, or move the container into the project using a different name.

We'll choose the latter option in this tutorial.

```bash
lxc move dbserver dbserver2 --project client-website --target-project client2-website
```

Now lets confirm that the container has been moved:

```bash
lxc ls --project client2-website
```

```bash
+-----------+---------+------+------+------------+-----------+
|   NAME    |  STATE  | IPV4 | IPV6 |    TYPE    | SNAPSHOTS |
+-----------+---------+------+------+------------+-----------+
| dbserver  | RUNNING |      |      | PERSISTENT |           |
+-----------+---------+------+------+------------+-----------+
| dbserver2 | STOPPED |      |      | PERSISTENT |           |
+-----------+---------+------+------+------------+-----------+
| webserver | RUNNING |      |      | PERSISTENT |           |
+-----------+---------+------+------+------------+-----------+
```

## Clearing up
Duration: 03:00

As a final task, lets clean up the containers and projects we created.

You cannot remove a project that is in use, so we need to remove the containers and images first.

```bash
lxc delete dbserver -f --project client2-website
lxc delete dbserver2 -f --project client2-website
lxc delete webserver -f --project client2-website
```

We also need to delete any images created in the project:

```bash
lxc image list --project client2-website
```

For each image do:

```bash
lxc image delete <fingerprint> --project client2-website
```

Then delete the project

```
lxc project delete client2-website
```

Repeat these steps for the `client-website` project.


## That’s all!

Now we have seen how to create LXD projects and use them to group containers.

If you’d like to know more about LXD, take a look at the following resources:

* [LXD web site] (https://linuxcontainers.org/lxd)
* [LXD documentation in the source tree](https://github.com/lxc/lxd/tree/master/doc)

Also, if you have questions or need help, you can find direct help here:

* [Linux Containers forum](https://discuss.linuxcontainers.org/)
* [Ask Ubuntu](https://askubuntu.com/)
* The `#lxcontainers` IRC channel on Freenode
