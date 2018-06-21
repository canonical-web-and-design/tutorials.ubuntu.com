---
id: advanced-snap-usage
summary: Learn advanced techniques and features of snapd. What happens when installing a snap, how to access service logs and configure snaps, connect interfaces and change confinement modes? We’ll detail it all and even more here for you!
categories: packaging
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: snap, usage, classic, devmode, classic, confinement, service, log, interface, configuration, hook, file system
difficulty: 3
published: 2017-04-07
author: Didier Roche <didier.roche@canonical.com>

---

# Advanced snap usage

## Introduction
Duration: 1:00

Now that you understand how to deal with the basics of snaps, its philosophy, core purposes and features, it’s time to dig a little bit further!

### What you’ll learn
  - What are snap installation transactions, how to track them, abort…
  - How to download and install manually a local snap to understand snap assertions.
  - Listing available interfaces on your system and how to connect snaps to those interfaces. What is devmode for snaps or a classic snap.
  - Making snaps available or disabled on a system. What this means for services and how to check their status through service logs.
  - Managing snap configurations.
  - What paths are writable by a snap.
  - Finally some more small tips and snapd tricks for you!

If this looks like a long list to you, you will find that you are going to get through it in a breeze. All of the above is very easy to do thanks to the simplicity of the snap command line interface.

### What you’ll need
  - Any supported GNU/Linux distribution with snap installed.
  - Some very basic knowledge of command line usage.
  - We expect you to know how to install snaps, what they are and the core snapd notions we are going to use. The “[basic snap usage]” tutorial is a good introduction to this.

This tutorial is focused on advanced usages of the snap command.



Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient


## Tracking and actioning on snap installation
Duration: 7:00

In a far far far distant past, you did install some snaps without understanding what was exactly happening. After this section, snap installation won’t have any secrets for you!

### Let’s log in!

But first, let’s make your life easier. Remember that for every snap commands like install, refresh, remove, revert, we needed to use `sudo` on our system?
This is because you need to prove you have system snap modification rights on your machine. You can put your user in the ultra restricted circle of snap administrators on your system by logging in.

For this, just create a snap account if you don’t have one already on [https://login.ubuntu.com/]. Take the time to do this, we’ll wait!

Ok, done? Now let’s log in via this account:


```bash
$ sudo snap login
Email address: your@email.com
Password of "your@email.com":
Login successful
```

You are then done! Snap commands won’t need `sudo` anymore for the current user. You have administrative rights on your machine. Of course, a simple `snap logout` will log the current user out.


positive
: Note: another huge advantage of being logged in on your system is that you get access to your private snaps. Indeed, developers can have snaps published only for their own account or shared with a small group of people, for beta-testing for instance. Being logged in give this fine-grained access that wouldn’t be possible without authentication.

### It all starts with a transaction

Let’s install the `chuck-norris-webserver` snap. For people following the developer-focused snapcraft tutorials, this is one of the snaps we use in many of them! Indeed, there is some coherence between the tutorials we write, that’s the proof! (at least, we try!) :)

```bash
$ snap install chuck-norris-webserver
chuck-norris-webserver (stable) 1.0 from 'didrocks' installed
```

It sounds trivial, but actually many small steps are happening (you probably saw the download part, but also other messages replacing each other until the final installation message).

Let’s decipher those steps! But for this, we need to remove the snap:

```bash
$ snap remove chuck-norris-webserver
chuck-norris-webserver removed
```

#### Cancelling an installation

Let’s try to reinstall it, but cancel it right away with Ctrl+C:


```bash
$ snap install chuck-norris-webserver
chuck-norris-webserver 2.03 MB / 13.10 MB [=====>------------------] 21.24% 1.75 MB/s 14
[Press Ctrl+C]
error: cannot perform the following tasks: - Download snap "chuck-norris-webserver" (10) from channel "stable" (net/http: request canceled)
```

We did interrupt `chuck-norris-webserver` installation while it was downloading (or at any later step). The printed error confirms this to us. Snapd thus cancelled the whole installation transaction, letting your system in the same state as it was before.

Exactly the same? Not totally true: we fortunately have some logs to know what happened on the system. Those are accessible when running `snap changes`:

```bash
$ snap changes
ID   Status  Spawn                 Ready                 Summary
237  Done    2017-02-27T12:08:39Z  2017-02-27T12:08:39Z  Refresh all snaps: no updates
238  Done    2017-02-27T13:34:38Z  -                     Install "chuck-norris-webserver" snap
239  Done    2017-02-27T13:35:48Z  -                     Remove "chuck-norris-webserver" snap
240  Error   2017-02-27T13:39:58Z  -                     Install "chuck-norris-webserver" snap
```

The last line shows us clearly that the transaction **Install “chuck-norris-webserver” snap** errored out.
Note that the status was “Doing” while the transaction was happening (just before we did press Ctrl+C). If we ran snap changes at the time, we would have got:

```bash
$ snap changes
ID   Status  Spawn                 Ready                 Summary
237  Done    2017-02-27T12:08:39Z  2017-02-27T12:08:39Z  Refresh all snaps: no updates
238  Done    2017-02-27T13:34:38Z  -                     Install "chuck-norris-webserver" snap
239  Done    2017-02-27T13:35:48Z  -                     Remove "chuck-norris-webserver" snap
240  Doing   2017-02-27T13:39:30Z  -                     Install "chuck-norris-webserver" snap
```

`snap changes` enables us to display a summary of the recent system changes performed. We can of course dig into more details!

#### Getting details on a transaction

Note that our transaction has an ID. In the above case, it’s **240**. We can see what the transaction was supposed to run, and what failed by issuing the following command:

```bash
$ snap change 240
Status  Spawn                 Ready                 Summary
Error   2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Download snap "chuck-norris-webserver" (10) from channel "stable"
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Fetch and check assertions for snap "chuck-norris-webserver" (10)
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Mount snap "chuck-norris-webserver" (10)
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Copy snap "chuck-norris-webserver" data
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Setup snap "chuck-norris-webserver" (10) security profiles
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Make snap "chuck-norris-webserver" (10) available to the system
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Set automatic aliases for snap "chuck-norris-webserver"
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Setup snap "chuck-norris-webserver" aliases
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Start snap "chuck-norris-webserver" (10) services
Hold    2017-02-27T13:39:58Z  2017-02-27T13:40:04Z  Run configure hook of "chuck-norris-webserver" snap if present
```
We are getting the detail of every single step that would have proceeded, with their time and status. We note here that the first step, `Download snap "chuck-norris-webserver" (10) from channel "stable"` has errored out, and this is what cancelled this whole transaction, putting all other steps on hold.

We’ll detail every steps in details just a few sections later, but first, let’s use at our advantage this transaction ID!

#### Modifying a running transaction

For very long transactions (mostly due to a long download time), we have other options than just sitting on our main terminal running the command. For this, we’ll leverage our transaction ID again.

It’s easy to check the progress of a running transaction from another terminal with `snap watch` (let’s assume transaction #240 is still running on our system):

```bash
$ snap watch 240
chuck-norris-webserver 2.03 MB / 13.10 MB [=====>------------------] 21.24% 1.75 MB/s 14
[…]
```

We would get a real time update, as if we had the command running on this terminal.

We can as well abort a transaction, as we did with Ctrl+C (again, if transaction #240 was still running):

```bash
$ snap abort 240
```

Then, a `snap changes` or `snap change <id>` will confirm that the transaction was indeed aborted. Pretty cool, isn’t it?
### Details of a transaction
Let’s now install `chuck-norris-webserver` again and check each step.

```bash
$ snap install chuck-norris-webserver

chuck-norris-webserver (stable) 1.0 from 'didrocks' installed
$ snap change 241
Status  Spawn                 Ready                 Summary
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:39Z  Download snap "chuck-norris-webserver" (10) from channel "stable"
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:39Z  Fetch and check assertions for snap "chuck-norris-webserver" (10)
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:40Z  Mount snap "chuck-norris-webserver" (10)
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:40Z  Copy snap "chuck-norris-webserver" data
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:44Z  Setup snap "chuck-norris-webserver" (10) security profiles
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:44Z  Make snap "chuck-norris-webserver" (10) available to the system
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:44Z  Set automatic aliases for snap "chuck-norris-webserver"
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:44Z  Setup snap "chuck-norris-webserver" aliases
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:44Z  Start snap "chuck-norris-webserver" (10) services
Done    2017-02-28T12:49:19Z  2017-02-28T12:49:44Z  Run configure hook of "chuck-norris-webserver" snap if present
```



positive
: Note: this transaction was logically numbered **241** (240+1) on this system as we didn’t do any snap command that included modifications and snap refresh didn’t auto-run. However, we can always check the corresponding transaction ID with snap changes.


Here is what happens:
  - First, the snap file is of course **downloaded** from the server.
  - Then, snapd downloads and checks for **assertions**, which are basically permissions to install this snap on this device, interfaces auto-connection and availability rules and so on.
  - The mount step is an internal snapd mechanism to make the squashfs file (the snap) visible as a traditional linux directory tree structure on your system.
  - In case of an update, snapd then copies the previous versioned data files to a new directory with the new version stamp. This is to enable rollback functionality, finding back previous compatible data, untouched.
  - The security profiles are set and snapd checks which **interfaces** to connect to.
  - Then, it makes your snap available to the system (adding binaries to your $PATH and other similar operations)
  - It sets up command **aliases**.
  - **Starts** (if any) **services** defined in your snap.
  - Finally, runs the **configure** hooks if any are defined in your snap. This enables dynamic configuration of the snap services and applications.

You can see here that a lot of more advanced concepts, like interfaces, aliases, service management and configure hooks are taking places in a simple installation transaction. You may have some questions about them, and as life (and in particular, this tutorial ;)) is well done, that’s exactly what we are going to cover, one after another, in the following steps!

positive
: Note: we only mentioned the installation phase, but of course, the transactional concepts are similar while doing `refresh`, `remove` and `revert`! Installation being the most interesting one, we are covering it. You will find similar steps during the other actions.

## Download, assert and installations
Duration: 6:00


positive
: **Lost or starting from here?**
You just need to type in a terminal `snap install chuck-norris-webserver` as this is the snap we will need (not precisely for this step, but on future ones).


Once we have found a snap that is of our interest, we will most of the time just rely on `snap install` to download it from a store and get the snap digital signature proving its integrity. Those are the first steps processed on the system.


positive
: We are using the **nethack** snap, which is a command line game. We don’t use the `chuck-norris-webserver` or any snap that you may have installed to show you the assertion system.

### Downloading a snap

It sounds trivial. However, it’s important to understand exactly what is happening there. Indeed, what if your snapd platform doesn’t have access to the network, and such, to the store? Don’t sweat it! You can download the snap alongside its snap assertion (basically its signature) from the store on a connected machine with:

```bash
$ snap download nethack
Fetching snap "nethack"
Fetching assertions for "nethack"
$ ls nethack*
nethack_2.assert  nethack_2.snap
```

You have here the snap itself (**.snap file**) and its assertion companion (**.assert**). You can then move the snap (alongside its assertion) via an USB key or any other mean to your offline device to install it.

### Installing a local snap

If you just try to install this local snap (note that we point it to the filename path), you will be welcomed with a scary message:

```bash
$ snap install nethack_2.snap
error: cannot find signatures with metadata for snap "nethack_2.snap"
```

What is this? The snap system is telling you that it didn’t find any certificates (assertions) corresponding to that snap on that revision. Basically, it can’t check the snap integrity and warn you about it. The snap assertion is delivered by the store to have a secured stamp assessing that the snap origin and content haven’t been tampered with.

positive
: Note that you will only get this warning if you never installed the nethack snap at revision 2 from the store. Otherwise, you would have already been installing the corresponding assertion, even if you removed the snap afterward…


So, what to do from there?

### I’m brave (or crazy) and want to install it anyway without the assertion

First, you shouldn’t do that. Nothing ensure you that what you are installing is really what you wanted/thought you were installing. This is equivalent to accepting an invalid https certificate. Were you talking to the correct website?

However, there is one case when this is totally valid: when you are crafting your snap as a developer, and want to install it on your system to test it! Of course, you don’t have any snap assertion signatures here, but we still need to provide a mean to tell “ok, I know I have full confidence on that snap, let me go ahead”. This is done via the well-named `--dangerous` option:

```bash
$ snap install --dangerous nethack_2.snap
nethack 3.4.2-2 installed
```

it will install the given snap file even if there are no pre-acknowledged signatures for it, meaning it was not verified and could be dangerous. Note that installing a local snap with `--devmode` implies `--dangerous`  (as we will see in the next step, devmode gives every rights to the snap on the machine anyway).

Let’s remove it to do a proper install next:

```bash
$ snap remove nethack
nethack removed
```
Note that we only needed the snap name for that removal operation.

#### Import the assertion, then install

Mimicking traditional install from the store, we can manually import the downloaded assertion and then safely install the snap. This is a 2 steps process:

```bash
$ snap ack nethack_2.assert
$ snap install nethack_2.snap
nethack 3.4.2-2 from 'ogra' installed
```

And here we go, even if we remove and reinstall the nethack snap later on, the signature will already be there and be checked every time:


```bash
$ snap remove nethack
$ snap install nethack_2.snap
nethack 3.4.2-2 from 'ogra' installed
```
As you can see, the assertion is still present (for that snap and revision) on the system.

### A quick look at what an assertion is

If you open the .assert file, you will see multiple types and gpg signatures into it:

```bash
$ cat nethack_2.assert
type: account-key
authority-id: canonical
revision: 2
public-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul
account-id: canonical
name: store
since: 2016-04-01T00:00:00.0Z
body-length: 717
sign-key-sha3-384: -CvQKAwRQ5h3Ffn10FILJoEZUXOv6km9FwA80-Rcj-f-6jadQ89VRswHNiEB9Lxk

AcbBTQRWhcGAARAA0KKYYQWuHOrsFVi4p4l7ZzSvX7kLgJFFeFgOkzdWKBTHEnsMKjl5mefFe9ji
qe8NlmJdfY7BenP7XeBtwKp700H/t9lLrZbpTNAPHXYxEWFJp5bPqIcJYBZ+29oLVLN1Tc5X482R
[…]
vUvV7RjVzv17ut0AEQEAAQ==

type: account
authority-id: canonical
revision: 94
account-id: QfOqF7d2M1Pk2O0SbEKqTdB9Ry2aI0BP
display-name: Oliver Grawert
timestamp: 2016-09-19T09:07:05.497416Z
username: ogra
validation: unproven
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCV9+quQAAhF0QAEGYSyByw6zCu0UkEy0KJj456MITGlNw6V/5Xe4W3XyOXZ2n
[…]

type: snap-declaration
authority-id: canonical
revision: 4
series: 16
snap-id: i2ba1vb7DvsIzb8R987xvPGMQWNHiARe
publisher-id: QfOqF7d2M1Pk2O0SbEKqTdB9Ry2aI0BP
snap-name: nethack
timestamp: 2016-09-05T18:41:50.410382Z
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCV828bgAApasQAIdAOFB2OqlNKERYoYLGkHV9wHwuALdOpG7BIa2S5lVnSpvd
[…]

type: snap-revision
authority-id: canonical
snap-sha3-384: VnVezaVvVY43-UQ9VvRq6sYd2h8RvFmCkwE_9A5BOmU6whoRJDQsjq_gelV-I9gk
developer-id: QfOqF7d2M1Pk2O0SbEKqTdB9Ry2aI0BP
snap-id: i2ba1vb7DvsIzb8R987xvPGMQWNHiARe
snap-revision: 2
snap-size: 7569408
timestamp: 2016-08-18T21:52:32.977676Z
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCV7YuIAAA/x0QADREOwGVCfhH0CZo6QEZDYdbMa7Q1E7JiU5Kmu/91+IumAOY
[…]
```

We are not going to go into too much details, but you can see that there are different types of assertions (account-key, account, snap-declaration, snap-revision), each one with some metadata and signature.

We can see that the snap-declaration corresponds to the **snap-name** “nethack” and has as well a **snap-revision** assertion type for snap revision “2”.

You can find back those declaration stored on the system via the `snap known` command, filtering to the types of assertions and keys you want to retrieve:


```bash
$ snap known snap-declaration snap-name=nethack
type: snap-declaration
authority-id: canonical
revision: 4
series: 16
snap-id: i2ba1vb7DvsIzb8R987xvPGMQWNHiARe
publisher-id: QfOqF7d2M1Pk2O0SbEKqTdB9Ry2aI0BP
snap-name: nethack
timestamp: 2016-09-05T18:41:50.410382Z
sign-key-sha3-384: BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul

AcLBUgQAAQoABgUCV828bgAApasQAIdAOFB2OqlNKERYoYLGkHV9wHwuALdOpG7BIa2S5lVnSpvd
[…]
```

It sounds natural that this download and validation step is one of the first ones when we are installing a snap. But that’s clearly not the end of the story. The permission model and interfaces are a core concept of snaps, and that’s what we are going to look at right now!


## Handling interfaces and permissions in your snaps
Duration: 15:00

positive
: **Lost or starting from here?**
You just need to type in a terminal “`snap install chuck-norris-webserver`” as this is the snap we will need.

All snaps downloaded in the stable channel are **confined**. There is a mode, called **“devmode”** which sets the snap basically unconfined, meaning having all access to our system. Those should only be installed when you fully trust the developers, and throw away a great part of snaps security model (trustability in applications, which can’t touch or destroy parts they don’t have access to), but it can be convenient, at least for developers.

Let’s look at **interfaces** first, which are what confined snaps are using. We’ll then shortly explore **devmode** and what its implications are, before jumping to **classic** snaps.

### Interfaces

Permissions are given through one or multiple **interfaces**. The snap **plug** corresponding to that **interface** will connect to the core **slot** which declares that same **interface**. For an easy analogy, thinks of a plug as an electrical plug, slot is what you put the plug into, and the interface is the voltage amount chosen (permissions here) which will be sent over through that interface. Better for both sides to match!

### Listing interfaces

Let’s list all available interfaces on our machine:


```bash
$ snap interfaces
Slot                              Plug
:bluetooth-control                -
:browser-support                  -
:camera                           -
:cups-control                     -
:docker-support                   -
:firewall-control                 -
:fuse-support                     -
:gsettings                        -
:hardware-observe                 -
:home                             -
:kernel-module-control            -
:libvirt                          -
:locale-control                   -
:log-observe                      -
:lxd-support                      -
:modem-manager                    -
:mount-observe                    -
:network                          chuck-norris-webserver
:network-bind                     chuck-norris-webserver
:network-control                  -
:network-manager                  -
:network-observe                  -
:network-setup-observe            -
:opengl                           -
:optical-drive                    -
:ppp                              -
:process-control                  -
:pulseaudio                       -
:removable-media                  -
:screen-inhibit-control           -
:snapd-control                    -
:system-observe                   -
:system-trace                     -
:timeserver-control               -
:timezone-control                 -
:tpm                              -
:unity7                           -
:upower-observe                   -
:x11                              -
-                                 chuck-norris-webserver:camera
```

This list of interfaces evolves over time. It also depends on your hardware capabilities (the gadget snap, to be precise), which defines which additional interfaces your device can expose, like GPIO devices, camera, I2C and such…

You have the confirmation here that `chuck-norris-webserver` connects its **network-bind** plug to the **network-bind** slot from the core snap (slot, plug and interface names are abbreviated when they all match). This interface is used for the daemon to listen on a TCP port, which is kind of useful for a webserver to accept incoming requests on that port! Note that you didn’t have to do anything manually. The slot and plugs have been connected automatically.
It’s similar for the **network** interface which is needed by the command line tool to get access to the network.

On the contrary, the last line will show that the **camera** plug isn’t connected to the core **camera** slot. Indeed, some interfaces will auto-connect on install (the ones considered safe, like having access to the network), some won’t (like accessing the user’s camera). This default behavior is defined in snapd and the gadget snap of your device. You can refer to relevant tutorials on how to create a device and the gadget snap for overriding the default policy of your device.

### Let’s check that in practice!

#### Default behavior

Running the command line tool after installing the snap gives us:


```bash
$ chuck-norris-webserver.cli
FILE SYSTEM: I see from /etc/os-release that I'm running on Ubuntu Core 16.
CAMERA [FAIL]: Urgh, even Chuck doesn't have access to the camera
HOME ACCESS [FAIL]: What's happening? I can't even read your home directory.
NETWORK [OK]: Chuck Norris doesn't pair program.
```

Indeed, we got a Chuck Norris quote from the network. However, access to the camera and some files in the home directory was denied. It’s all making sense!

#### Giving access to the camera

Let’s connect our **camera plug** to the **ubuntu core slot** before rerunning the application:


```bash
$ snap connect chuck-norris-webserver:camera :camera
$ chuck-norris-webserver.cli
FILE SYSTEM: I see from /etc/os-release that I'm running on Ubuntu Core 16.
HOME ACCESS [FAIL]: What's happening? I can't even read your home directory.
CAMERA [OK]: I can see you, you should smile more!
NETWORK [OK]: No statement can catch the ChuckNorrisException.
```

Of course, we still have access to the network and the file access is a failure. However, we can see now that the camera is accessible to our command line tool! Smile ;)

We can also check that via `snap interfaces`:


```bash
$ snap interfaces
Slot                              Plug
:bluetooth-control                -
:browser-support                  -
:camera                           chuck-norris-webserver
:cups-control                     -
[…]
:mount-observe                    -
:network                          chuck-norris-webserver
:network-bind                     chuck-norris-webserver
[…]                           
```

That matches our expectations!


positive
: Note: the core snap can be abbreviated (also visible in the `snap interfaces` command) with directly using “`:<slot-name>`” instead of “`core:`<slot-name>`”.


#### Remove permissions from a snap

Disconnecting the network plug for this snap will simply be done via:


```bash
$ snap disconnect chuck-norris-webserver:network
$ chuck-norris-webserver.cli
FILE SYSTEM: I see from /etc/os-release that I'm running on Ubuntu Core 16.
NETWORK [FAIL]: I can't connect to chucknorris.io. Offering you a network-related joke then: Chuck Norris's OSI network model has only one layer - Physical.
HOME ACCESS [FAIL]: What's happening? I can't even read your home directory.
CAMERA [OK]: I can see you, you should smile more!
$ snap interfaces
[…]
-                         chuck-norris-webserver:network
```

We thus have access from the command line tool to the camera, but not to the network anymore (and still don’t have access to the home directory).

#### A note on multiple commands/services in the same snaps.

Our snap contains 2 elements: a services and a command. We just used the command here. You should know (even if you don’t plan to craft any snaps… but you should!) that a different set of interfaces can be defined for each elements.

For instance, the service and cli definition request access to different interfaces:

```bash
 node-service:
    command: bin/chuck-norris-app
    daemon: simple
    restart-condition: always
    plugs: [network-bind]
  cli:
    command: bin/chuck-norris-cli
    plugs: [network, camera]


```

The service needs to listen (and write) to the network. The **network-bind** interface is suited for this.
The command line application requests access to the **network** (as a reader, not a webserver listener) and to the user’s **camera**.

When you run snap interfaces, snap connect, snap disconnect, you only specify the snap name, meaning that it will connect/disconnect every applications from your snap which wants to use that interface.

In practice, when we did run `snap connect chuck-norris-webserver:camera :camera`, we were only giving to the command line tool (and not the service!) access to the camera. The snap system is fine-grained!

Once thing is left though, the home interface wasn’t declared for this snap. We simulate here an interface that wouldn’t exist yet and a snap needing even more access, or a snap that someone is developing, before fully confining it. How to progressively get there and disable complete confinement on a snap? This is where **devmode** is useful.

### devmode

Something to clearly understand first is that you are giving any access your user has (or root access for daemons) to any snap you are installing in devmode! You are thus warned :) It’s not something to take lightly if you are not the creator of the snap and don’t know exactly what the application is doing.

The good news is that you can’t trigger devmode without knowing it!

#### Purpose of devmode

devmode is not for devil but developer mode! I guess that states clearly that it’s for developers and beta testers that really trusts the developers.
“**devmode**” lifts all restrictions and give all access to your snap: camera, files and such, as if you were running any application as your user. This isn’t that different from installing software from anywhere which isn’t trusted (ubuntu ppa, random website) and running it straight away! However, confined snaps give you confidence in the code you are running, so take advantage of it!

#### Channel restrictions

We did put some needed restrictions so that not all snaps are published innocently in devmode. The incentive is that devmode snaps can’t be published in **stable** or **candidate** channels. They can only be found in **beta or alpha channels** (as they are for developers and testers!), and thus, aren’t listed in `snap find` by default.

#### Installing a snap in devmode

You need to explicitly declare you are installing a snap in devmode. Snaps in devmode won’t install unless the `--devmode` flag is set.

For instance, face-detection-demo, in the beta channel, is a devmode snap. You can’t install it normally:


```bash
$ snap install --beta face-detection-demo
error: snap "face-detection-demo" requires devmode or confinement override
```

And so, installing it would require:


```bash
$ snap install --devmode --beta face-detection-demo
face-detection-demo (beta) 1.0 from 'didrocks' installed
```

You can check that the snap is installed in devmode:


```bash
$ snap list
Name                    Version  Rev   Developer  Notes
[…]
face-detection-demo     1.0      52    didrocks   devmode
```

However, you can install or reinstall a confined snap in devmode easily:


```bash
$ snap remove chuck-norris-webserver
chuck-norris-webserver removed
$ snap install --devmode chuck-norris-webserver
chuck-norris-webserver (stable) 1.0 from 'didrocks' installed
$ snap list
Name                    Version  Rev   Developer  Notes
[…]
chuck-norris-webserver  1.0.0    10               devmode
```

You will notice that snap interfaces still shows the default auto-connections and permissions:


```bash
$ snap interfaces
Slot                      Plug
[…]
:camera                   -
[…]
:mount-observe            -
:network                  chuck-norris-webserver
:network-bind             chuck-norris-webserver
:network-control          -
[…]
-                         chuck-norris-webserver:camera
```

However, they don’t matter anymore, as every access is now granted to the system:


```bash
$ chuck-norris-webserver.cli
FILE SYSTEM: I see from /etc/os-release that I'm running on Ubuntu Core 16.
HOME ACCESS [OK]: My power enables me to see that you have .hidden in your home directory. I'm unstoppable!
CAMERA [OK]: I can see you, you should smile more!
NETWORK [OK]: When Chuck Norris break the build, you can't fix it, because there is not a single line of code left.
```

Even if no plug was defined to access the home directory, it will now list one of your file to prove it has access to it! Same with the non-connected camera plug, keep smiling!

This is great, but that’s not all! We need to talk about files!

### File system structures

Snaps are, at the core, relocatable: meaning they embed all needed libraries and files. Both fully confined and devmode confinement modes are not seeing the exact file system. It means that the root “**/**” file system they are seeing isn’t the one you have on your host. This “/” and everything under it is coming from the core snap we mentioned in previous tutorials. It means that if you have for instance firefox installed on your machine, the snap application will never see the firefox binaries, icons, its libraries and such. It’s like if it was running on a small virtual machine!

You probably noticed that on both confined and devmode snaps, `chuck-norris-webserver.cli` was printing “`FILE SYSTEM: I see from /etc/os-release that I'm running on Ubuntu Core 16.`”. This is the case even if you are running that on any laptop! Indeed, the `/etc/os-release` file is the one coming from the core snap.

Let’s have a look at this file on your machine:


```bash
$ cat /etc/os-release
Name="Ubuntu"
VERSION="16.04.2 LTS (Xenial Xerus)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 16.04.2 LTS"
VERSION_ID="16.04"
[…]
```

We are interesting in particular in the **PRETTY_NAME** line as this is what `chuck-norris-webserver.cli` is printing. Note that it differs!


positive
: Your `os-release` content will obviously differ between different distributions and version. Of course, if you are using Ubuntu Core, you may have the exact os-release file than in the snap as it’s using the core snap for populating “/”.

And here enters the classic snap!

### Classic snap

What if your snap can’t live in a lying world? What if it needs system on libraries that can’t be relocated? Or also, what if the developer wanted to use a transition period to move to awesome snaps as quickly as possible?

Free the snap, **Let / be /** I hear! And that’s exactly why **classic** snaps exist! A classic snap sees the real host machine world, with its system libraries, installed (or absent) packages. There is a risk of course: as with just uncompressing an archive and running its program, some dependencies may be missing and such. Also, confinement is turned off. You can really see **classic** being “non relocated devmode snaps”. Classics snap can be published in the **stable** channel, though.


positive
: Classic snaps can only be installed on a traditional desktop system, not on a headless distribution like Ubuntu Core. Those need to state clearly that they are classic snaps, and they can’t be installed in devmode or confined. Indeed, some intricacies makes the two modes (relocatable vs non relocatable) incompatible with each others.

Let’s install and run the same snap than before, but a version declaring `confinement: classic`.


```bash
$ snap install --classic chuck-norris-webserver-classic
$ chuck-norris-webserver-classic.cli
FILE SYSTEM: I see from /etc/os-release that I'm running on Ubuntu 16.04.2 LTS.
HOME ACCESS [OK]: My power enables me to see that you have .hidden in your home directory. I'm unstoppable!
CAMERA [OK]: I can see you, you should smile more!
NETWORK [OK]: When Chuck Norris break the build, you can't fix it, because there is not a single line of code left.
```

This snap confirms that it can see the original (host) file system via `FILE SYSTEM: I see from /etc/os-release that I'm running on Ubuntu 16.04.2 LTS`. Also, the snap has access to everything (network, camera, and home directory), confirming the fact that it’s an augmented devmode snap.

### The developer corner

What does it mean for developers? If you want to snap a complex application and you don’t want to dive right away into making your application relocatable, you:
  1. can start with a classic snap, which should be easy to craft.
  1. then make your snap relocatable, and include all its dependencies. You can now turn on devmode! Remember, though, that you can’t publish it to the stable channel.
  1. finally, confine your application, turn it to strict mode and publish to the stable channel!

This gives you a nice and progressive workflow.


You can remove the 2 snaps now and reinstall one of them confined with:

```bash
$ snap remove chuck-norris-webserver-classic chuck-norris-webserver
chuck-norris-webserver-classic removed
chuck-norris-webserver removed
$ snap install chuck-norris-webserver
chuck-norris-webserver (stable) 1.0 from 'didrocks' installed
```

### Closing up

A final note is that when you are connecting interfaces, those are only applied on command or service startup. You thus need to restart or relaunch a command to see those new capabilities apply. Launching a command or program is trivial. Restarting a service is a little bit more complex and that’s exactly what we are going to do next!


## Availability, logs & states in snaps & services
Duration: 6:00


positive
: **Lost or starting from here?**
You just need to type in a terminal “`snap install chuck-norris-webserver`” as this is the he snap we will need.


Before jumping right away into the logs, let’s look at snap states and availability on the system.

### Snap availability on the system

Once a snap is installed, this means:

  - the snap commands are available in the user’s `$PATH`.
  - the services included in the snap are all started. They are simply started/stopped on system startup and shutdown. Depending on their configuration, they can restart automatically in case of crashes.

Not having a command running is easy: just don’t run it or stop it if it’s already started! But what about services?

You can enable or disable snaps on the system. This means that a disabled snap won’t have any command accessible to any users on the system, nor services started at system startup. From a user perspective, it’s like the snap simply doesn’t exist. However, it’s still installed: binary files, assets and associated data are still present, and the snap is kept up to date. Making it available again is just a question of running the `enable` command. No extra download, nothing required!

The chuck norris web server is running on port 80, so heading to [http://localhost] will lead you to:

![IMAGE](https://assets.ubuntu.com/v1/3db2fc34-chuck-norris-1.png)

All of this is great! So, let’s disable it:

```bash
$ snap disable chuck-norris-webserver
chuck-norris-webserver disabled
```

Heading to [http://localhost] will now error out as no webserver is listening on port 80 anymore. Also, the command is now unavailable:

```bash
$ chuck-norris-webserver.cli
chuck-norris-webserver.cli: command not found
```

All of this is like the snap never existed on the system. Though, you can see that reenabling it is really quick:


```bash
$ snap enable chuck-norris-webserver
chuck-norris-webserver enabled
```

If you head over back to [http://localhost], you can confirm that the service is now running again. Similarly, the `chuck-norris-webserver.cli` command is also available.

This is handy, but this is all or nothing. Sometimes, we want to stop a service temporarily, without disabling entirely a snap, or restarting it and so on. We also want access to its logs. Let’s look at some service-related commands!

### Logs and temporary a service state

#### How a service file is generated

First, we need to understand that snapd is using **systemd** service management under the hood. The generated service filename that you can find in `/etc/systemd/system` is using the following convention:
“**snap.\<snap_name\>.\<app_name\>.service**”

Knowing that the service file definition in our chuck-norris-webserver snap is:


```bash
 node-service:
    command: bin/chuck-norris-app
    daemon: simple
    restart-condition: always
    plugs: [network-bind]
```

it will be named in our present case: **snap.chuck-norris-webserver.node-service.service**.

We can thus use traditional **systemd** tools, optionally omitting the final .service name, for managing it.

#### Checking service status and last logs:

`systemctl` with the `status` command gives us some hints:

```bash
$ systemctl status -l snap.chuck-norris-webserver.node-service
● snap.chuck-norris-webserver.node-service.service - Service for snap application chuck-norris-webserver.node-service
   Loaded: loaded (/etc/systemd/system/snap.chuck-norris-webserver.node-service.service; enabled; vendor preset: enabled)
   Active: active (running) since mar. 2016-11-15 14:40:11 CET; 17min ago
 Main PID: 14410 (node)
    Tasks: 9
   Memory: 10.2M
      CPU: 740ms
   CGroup: /system.slice/snap.chuck-norris-webserver.node-service.service
           └─14410 node /snap/chuck-norris-webserver/5/bin/chuck-norris-app

nov. 15 14:40:11 tidus systemd[1]: Started Service for snap application chuck-norris-webserver.node-service.
nov. 15 14:40:11 tidus snap[14410]: Server listening on: http://localhost:80
nov. 15 14:47:35 tidus snap[14410]: Quoted http://api.chucknorris.io/jokes/ijpnw0birv-ogszti_wuag
```
From the output, you can see the service has been **active** for 17 minutes, you can track its process information as well as latest logs.

#### Stopping and starting a service:

`systemctl` accepts a `stop` command. We can then check the service status:

```bash
$ sudo systemctl stop snap.chuck-norris-webserver.node-service
$ systemctl status -l snap.chuck-norris-webserver.node-service
● snap.chuck-norris-webserver.node-service.service - Service for snap application chuck-norris-webserver.node-service
   Loaded: loaded (/etc/systemd/system/snap.chuck-norris-webserver.node-service.service; enabled; vendor preset: enabled)
   Active: inactive (dead) since mar. 2016-11-15 15:03:11 CET; 33s ago
  Process: 14410 ExecStart=/usr/bin/snap run chuck-norris-webserver.node-service (code=killed, signal=TERM)
 Main PID: 14410 (code=killed, signal=TERM)

nov. 15 14:40:11 tidus systemd[1]: Started Service for snap application chuck-norris-webserver.node-service.
nov. 15 14:40:11 tidus snap[14410]: Server listening on: http://localhost:80
nov. 15 14:47:35 tidus snap[14410]: Quoted http://api.chucknorris.io/jokes/ijpnw0birv-ogszti_wuag
nov. 15 15:03:11 tidus systemd[1]: Stopping Service for snap application chuck-norris-webserver.node-service...
nov. 15 15:03:11 tidus systemd[1]: Stopped Service for snap application chuck-norris-webserver.node-service.
```

The service is enabled (it will start at next reboot), but it’s stopped (**inactive**). It got a **TERM** signal (normal stopping request that we issued via `systemctl`). We can as well see the latest log outputs from the service, which is particularly handy in case of a service crashing or misbehaving for instance.


positive
: **Small tip:** systemd default behavior will try 3 times to launch a crashing service at startup (in the very few seconds after it starts) and will give up afterwards to not overload your CPU.


Similarly to `stop`, we can use the `start` command for `systemctl` to restart it:

```bash
$ sudo systemctl start snap.chuck-norris-webserver.node-service
$ systemctl status -l snap.chuck-norris-webserver.node-service
● snap.chuck-norris-webserver.node-service.service - Service for snap application chuck-norris-webserver.node-service
   Loaded: loaded (/etc/systemd/system/snap.chuck-norris-webserver.node-service.service; enabled; vendor preset: enabled)
   Active: active (running) since mar. 2016-11-15 15:12:42 CET; 2s ago
 Main PID: 15622 (node)
    Tasks: 5
   Memory: 42.1M
      CPU: 431ms
   CGroup: /system.slice/snap.chuck-norris-webserver.node-service.service
           └─15622 node /snap/chuck-norris-webserver/5/bin/chuck-norris-app

nov. 15 15:12:42 tidus systemd[1]: Started Service for snap application chuck-norris-webserver.node-service.
nov. 15 15:12:43 tidus snap[15622]: Server listening on: http://localhost:80
```

Of course, there is a `systemctl restart` command as well!

#### Follow logs live:

We are going to use `journalctl` for this. Using the `-u` option will filter the output on a service name:

```bash
$ sudo journalctl -fu snap.chuck-norris-webserver.node-service
-- Logs begin at mer. 2016-01-13 14:59:21 CET. --
nov. 15 14:40:11 tidus snap[14410]: Server listening on: http://localhost:80
nov. 15 14:47:35 tidus snap[14410]: Quoted http://api.chucknorris.io/jokes/ijpnw0birv-ogszti_wuag
nov. 15 15:03:11 tidus systemd[1]: Stopping Service for snap application chuck-norris-webserver.node-service...
nov. 15 15:03:11 tidus systemd[1]: Stopped Service for snap application chuck-norris-webserver.node-service.
nov. 15 15:12:42 tidus systemd[1]: Started Service for snap application chuck-norris-webserver.node-service.
nov. 15 15:12:43 tidus snap[15622]: Server listening on: http://localhost:80
nov. 15 15:16:14 tidus snap[15622]: Quoted http://api.chucknorris.io/jokes/gll-vunmsluzrad8sfafwg
nov. 15 15:16:18 tidus snap[15622]: Quoted http://api.chucknorris.io/jokes/qwv-rz6xtjmhiayprtgnvw
nov. 15 15:16:20 tidus snap[15622]: Quoted http://api.chucknorris.io/jokes/ag_6paerrkg-mxfjjqw4ba
nov. 15 15:17:53 tidus snap[15622]: Quoted http://api.chucknorris.io/jokes/elgv2wkvt8ioag6xywykbq
```
You can omit `-f` to not follow the live log (meaning, new inputs are printed as they come): it will only prints messages that were already logged.


positive
: **Small tip:** sometimes, multiple services coordinate to provide a functionality, or a service impacts some system services like network-manager. To get all logs and follow them live, just don’t provide the` -u` option with the service name. For instance,` journalctl -f `will provide you all logs, lively printed, from your system, including your services.


You will note that we mostly focused on services here. As you probably know,  traditional commands only prints to stdin, stdout and stderr their own output! However, they might store their logs in writeable paths as well. We will mention them in a later step. Before going there, let’s talk about snap configuration!

## Managing snap configuration
Duration: 5:00

positive
: **Lost or starting from here?**
You just need to type in a terminal “`snap install chuck-norris-webserver`” as this is the snap we will need.

Snaps can store and manage configurations that they can use and reapply after each update.

There are a number of situations where snapd needs to notify a snap that something has happened. For example, when a snap is upgraded, it may need to run some sort of migration on the previous version's data in order to make it consumable by the new version. Or when an interface is connected or disconnected, the snap might need to obtain attributes specific to that connection. These types of situations are handled by hooks.

You will see that the notions there are really simple both from a simple user standpoint and for administrators.

### Hooks

A hook is a simple executable (it could be a shell script, a python program or a native compiled binary!) which is shipped with a snap to control easily and programmatically its behavior. It’s thus up to the snap to ship some hooks that it can manage. To be clear, if your snap doesn’t have some hook support, you can’t manage its configuration that way!

Multiple types of hooks are going to be supported by snapd.
Configure hooks
Configure hooks are one of the hook types supported by snapd. The `configure` hooks are called upon initial install, upgrade, and whenever the user requests a configuration change via the `snap set` command.

### Let’s play with this!

Let’s go back again to our famous **chuck-norris-webserver** snap! This one has a configure hook and server-side code detecting when some values are changed.

Let’s load it again first, head over to [http://localhost]:

![IMAGE](https://assets.ubuntu.com/v1/3db2fc34-chuck-norris-1.png)



Our page title is “**My local chuck norris webserver**” and the port it’s listening on it the default http port (**80**).

#### Setting one configure value

To change one of these properties, we are going to use the `snap set` command:


```bash
$ snap set chuck-norris-webserver title="I can bind Chuck Norris to my will"
```

If you refresh the page, you will see that the new configuration has been picked by the web server and is now our default title page.
Another configuration option that is available in that snap is changing the network port that the service is listening on:


```bash
$ snap set chuck-norris-webserver port=81
```

Refreshing the page will give a connection refused error, and you need to head over to [http://localhost:81] now! Notice that the modified title is still present. It means that snapd is storing any modified configuration values for us. Sweet :)
Note that you can change multiple configurations at the same time:

```bash
$ snap set chuck-norris-webserver port=82 title="My other super title"
```

In any case, `snapd` will store the configuration and run the configure hook once so that it can retrieved any configured values.
To summarize, the general syntax is:

```bash
snap set <snap-name> key1=value1 [key2=value2…]
```

positive
: **Note:** it’s up to the application/service to pick up new values dynamically and handling them. Our examples snap does that, but a lot of applications are only reading values on startup and you will need to restart the service so that they are taking effect.
For instance, chuck-norris-webserver is using the inotify kernel feature to detect and pick up any modified values.


#### Fetching modified values

You can see your current snap stored config values via:

```bash
$ snap get chuck-norris-webserver port
82
```
As with `snap set`, you can check multiple config values at once (and they will be returned in a json-style format):

```bash
$ snap get chuck-norris-webserver port title
{
	"port": 82,
	"title": "My other super title"
}
```
Fetching an unset value will result in an error:

```bash
$ snap get chuck-norris-webserver unexisting
error: snap "chuck-norris-webserver" has no "unexisting" configuration option
```

negative
: There is currently no way to list all possible accepted configuration options for a given snap.

#### Resetting configuration values

Resetting a set of configuration values to remove it from the snapd database isn’t currently available. By convention, snaps will accept a blank or no value, resetting it to its defaults.

For instance:

```bash
$ snap set chuck-norris-webserver port="" title=""
```

This will remove all configuration values, and the chuck-norris-webserver snap thus reverts to its defaults, serving on [http://localhost] (port 80) and with a default title being “My local chuck nodejs web server”. But again, that’s up to the snap application itself!

This sounds a little bit like magic and could trigger questions like “What are those hooks doing? Where do they store their information for the service to pick them up?”. And by that, we realize that there are still some unknown notions we didn’t cover yet, like, “Where do snaps can store their data?”, “How can I know where a snap is published?”, “What is its version in various channels?”. We are going to try answering this in the next step!

## And more!
Duration: 10:00


positive
: **Lost or starting from here?**
You just need to type in a terminal “`snap install chuck-norris-webserver`” as this is the snap we will need.


Here is a bag of various tricks that will turn your from a snap user to a real expert! Let’s not lose time and dive in right away!

### Snap environment variables and paths

If you remember a few sections ago, we were only able to access to the user’s home directory in **devmode** or **classic** confinement. We should have used the **home** plug to make a snap able to access and write into the user’s home directory while being confined. Indeed, by default, snaps are only able to read and write to very few paths. Those are defined through environment variables.

#### Accessible files

`snap run` is a command that runs a snap command. This is the mechanism internally used to run application snaps. When adding the `--shell` option, it will drop you into a subshell where you can act “as the command”, with the same permissions (plug), seeing the same file system it has access to:


```bash
$ snap run --shell chuck-norris-webserver.cli
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.


didrocks@tidus:/home/didrocks$ ls /
ls: cannot open directory '/': Permission denied
didrocks@tidus:/home/didrocks$ touch foo
touch: cannot touch 'foo': Permission denied
```

positive
: Of course “didrocks” is currently my user name. We keep the prompt in the subshell to highlight we are typing command there.

Ok, let’s look at what we can thus access.

#### Get access to environment variables

Rather than listing them all, let’s have a look at them ourselves! This new bash instance can be used to print (and filter) environment variables, for instance:


```bash
didrocks@tidus:/home/didrocks$ env | grep SNAP
SNAP_USER_COMMON=/home/didrocks/snap/chuck-norris-webserver/common
SNAP_REEXEC=
SNAP_LIBRARY_PATH=/var/lib/snapd/lib/gl:/var/lib/snapd/void
SNAP_COMMON=/var/snap/chuck-norris-webserver/common
SNAP_DID_REEXEC=1
SNAP_USER_DATA=/home/didrocks/snap/chuck-norris-webserver/10
SNAP_DATA=/var/snap/chuck-norris-webserver/10
SNAP_REVISION=x1
SNAP_NAME=chuck-norris-webserver
SNAP_ARCH=amd64
SNAP_VERSION=1.0.0
SNAP=/snap/chuck-norris-webserver/10
```

You can see some internal env variables, like **SNAP_NAME, SNAP_ARCH, SNAP_VERSION, SNAP_REVISION** which could be used internally by the snap application.

You will then notice that most of the paths are versioned. They contain the revision as the last element of the path. This is how `snapd` enables installing multiple revisions of an application in parallel, and store data in a revisioned manner for solid rollbacks.

#### Application code path

One of the first variable to look at is **$SNAP**, it corresponds to the application code itself.

```bash
didrocks@tidus:/home/didrocks$ ls $SNAP
CHANGELOG.md  README.md  command-cli.wrapper	       etc	lib   share
LICENSE       bin	 command-node-service.wrapper  include	meta  snap
```

This directory is read-only:


```bash
didrocks@tidus:/home/didrocks$ touch $SNAP/foo
touch: cannot touch '/snap/chuck-norris-webserver/10/foo': Read-only file system
```

Ok, it’s useful to know where the application code is, but it’s even more interesting to know where the snap can write!

### User writeable paths

Users can read and write to a directory referenced under `$SNAP_USER_DATA` and `$SNAP_USER_COMMON`.


```bash
didrocks@tidus:/home/didrocks$ echo $SNAP_USER_DATA
/home/didrocks/snap/chuck-norris-webserver/10
didrocks@tidus:/home/didrocks$ echo "test content" > $SNAP_USER_DATA/foo
didrocks@tidus:/home/didrocks$ ls -l $SNAP_USER_DATA
total 4
-rw-rw-r-- 1 didrocks didrocks 13 Mar 16 12:08 foo
didrocks@tidus:/home/didrocks$ cat $SNAP_USER_DATA/foo
test content
didrocks@tidus:/home/didrocks$ echo $SNAP_USER_COMMON
/home/didrocks/snap/chuck-norris-webserver/common
```

As you can see above, we can read and write as our user into those directories. (root user will have it under the root’s home directory as well, typically` /root`)

The difference between `$SNAP_USER_DATA` and `$SNAP_USER_COMMON` is that the first one is versioned by revision and not the last one. It means that applications should write revision-specific data in the *_DATA** directory. Those will be **copied** on upgrade. The benefits, despite the extra space needed is that you can revert both the code and associated data, ensuring you always have a compatible configuration within your snap on any upgrade/revert combination!

Big files that aren’t related to a specific revision of a snap should use the **_COMMON** directory, which, as its names indicates, is available to any revision of the snap. Big assets like video files or any applications ensuring their configuration is both backward and forward compatible should use that directory.

Last tip! `$HOME` (if the home plug isn’t used) is set to `$SNAP_USER_DATA:`


```bash
didrocks@tidus:/home/didrocks$ echo $HOME
/home/didrocks/snap/chuck-norris-webserver/10
didrocks@tidus:/home/didrocks$ echo $SNAP_USER_DATA
/home/didrocks/snap/chuck-norris-webserver/10
```

#### Global writeable paths

Similarly to `$SNAP_USER_DATA` and `$SNAP_USER_COMMON`, there is `$SNAP_DATA` and `$SNAP_COMMON`. Those are only writable by root, but can be read by any other users.

```bash
didrocks@tidus:/home/didrocks$ touch $SNAP_DATA/foo
touch: cannot touch '/var/snap/chuck-norris-webserver/10/foo': Permission denied
didrocks@tidus:/home/didrocks$ ls -l $SNAP_DATA
total 0
-rw-r--r-- 1 root root 0 Mar 16 10:31 config
```

We can see that there is a config file in `$SNAP_DATA`! Let’s set some config values the values (in another terminal, outside of our snap run subshell):


```bash
$ snap set chuck-norris-webserver port="90" title="Test Title"
```

And let’s have a look in our snap subshell environment (note that the file modification date just changed):


```bash
didrocks@tidus:/home/didrocks$ ls -l $SNAP_DATA/config
total 0
-rw-r--r-- 1 root root 0 Mar 16 12:23 /var/snap/chuck-norris-webserver/10/config
didrocks@tidus:/home/didrocks$ cat $SNAP_DATA/config
port=90
title=Test title
```

This is thus where our config hook was storing its configuration (AHAH!). You can observe as well that the script was run as root (visible through permissions on the `config` file). This is a snap implementation detail and will depend on the snap itself of course, but that illustrates that those global writeable paths can be used to store global configuration, or data that will be used by snap services (running as root, as opposed to command line snaps which run as the current user). Nevertheless, the user has access to that directory and can read its content.

The difference between `$SNAP_DATA` and `$SNAP_COMMON ` is similar to the one between `$SNAP_USER_DATA` and `$SNAP_USER_COMMON`, meaning that the first is revision-dependent (and its data will be copied on upgrade), while the second one is common amongst all revisions.

Enough deep diving, let’s now exit the subshell!

```bash
didrocks@tidus:/home/didrocks$ exit
```

### snap info

#### General usage

The `info` command shows detailed information about a snap.

```bash
$ snap info chuck-norris-webserver
name:      chuck-norris-webserver
summary:   "Chuck Norris quotation nodejs server and cli"
publisher:
description: |
  This example shows how to build a nodejs web server and cli. This enables us
  to demonstrate how service works, basic confinement rules to access and listen
  on the network, as well as the nodejs snapcraft plugin.
  The command line demonstrate various file-based access permissions.

commands:
  - chuck-norris-webserver.cli
tracking:    stable
installed:   1.0.0 (10) 10MB -
refreshed:   2017-03-15 14:19:58 +0100 CET
channels:               
  stable:    1.0.0 (10) 10MB -
  candidate: 1.0.1 (18) 11MB -
  beta:      1.0.3 (22) 11MB -
  edge:      1.0.3 (24) 11MB -
```

Snap info shows the snap name, summary and long description of the snap. In addition to this, available commands and paths to use them.


positive
: The revision, size and publication states corresponds to the ones that were available at the time of this writing.


The more interesting part is that, here, you can see that we are tracking the **stable** channel, that we **are up to date** (the installed revision **10** is the one published in the stable). The size of the snap is indicated. We can observe as well that there are different **revision** numbers depending on the channel. The **human-readable version** is also available for each.

Here is a confirmation that the version string is different between revision number: both beta and edge channels have 1.0.3 with different snap revisions. This could mean that:

  - The snap author pushed a 1.0.3 version as revision 22 in the beta and edge channels.
  - The author then got some user feedback on that revision and fixed issues.
  - Those fixes are now pushed again (still as 1.0.3 which isn’t released) in the edge channel only (for now) as revision 24.
  - This revision 24 will certainly migrate up to other channels as time goes by, if there isn’t any regression noticed.

Here is a full demonstration of the power of snaps!

#### Information for unpublished snaps

`snap info` is also a good way to see the status of a snap which isn’t published on the stable channel. Remember that snap find only show stable channel snaps, but if you have the name of a snap and want to see its revisions and general info, you can use it too!


```bash
$ snap info face-detection-demo
name:      face-detection-demo
summary:   "Web interface detecting faces from webcam shots"
publisher: didrocks
description: |
  Web interface detecting faces from webcam shots every few seconds
channels:                
  beta:   1.0       (52) 37MB devmode
  edge:   2.0alpha1 (51) 37MB devmode
```
As this snap is not fully confined (see the devmode annotation), it is only available in the beta and edge channels (with different versions and revisions)

### snap find
We have already seen that `snap find <query>` is looking for keywords in snap name and descriptions in the stable channel to display what you are looking for. But there is way more than this!

#### sections

`snap find` without any search key display some featured snaps:

```bash
$ snap find
Name               Version   Developer   Notes  Summary
docker             1.11.2-9  docker-inc  -      The docker app deployment mechanism
lxd                2.11      canonical   -      System container manager and API
mongo32            3.2.7     niemeyer    -      MongoDB document-oriented database
rocketchat-server  0.53.0    rocketchat  -      Group chat server for 100s,  installed in seconds.
```

In fact, it shows the “**featured**” section of the snap store. You can easily look for other sections with the `--section` option:

```bash
$ snap find --section internet-of-things
Name       Version      Developer  Notes  Summary
openhab    2.0.0        canonical  -      openHAB smart home server
nextcloud  11.0.2snap2  nextcloud  -      Nextcloud Server
```

How to know what are the available sections? Using snap command tab completion is your best bet!


```bash
$ snap find --section [TAB][TAB]
database            internet-of-things  messaging
featured            media               ops
```

#### Private snaps

Developers can put their snaps in private mode. Those are usually snap applications in development which aren’t ready for wider consumption yet. Of course, to get access to yours, you need to be logged in with the `snap login` command.

```bash
$ snap find --private
The search "" returned 0 snaps
```

As you can see, this account doesn’t have any private snap (yet! ;))

### snap list

`snap list` enables us to see the list of all installed snaps, as we have already practiced:

```bash
$ snap list
Name                            Version  Rev   Developer  Notes
booth-demo-manager              1.0      17    didrocks   devmode
chuck-norris-webserver          1.0.0    10    didrocks   -
chuck-norris-webserver-classic  1.0.0    14    didrocks   classic
core                            16-2     1441  canonical  -
hello                           2.10     20    canonical  -
nethack                         3.4.2-2  2     ogra       -
snappy-debug                    0.30     28    canonical  -
ubuntu-app-platform             1        34    canonical  -
ubuntu-webapp                   1.0      x2               try
```

We can see there the snap name, version, revision, publisher as well as the mode (devmode, classic, try…).

positive
: You will note that the ubuntu-webapp snap has a special revision (x2) and mode (try) without any publisher name. This is due to the fact it’s a locally developed snap for a local revision of a snap not published to the store yet. You will thus mainly see those combinations on snap developer machines.

However, this is a partial view of what’s really installed on your system. Remember that multiple revisions of a snap can be installed in parallel (and only one is enabled). You can have the list of all snaps and revisions installed on the system via the `--all` switch:

```bash
$ snap list --all
Name                            Version  Rev   Developer  Notes
booth-demo-manager              1.0      17    didrocks   devmode
chuck-norris-webserver          1.0.0    10    didrocks   -
chuck-norris-webserver          1.0.0    8     didrocks   disabled
chuck-norris-webserver          0.9.1    4     didrocks   disabled
chuck-norris-webserver-classic  1.0.0    14    didrocks   classic
core                            16-2     1264  canonical  disabled
core                            16-2     1441  canonical  -
core                            16-2     1337  canonical  disabled
hello                           2.10     20    canonical  -
nethack                         3.4.2-2  2     ogra       -
snappy-debug                    0.30     28    canonical  -
snappy-debug                    0.29     27    canonical  disabled
ubuntu-app-platform             1        34    canonical  -
ubuntu-webapp                   1.0      x2               try
ubuntu-webapp                   1.0      x1               disabled,try
```

We can see here that some snaps have multiple revisions installed (sometimes, with the same user string version, sometimes with different ones). Only the active revision doesn’t have the “disabled” status note next to it.
Older version will be garbage collected after some time of inactivity or depending on the number of revisions of the same snap installed. Associated version data directories we previously discussed will be purged as well.  However as long as the snap revision is available on the system, you can revert to it!

### snap revert (--revision)

We already skimmed over the `snap revert` functionality in the basic snap usage. The revert command reverts the given snap to its state before its latest refresh. This will reactivate the previous snap revision, and will use the original data that were associated with that revision,
discarding any data changes that were done by the latest revision. As an exception, data which the snap explicitly chooses to share across revisions is not touched by the revert process.

But there is more than that! We can revert to a specific revision. In case you want to try it yourself and you have multiple versions of a snap, have a go!
I see that I have 3 versions of chuck-norris-webserver:


```bash
$ snap list --all
Name                            Version  Rev   Developer  Notes
[…]
chuck-norris-webserver          1.0.0    10    didrocks   -
chuck-norris-webserver          1.0.0    8     didrocks   disabled
chuck-norris-webserver          0.9.1    4     didrocks   disabled
```

A simple `snap revert` would revert to revision 8 (version 1.0.0). But let’s say I want to revert to revision 4, this is easy with the `--revision` option:


```bash
$ snap revert chuck-norris-webserver --revision 4
chuck-norris-webserver reverted to 0.9.1
$ snap list --all
Name                            Version  Rev   Developer  Notes
[…]
chuck-norris-webserver          1.0.0    10    didrocks   disabled
chuck-norris-webserver          1.0.0    8     didrocks   disabled
chuck-norris-webserver          0.9.1    4     didrocks   -
```

And here we go!

The additional benefit is that automated refreshes won’t refresh to revision 10 automatically. This one is blacklisted. So we will get:

```bash
$ snap refresh
All snaps up to date.
```

Of course, if a new version is released or any other snap, `snap refresh` will update the relevant snaps.

We can still force refreshing to latest `chuck-norris-webserver` no matter:

```bash
$ snap refresh chuck-norris-webserver
chuck-norris-webserver 1.0.0 from 'didrocks' refreshed
$ snap list --all
Name                            Version  Rev   Developer  Notes
[…]
chuck-norris-webserver          1.0.0    10    didrocks   -
chuck-norris-webserver          1.0.0    8     didrocks   disabled
chuck-norris-webserver          0.9.1    4     didrocks   disabled
```
And we are back to revision 10!

Phew! That was it for the latest tips and tricks that will make you an advanced snap user! Let’s recap quietly all this.

## That’s all folks!
Duration: 1:00

### We are done!

That was quite a journey, wasn’t it?

By now you have a way better understanding and know some advanced snap usage techniques and internal mechanisms. From the discovery of the advanced transaction system, we took advantages of it to dive in multiple aspects of snapd. You understand the assertion system and how to manually install snaps: what the impacts and safety mechanisms in place are. You are also way more knowledgeable in the various confinement systems that snaps can implements and requires. Services as well, have no more secrets for you in how to disable/enable them and access their logs! This will be most of the time after changing their configuration, and optionality introspecting, if needed, the paths that are accessible for reading or writing from your snaps!

Finally, you are now familiar with some of the secrets features of snapd making its usage even easier and more precise!

### Next steps

  - Be amazed by the ease of creating a snap for your project by following the snapcraft tutorial called “[Creating your first snap]”.
  - Create your own ubuntu core image in the [dedicated tutorial] and learn more about assertions.
  - Join the snapcraft.io community on the [snapcraft forum].

### Further readings

  - Definition and theory of [an assertion].
  - [Snapcraft.io user interface documentation] will give you some basics about slots, plugs and interfaces.
  - An [interface reference] explains and list existing interface, if they auto-connect or not and more.
  - Some information on [systemd].
  - See how you can [contact us and the broader community].





[basic snap usage]: https://tutorials.ubuntu.com/tutorial/basic-snap-usage
[https://login.ubuntu.com/]: https://login.ubuntu.com/
[Creating your first snap]: https://tutorials.ubuntu.com/tutorial/create-your-first-snap
[dedicated tutorial]: https://tutorials.ubuntu.com/tutorial/create-your-own-core-image
[snapcraft forum]: https://forum.snapcraft.io/
[an assertion]: https://docs.ubuntu.com/core/en/guides/build-device/assertions
[Snapcraft.io user interface documentation]: http://snapcraft.io/docs/core/interfaces
[interface reference]: http://snapcraft.io/docs/reference/interfaces
[systemd]: https://www.linux.com/learn/here-we-go-again-another-linux-init-intro-systemd
[contact us and the broader community]: http://snapcraft.io/community/
