---
id: tutorial-charm-development-part1
summary: Get started with Python 3 charm development with our guide to creating, building and deploying your first charm.
categories: cloud, development
tags: tutorial,juju,charm,development
difficulty: 4
status: published
published: 2018-06-22
author: Erik Lönroth <webteam@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Juju Charm development (part 1)
Duration: 0:05

## What is a charm?


A *charm* is the user-installable component at the heart of [Juju][juju-link]. It contains a sets of scripts that simplify both the deployment and management of the charm's application within Juju. The [charm store][charm-store] lists hundreds of recommended charms, from [Postgresql][charm-postgres] to [Kubernetes][charm-k8s] alongside of hundreds more created by the community. 

This guide will go through the first basic concepts of charm development, using Python 3 as the scripting language. Two further tutorials build on these foundations to create a fully fledged charm.

![The Juju charm store](./images/01_charm-store.png)

## What you will learn
Duration: 05:00

In this first charm development tutorial, we will cover:

* Preparing and setup of a basic workbench
* Creating the example charm with *charm tools*
* Understanding the anatomy of a charm (files and directories)
* Validating and building the charm
* Adding functionality via a secondary layer (layer:apt)
* Deploying the example charm with Juju

positive
: This guide is aimed at people running the latest [Ubuntu LTS][ubuntu-lts] release who are familiar with the Linux and Juju environments and are comfortable scripting or coding their own solutions.

## Initial setup
Duration: 2:00

We're going to create a basic software stack we'll call a *workbench* to build charms. This is what a typical workbench consists of:

- **A Juju controller**: We'll use this to deploy developed charms to. See [Getting started with Juju][getting-started] for more details.
- **Python 3.x**: We use python 3 in this tutorial to develop our charm.
- **Charm Tools**: Used to create skeleton charms and build, fetch and test charms. See the [Charm Tools page][charm-tools] for installation instructions.

Start by creating three directories for our build environment:

```bash
mkdir -p ~/charms
mkdir -p ~/charms/layers
mkdir -p ~/charms/interfaces
```

Add the following environment variables to your `~/.bashrc` file:

```bash
export JUJU_REPOSITORY=$HOME/charms
export LAYER_PATH=$JUJU_REPOSITORY/layers
export INTERFACE_PATH=$JUJU_REPOSITORY/interface
```

Finally, *source* your ~/.bashrc to get the environment properly setup.

```bash
source ~/.bashrc
```

## Create an example charm
Duration: 5:00

The *Charm tools* package exists to simplify the creation of new charms. Let's start a new charm that we'll name `layer-example`:

```bash
cd ~/charms/layers
charm create layer-example
```

Great work, lets move on to what a charm consists of.

### The anatomy of a charm

A bare minimum charm consists of a directory with the charm name and two files, `layers.yaml` and `metadata.yaml`. These are the only elements that are strictly required for a charm to be valid. We do, however, normally create a directory called `reactive` which should contain a Python module with the same name as our charm. This was done automatically when we ran 'charm create layer-example' above.

Let's examine what was created by the *charm* command:

```no-highlight
layer-example
├── config.yaml             <-- Configuration options for our charm/layer.
├── icon.svg                <-- A nice icon for our charm.
├── layer.yaml              <-- The layers and interfaces we include.
├── metadata.yaml           <-- Information about our charm
├── reactive                <-- Needed for all reactive charms
│   └── layer_example.py    <-- The charm code
├── README.ex               <-- README
└── tests                   <-- Tests goes in here
    ├── 00-setup            <-- A skeleton setup test
    └── 10-deploy           <-- A skeleton deploy test
```

positive
: Prefixing the charm directory name with *layer-* is a naming convention. It tells us that this charm is a *reactive* charm.

## Validating the charm
Duration: 10:00

If we were to build our charm now, it would fail because it's created with defaults. We can see this by running "charm proof" to validate our charm structure:

```bash
cd ~/charms/layers
charm proof layer-example
```

The output to the above will look something like the following:

```no-highlight
I: Includes template icon.svg file.
I: no hooks directory
W: no copyright file
W: Includes template README.ex file
W: README.ex includes boilerplate: Step by step instructions on using the charm:
W: README.ex includes boilerplate: You can then browse to http://ip-address to configure the service.
W: README.ex includes boilerplate: - Upstream mailing list or contact information
W: README.ex includes boilerplate: - Feel free to add things if it's useful for users
E: template interface names should be changed: interface-name
I: relation provides-relation has no hooks
E: template interface names should be changed: interface-name
I: relation requires-relation has no hooks
E: template interface names should be changed: interface-name
I: relation peer-relation has no hooks
I: missing recommended hook install
I: missing recommended hook start
I: missing recommended hook stop
I: missing recommended hook config-changed
```

Let's get rid of these `E: errors` by editing the following files:

**layer-example/layer.yaml** (always include 'layer:basic'):

```yaml
includes:
  - 'layer:basic'
```

**layer-example/metadata.yaml**:
```yaml
name: example
summary: A very basic example charm
maintainer: Your Name <your.name@mail.com>
description: |
  This is a charm I built as part of my beginner charming tutorial.
tags:
  - misc
  - tutorials
```

**layer-example/reactive/layer_example.py**:

```python
from charms.reactive import when, when_not, set_state

@when_not('example.installed')
def install_example():
    set_flag('example.installed')
```

With those files edited as above, we can now move on to building our charm.

## Build the example charm
Duration: 05:00

We are now ready to build our charm. Start by entering the following:


```bash
cd ~/charms/layers
charm build layer-example
```

This will generate output similar to this:

```no-highlight
build: Composing into /home/erik/charms
build: Destination charm directory: /home/erik/charms/trusty/example
build: Please add a `repo` key to your layer.yaml, with a url from which your layer can be cloned.
build: Processing layer: layer:basic
build: Processing layer: example (from layer-example)
proof: I: Includes template icon.svg file.
proof: W: Includes template README.ex file
proof: W: README.ex includes boilerplate: Step by step instructions on using the charm:
proof: W: README.ex includes boilerplate: You can then browse to http://ip-address to configure the service.
proof: W: README.ex includes boilerplate: - Upstream mailing list or contact information
proof: W: README.ex includes boilerplate: - Feel free to add things if it's useful for users
proof: I: all charms should provide at least one thing
```

Great work! Your charm has been assembled and placed in the `$JUJU_REPOSITORY/trusty/example` directory. Go ahead and take a look in to it before we move on.

## Add functionality with layers
Duration: 10:00

Our example charm isn't really doing anything fun yet. Let's update it to install the *hello* package and set a `Hello World` message for Juju once it's done.

Installing packages is a very common charm requirement and *[layer:apt]* has all the functionality we need for installing packages from *apt* repositories. We'll now use apt to install the [hello][hello-apt] package.

Modify the **~/charms/layers/layer-example/layer.yaml** to look like this:

```yaml
includes: 
  - 'layer:basic'
  - 'layer:apt'
options:
  apt:
    packages:
     - hello
```

Modify **~/charms/layers/layer-example/reactive/layer_example.py** to look like this:

```python
from charms.reactive import set_flag, when, when_not
from charmhelpers.core.hookenv import application_version_set, status_set
from charmhelpers.fetch import get_upstream_version
import subprocess as sp

@when_not('example.installed')
def install_example():
    set_flag('example.installed')

@when('apt.installed.hello')
def set_message_hello():
    # Set the upstream version of hello for juju status.
    application_version_set(get_upstream_version('hello'))

    # Run hello and get the message
    message = sp.check_output('hello', stderr=sp.STDOUT)

    # Set the active status with the message
    status_set('active', message )

    # Signal that we know the version of hello
    set_flag('hello.version.set')
```

Let's build again with our changes.

```bash
cd ~/charms/layers/
charm build layer-example
```

The charm will now be built and the final charm assembled, ending up in `~/charms/layers/trusty/examplee`.

We can now deploy it with Juju:

```bash
juju deploy example
```

After some time, `juju status` will show the "Hello World" message.

Congratulations, you have just created and deployed your first charm!

## Next steps
Duration: 05:00

### Layers versus charms

One way of thinking about layers in relation to charms, is in terms of libraries or modules. A compilation of layers results in a charm that can be deployed by the Juju engine.

There are a lot of layers included in the charm tools and you can find them in the [layer index][layer-index] that we will cover in the next part of the tutorial.

### How to think about 'Reactive programming'

Most programmers expect their applications to run from a clear *main()* starting point and to move on, step-by-step, towards an exit. Reactive programming is 'somewhat' different in how you plan the execution sequence.

In reactive programming, a good way of thinking about your program is that it has many *main()* entry points. Which of these is executed, and when, depends on how you act on the different states/flags communicated to you by the Juju engine. 

The principle is that the Juju engine sends signals to your application, and you write code/functions to act on this information. Your code then raises new flags/states to communicate with the rest of the system.

This is what the `@when(some.flag.raised)` decorators are all about.

<!-- LINKS -->

[juju-link]: https://jujucharms.com/home
[charm-postgres]: https://jujucharms.com/postgresql/175
[charm-k8s]: https://jujucharms.com/canonical-kubernetes/bundle/206
[charm-store]: https://jujucharms.com/q/?type=charm
[charm-tools]: https://github.com/juju/charm-tools
[ubuntu-lts]: https://wiki.ubuntu.com/LTS
[getting-started]: https://docs.jujucharms.com/getting-started
[layer-index]: https://github.com/juju/layer-index/
[layer:apt]: https://git.launchpad.net/layer-apt/tree/README.md
[hello-apt]: https://launchpad.net/ubuntu/+source/hello
