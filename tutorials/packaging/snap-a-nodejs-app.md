---
id: build-a-nodejs-service
summary: We are going to use the nodejs snapcraft plugin to build a simple service. We’ll guide you through the good practice for debugging and iterating over your web server, and basic confinement notions.
categories: packaging
status: published
feedback: https://github.com/ubuntu/codelabs/issues
tags: snapcraft, nodejs, service, beginner, plug, interface, webserver
difficulty: 2
published: 2016-10-14
author: Didier Roche <didier.roche@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---


# Build a nodejs service snap

## Overview
Duration: 1:00

We are going to build together one of the most important web service of the world on our machine:  a Chuck Norris random quotation website! We are going to use a “Chuck As A Service” API, available free of charge at [chucknorris.io]. This CAAS will be accessed through a npm module named **chucknorris-io** that we will install alongside (even if Chuck doesn’t need a npm module nor a javascript engine to render data in your browser).
This website is going to run as a **service** meaning a long running process which will always start when you start your device and restart if the server crashes. You will build your first webservice this way and see how to snap **nodejs** apps.

![IMAGE](https://assets.ubuntu.com/v1/3db2fc34-snap-nodejs-1.png)

### What you’ll learn
  - How to create a service in snapd world
  - Some hints and best practices on how to debug a service
  - Using the nodejs plugin
  - How to enable and debug confinement issues
  - Basics on plugs and interfaces
  - And more...

### What you’ll need
  - Any supported snap GNU/Linux distribution .
  - Some very basic knowledge of command line use, know how to edit files.
  - You should have followed the 2 following tutorials: “[basic snap usage]” and "[create your first snap]”

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

## Getting familiar with the project
Duration: 1:00

This project is a **nodejs** application, serving a web page on request. The backend code issue a REST request through through a web API, using **chucknorris-io** npm module.

### Get the code

Simply run:


```bash
git clone https://github.com/ubuntu/snap-tutorials-code
cd snap-tutorials-code/build-a-nodejs-service/start
```

Your cloned directory should contain 2 files:
  - a `main.js` source file, containing the code. Opening this one will show the entire application logic. Notice that we listen on port 80. We will need to point to that file and having node running it as a service.
  - a `package.json`, which is a standard npm metadata file, defining application name, version and dependency (chucknorris-io npm module in that case).


## Start snapping your project
Duration: 5:00

### Metadata

Let’s scaffold our default `snapcraft.yaml` file via:


```bash
$ snapcraft init
Created snap/snapcraft.yaml.
Edit the file to your liking or run `snapcraft` to get started
```

And let’s edit the top metadata to match our project definition:


```bash
name: chuck-norris-webserver
version: '1.0.0'
summary: Chuck Norris quotation nodejs server
description: |
  This example shows how to build a nodejs web server. This enables us to
  demonstrate how service works, basic confinement rules to access and listen
  on the network, as well as the nodejs snapcraft plugin.
grade: stable
confinement: devmode
```

As usual, note that we start in devmode. Let’s get to the serious stuff and add our nodejs part!

### Adding a nodejs part

Our application is using nodejs for execution. Luckily, snapcraft has a **nodejs plugin** enabling your to snap software using this technology in a breeze!
It’s as simple as defining:


```bash
parts:
  webserver:
    source: .
    plugin: nodejs
```

And that’s all what you need! Awesomely easy, isn’t it?
The nodejs plugin snapcraft will download and embed a local nodejs version, as well as any dependencies that are shipped in your package.json file (like chucknorris-io in our case).


positive
: **What if I don’t have any package.json file?**
`snapcraft help nodejs` shows you specific plugin options that you can use in your `snapcraft.yaml`. One of them is named `node-packages` which is a list of npm packages you may want to download in your snap.
Note that there are other options, like choosing what specific version of nodejs you want to download, the npm-run command and so on…


### Our first build

Time to build your project (only priming it, no need for a snap for fast iteration as we saw in previous tutorial) to check that the project builds correctly.


```bash
$ snapcraft prime
Preparing to pull webserver
Pulling webserver
Downloading 'node-v4.4.4-linux-x64.tar.gz'[===============================] 100%
Preparing to build webserver
Building webserver
npm --cache-min=Infinity install
chucknorris-io@1.0.4 node_modules/chucknorris-io
npm --cache-min=Infinity install --global
[…]/parts/webserver/install/bin/chuck-norris-app -> […]/parts/webserver/install/lib/node_modules/chuck-norris-app/main.js
chuck-norris-app@1.0.0 […]/parts/webserver/install/lib/node_modules/chuck-norris-app
└── chucknorris-io@1.0.4
Staging webserver
Priming webserver
```

Good, it built! Let’s look together at the created content in the prime directory:


```bash
$ tree prime
├── bin
│   ├── chuck-norris-app -> ../lib/node_modules/chuck-norris-app/main.js
│   ├── node
│   └── npm -> ../lib/node_modules/npm/bin/npm-cli.js
├── CHANGELOG.md
├── etc
├── include
│   └── node
│       ├── […]
├── lib
│   └── node_modules
│       ├── chuck-norris-app
│       │   ├── main.js
│       │   ├── node_modules
│       │   │   └── chucknorris-io
│       │   │       ├── LICENSE
│       │   │       ├── […]
│       ├── […]
├── LICENSE
├── meta
│   └── snap.yaml
├── README.md
└── share
   ├── […]
```

The interesting file, in addition the download node binary and modules installed is `bin/chuck-norris-app`. This confirms that npm install was executed at build time to generate this binary defined in `package.json` which refers to our `main.js` file.
This will be our entry point for our service.

No need to try to do anything at this stage as we didn’t expose any command. However, we know at least that we can successfully issue a build of this project.

### Adding some apps command

Before exposing your server as a service, we strongly recommend you to declare it as a simple snap application. This enables you to easily debug your service and iterate, especially when adding confinement. So let’s roll in!

If you remember from previous tutorials, exposing a command is easy:


```bash
apps:
  node-service:
    command: bin/chuck-norris-app
```

Note that we reference here the starting binary file generated by `package.json`.

Let’s rebuild it and use `snap try` to install the local snap before running the command!


```bash
$ snapcraft prime
Skipping pull webserver (already ran)
Skipping build webserver (already ran)
Skipping stage webserver (already ran)
Skipping prime webserver (already ran)
$ snap try prime/ --devmode
chuck-norris-webserver 1.0.0 mounted from[…]/prime
$ chuck-norris-webserver.node-service
events.js:141
      throw er; // Unhandled 'error' event
      ^

Error: listen EACCES 0.0.0.0:80
    at Object.exports._errnoException (util.js:870:11)
    at exports._exceptionWithHostPort (util.js:893:20)
    at Server._listen2 (net.js:1221:19)
    at listen (net.js:1270:10)
    at Server.listen (net.js:1366:5)
    at Object.<anonymous> (/snap/chuck-norris-webserver/x1/lib/node_modules/chuck-norris-app/main.js:71:8)
    at Module._compile (module.js:409:26)
    at Object.Module._extensions..js (module.js:416:10)
    at Module.load (module.js:343:32)
    at Function.Module._load (module.js:300:12)
```

Ah, a failure! We are getting a javascript stacktrace. Looking a little bit more closely, we see that the exact error is: `Error: listen EACCES 0.0.0.0:80`. Indeed, unprivileged users on a Linux system can’t listen to **ports < 1024**. We then need to run the command as the root user:



```bash
$ sudo chuck-norris-webserver.node-service
Server listening on: http://localhost:80
```

You can now point your browser to http://localhost and enjoy some Chuck Norris quotes! All debug outputs will be visible on the command line prompt. Press Ctrl+C to exit it.
Having a command while you are working on your snap helps you greatly in inspecting what’s going on in your snap. This is why we strongly recommend that approach.

Also, that means to listen to that port **80**, we’ll need the service to run as a privileged user. The good news is that in the snap world, thanks to confinement, all services are running as root while being safe!
It’s something to keep in mind while you iterate on a command which is going to be turned into a service later on: run them as root to reproduce the exact running context!

It’s now high time to get rid of this devmode thing and add some confinement to your snap, let’s do this right away!


## Turning on confinement!
Duration: 5:00


positive
: Lost or starting from here?
Check or download [here][here-3] to see what your current directory should look like.


### Enabling confinement

In our first snap tutorial, we simply turned confinement on without any additional work. Let’s try this as well!
You don’t forcefully need to change your `snapcraft.yaml` and rebuild (we’ll do it later), both `snap try` and `snap install` have an option to force confinement on snaps declaring devmode.


```bash
$ snap try prime/ --jailmode
chuck-norris-webserver 1.0.0 mounted from […]/prime
$ sudo chuck-norris-webserver.node-service
events.js:141
      throw er; // Unhandled 'error' event
      ^

Error: listen EACCES 0.0.0.0:80
    at Object.exports._errnoException (util.js:870:11)
    at exports._exceptionWithHostPort (util.js:893:20)
    at Server._listen2 (net.js:1221:19)
    at listen (net.js:1270:10)
    at Server.listen (net.js:1366:5)
    at Object.<anonymous> (/snap/chuck-norris-webserver/x2/lib/node_modules/chuck-norris-app/main.js:71:8)
    at Module._compile (module.js:409:26)
    at Object.Module._extensions..js (module.js:416:10)
    at Module.load (module.js:343:32)
    at Function.Module._load (module.js:300:12)
```


Thanks to keeping the service as a simple command, we see easily that, even if ran as root, the nodejs built-in web server isn’t able to listen on port 80.

### What do we need to do?

The snap not being in devmode anymore, it needs to get additional permissions. Those are given through an **interface**. We thus have to find which **interface** our snap will need, and declare a **plug** to that interface. The snap **plug** will connect to the core **slot** which declares this **interface**. For an easy analogy, thinks of a plug like an electrical plug, slot is what you put the plug into, and the interface is the kind of data (permissions here) which will be send over via that interface.

Enough theory! How to easily debug and fix this?

### Debugging denials tools

It seems we were denied on listening to an interface, but how to confirm this? There is a tool as part of the `snappy-debug` package especially suited for it.
Let’s install and get it listening to our snap:


```bash
$ snap install snappy-debug
snappy-debug (stable) 0.26 from 'canonical' installed
$ sudo snappy-debug.security scanlog chuck-norris-webserver
sysctl: permission denied on key 'kernel.printk_ratelimit'
# Type Ctrl + C
$ sudo snappy-debug.security scanlog chuck-norris-webserver
kernel.printk_ratelimit = 0
```



positive
: Note that we need to run the tool as a privileged user. The kernel indeed is doing some rate limiting operations which may skip some debug logs for us. Running it as root alleviate this limitation for this command for us.


Then, the command will block and filter any output related to our snap with some advice.
For example, if you run in another terminal:


```bash
$ sudo chuck-norris-webserver.node-service

 [ same stacktrace ]
```

You will see:


```bash
= AppArmor =
Time: Nov 15 10:57:00
Log: apparmor="DENIED" operation="open" profile="snap.chuck-norris-webserver.node-service" name="/run/resolvconf/resolv.conf" pid=5790 comm="node" requested_mask="r" denied_mask="r" fsuid=0 ouid=0
File: /run/resolvconf/resolv.conf (read)
Suggestions:
* adjust program to use $SNAP_DATA
* adjust program to use /run/shm/snap.$SNAP_NAME.*

= AppArmor =
Time: Nov 15 10:57:00
Log: apparmor="DENIED" operation="create" profile="snap.chuck-norris-webserver.node-service" pid=5790 comm="node" family="inet6" sock_type="stream" protocol=0 requested_mask="create" denied_mask="create"

= AppArmor =
Time: Nov 15 10:57:00
Log: apparmor="DENIED" operation="create" profile="snap.chuck-norris-webserver.node-service" pid=5790 comm="node" family="inet" sock_type="stream" protocol=0 requested_mask="create" denied_mask="create"
```

This tool is filtering the output of `/var/log/syslog` to only show the denials related to your snap. However, sometimes, getting the log context (like if your command was a service, we would see the stacktrace in the `syslog` file) or additional informations are only in that file. So, it’s good idea to sometimes have a look there as well.

The tool will parse the generated application logs and may suggest interfaces to add directly to your snap. It doesn’t seem to be the case here. We need then to investigate and think a little bit more!

### Listing interfaces

Let’s list available interfaces on our machine to us:


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
:log-observe                      snappy-debug
:lxd-support                      -
:modem-manager                    -
:mount-observe                    -
:network                          -
:network-bind                     -
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
```

This list of interfaces evolves over time. It also depends on your hardware capability (the gadget snap, to be precise), which defines which additional interfaces your device can expose, like GPIO devices, camera, I2C and such…
You have the confirmation here that snappy-debug connects to the log-observe slot from the core snap (slot, plug and interface names are abbreviated when they all match).

So, let’s think about a web server. What do we want to do? We want to listen on a port and return requests. This is named binding to a port. `network-bind` seems to be a good candidate for this.

Let’s try to add this in our `snapcraft.yaml` definition. We will thus declare a **plug**, connecting to `network-bind` interface.
We won’t enter into detail of plugs and slots here, but the names can be overridden. Just note that we are using here the simplified definition where **plug name == interface name**.

We’ll use that opportunity to turn confinement to `strict`.


```bash
confinement: strict

apps:
  node-service:
    command: bin/chuck-norris-app
    plugs: [network-bind]
```

You note that plugs is an array of plugs to use. This one is defined per application.

Let’s rebuild, install and run it:


```bash
$ snapcraft prime
$ snap try prime/
$ sudo chuck-norris-webserver.node-service
Server listening on: http://localhost:80
```

Hurrah! We also notice no new output in snappy-debug.security output! Pointing again your browser to http://localhost works as expected.

### Two final notes on interfaces and confinement

Here, you should wonder about 2 things:

#### Why didn’t I have to connect (like for snappy-debug) this slot to the core snap to enable it?
I’m glad you are asking this!
The answer is that some interfaces are considered safer than others, and so, they are auto-connected on snap installation. Others are seen as being more dangerous, and thus, needs an explicit acknowledgment from the user. The interface list documentation (link provided at the end of tutorial) will give you a definitive list of those different modes.
We can confirm that it was connected via snap interfaces:

```bash
$ snap interfaces chuck-norris-webserver
Slot           Plug
:network-bind  chuck-norris-webserver
```


#### We are initiating outgoing request to chucknorris.io to fetch a quote from the network. However, we didn’t use the network interface which seems suited for this. How come?

Actually, `network-bind` implies the `network` interface as we will do outgoing requests. You could define it if you want to be complete, but this is totally up to you.

Phew, we are nearly there! We have a working snap, exposing a command which is now confined. It was easier to iterate thanks to the fact we kept the application as a command and not a service. However, now that everything is ready, let’s move on our final step: exposing this application as a service!

## Exposing it as a service
Duration: 4:00

positive
: Lost or starting from here?
Check or download [here][here-4] to see what your current directory should look like.

What is a service? A service is simply a long running command, which will ideally always be on or for a definite period of time to answer some requests.

### Mutating to a service

Transforming a simple command to a service in a snap is really easy. Just add `daemon: simple` in your command definition inside your `snapcraft.yaml`:


```bash
apps:
  node-service:
    command: bin/chuck-norris-app
    daemon: simple
    plugs: [network-bind]
```

With that simple additional line, your service will start on device boot up (once the network and all other services are started) and will close on machine shutdown.

positive
: It’s just a matter of preference where you want to define this `daemon` entry. We personally advise to let it under the command entry and before **plugs** to let the snap author remember that this entry is a service.


The `simple` attribute means that it’s a classical application. The process keeps running as long as the service itself runs.

There are variations to this, like `forking`, which is the traditional double fork way for a service to be orphaned, and thus attached to PID 1. This isn’t the recommended behavior on a modern Linux system. Nowadays, **systemd** (which is what is used by snap technology) knows how to track them efficiently, you just need to specify that you have this type of daemons.

`oneshot`, finally, expects that the command configured will exit once it's done (won't be a long-lasting process). The service is still considered as running though.
For those used to systemd service units, indeed, there is an one to one mapping here, handy! :)


positive
: `stop-command` and `timeout-command` are other daemon-related options you can set. Those definitions are available in the snapcraft syntax guide. You will get a link as a reference (last step of this tutorial).

### Keeping it always running

Last detail to figure out. The default behavior for a service is to restart if the applications exited in a failure state (with return code **different from 0**).
Here, we want to always have the service running, especially if we implement a “restart” button and thus, the service exits successfully (0). By defining the following `restart-condition: always`, we achieve this desired behavior:


```bash
apps:
  node-service:
    command: bin/chuck-norris-app
    daemon: simple
    restart-condition: always
    plugs: [network-bind]
```

### Running and testing

Let’s give it a shot:


```bash
$ snapcraft prime
$ snap try prime/
chuck-norris-webserver 1.0.0 mounted from […]/prime
```

Head over to http://localhost and you should have your successful snap running your application as a service! Installing the snap started thus the service.

### Where did the logs go?

Services are handled by systemd. You can access to all systemd commands to handle them. However, for traditional Linux reasons, we can also follow them in `/var/log/syslog`:


```bash
Nov 15 14:40:11 tidus snap[14410]: Server listening on: http://localhost:80
Nov 15 14:47:35 tidus snap[14410]: Quoted http://api.chucknorris.io/jokes/ijpnw0birv-ogszti_wuag
```

However, this can be hard to decipher: nothing tells that the log coming from this particular service, you only know it’s coming from this snap because you wrote this app! You will see as well a lot of other logs on the system. We need to know how to filter this a little bit.

The service name (where you can find the service file generated in `/etc/systemd/system`) is named the following: `snap.<snap_name>.<app_name>.service`

So, in our case: **snap.chuck-norris-webserver.node-service.service**.
We can thus use traditional systemd tool, optionally omitting the final .service name, as for:

#### Checking service status and last logs:

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
           └─14410 node /snap/chuck-norris-webserver/x1/bin/chuck-norris-app

nov. 15 14:40:11 tidus systemd[1]: Started Service for snap application chuck-norris-webserver.node-service.
nov. 15 14:40:11 tidus snap[14410]: Server listening on: http://localhost:80
nov. 15 14:47:35 tidus snap[14410]: Quoted http://api.chucknorris.io/jokes/ijpnw0birv-ogszti_wuag
```
From the output, you can see the service is **active** since 17 minutes ago, you can track its process information as well as last logs.

#### Stopping and starting a service:


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

The service is enabled (it will start at next reboot), but it’s stopped (**inactive**). It got a **TERM** signal (normal stopping request that we issued via `systemctl`). We can as well see latest log outputs from the service, which is particularly handy in case of service crash or misbehaving for instance.


positive
: **Small tip**: systemd default behavior will try 3 times a crashing service at startup (in the very few seconds after it starts) and will give up afterwards to not overload your CPU.



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
           └─15622 node /snap/chuck-norris-webserver/x1/bin/chuck-norris-app

nov. 15 15:12:42 tidus systemd[1]: Started Service for snap application chuck-norris-webserver.node-service.
nov. 15 15:12:43 tidus snap[15622]: Server listening on: http://localhost:80
```
Of course, there is a `systemctl restart` command as well!

#### Live log following:

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
You can omit -f to not following the logs live (meaning, new inputs are printed as they come): it will only prints the messages that were logged when running the command.


positive
: Small tip: sometimes, multiple services coordinates to provide a functionality, or a service impacts some system services like network-manager. To get all logs and follow them live, just don’t provide the -u option with the service name. For instance, journalctl -f will provide you all logs, lively printed, from your system, including your services.

## That’s all folks!
Duration: 1:00

### There is no Esc key on Chuck Norris’ keyboard, because no one escapes Chuck Norris.

Congratulations! As Chuck, you made it!

positive
: Final code
Your final code directory should now look like [this]. Do not hesitate to download and build your snap from it if you only read it through!


You should by now have a ready-to-go nodejs service, being a web server giving external quotes from Chuck Norris. Wasn’t that easy to build?

You now know how to snap a nodejs application, basics on confinements, connects and debugging interfaces connections, what’s the process to daemonize a process (always starts with a command, enable confinement, ensure everything works, and then build it as a service!) as well as different options given to you.

As a bonus, you have as well some basic training on systemd common commands to start, stop, check status and look at service logs.

### Next steps
  - Learn some more advanced techniques on how to use your snap system looking for our others tutorials!
  - Join the snapcraft.io community on the [snapcraft forum].

### Further readings
  - [Snapcraft.io user interface documentation] will give you some basics about slots, plugs and interfaces.
  - An [interface reference] explains and list existing interface, if they auto-connect or not and more.
  - Some basic notions on [debugging a snap].
  - [Snapcraft syntax reference], covering various available options like the daemon ones.
  - Some information on [systemd].
  - Check how you can [contact us and the broader community].


[chucknorris.io]: https://chucknorris.io
[basic snap usage]: https://tutorials.ubuntu.com/tutorial/basic-snap-usage
[create your first snap]: https://tutorials.ubuntu.com/tutorial/create-your-first-snap
[here-3]: https://github.com/ubuntu/snap-tutorials-code/tree/master/build-a-nodejs-service/step3
[here-4]: https://github.com/ubuntu/snap-tutorials-code/tree/master/build-a-nodejs-service/step4
[this]: https://github.com/ubuntu/snap-tutorials-code/tree/master/build-a-nodejs-service/final
[snapcraft forum]: https://forum.snapcraft.io/
[Snapcraft.io user interface documentation]: http://snapcraft.io/docs/core/interfaces
[interface reference]: http://snapcraft.io/docs/reference/interfaces
[debugging a snap]: http://snapcraft.io/docs/build-snaps/debugging
[Snapcraft syntax reference]: http://snapcraft.io/docs/build-snaps/syntax
[systemd]: https://www.linux.com/learn/here-we-go-again-another-linux-init-intro-systemd
[contact us and the broader community]: http://snapcraft.io/community/
