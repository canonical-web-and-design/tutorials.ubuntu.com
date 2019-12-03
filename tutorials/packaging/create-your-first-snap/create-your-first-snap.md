---
id: create-your-first-snap
summary: We are going to use snapcraft to walk you through the creation of your first snap and main snapcraft concepts.
categories: packaging
status: published
tags: snapcraft, usage, build, beginner, idf-2016
difficulty: 1
published: 2019-11-26
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Canonical Web Team <webteam@canonical.com>

---

# Create your first snap

## Overview
Duration: 1:00

A snap is a bundle of an app and its dependencies that works without modification across many different Linux distributions. Snaps are discoverable and installable from the Snap Store, an app store with an audience of millions.

Snapcraft is a powerful and easy to use command line tool for building [snaps][what-are-snaps]. It reads a simple, declarative file and runs the build for us.

In this tutorial, we're going to explore some of snapcraft's best features before using it to create an ideal first snap. For a more detailed look at building snaps, see [Creating a snap][creating-a-snap] in the official documentation.

![IMAGE](https://assets.ubuntu.com/v1/074862f8-snaps-hero.png)

### What you'll learn

In this tutorial, we'll cover how to:
- install the _snapcraft_ tool
- create a new project
- declare snap metadata
- use _parts_ to define an app
- build a snap
- fix common build issues
- upload a snap to the Snap Store.

### What you'll need

- [Ubuntu 18.04 LTS (Bionic)][ubuntu-bionic], or later, or a derivative
- running from a nested VM requires accelerated/nested VM functionality
- basic command line knowledge and how to edit a file
- rudimentary knowledge of snaps


When building snaps from within a virtual machine, your VM environment will need to support nested machines.

For an introduction to snaps, and how to use them, take a look at [Getting started][tutorial_basic-snap-usage].

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

## Getting started
Duration: 1:00

This tutorial has been written to work on Ubuntu 18.04 LTS. However, it should work without modification on later Ubuntu releases and other GNU/Linux distributions derived from an Ubuntu 18.04 base, such as Linux Mint 19.x.

### Installing dependencies

First, open up a terminal and make sure you have _snap_ installed:

```bash
$ snap --version
```
If it's installed, you'll see something similar to the following:

```no-highlight
snap    2.39.3
snapd   2.39.3
series  16
ubuntu  18.04
kernel  5.0.0-36-generic
```

See [Installing snapd][installing-snapd] if snap isn't installed.

We can now install Snapcraft with a single command:

```bash
$ sudo snap install --classic snapcraft
```

positive
: **NOTE:**
    * The `--classic` switch enables the installation of a snap that uses *classic confinement*.  We discuss snap security confinement in the following section.

We're all set. Let's get cracking and build our first snap!

## Building a snap is easy
Duration: 4:00

### Starting the project

The first thing to do is to create a general snaps directory followed by a working directory for this specific snap project:

```bash
$ mkdir -p ~/mysnaps/hello
$ cd ~/mysnaps/hello
```

**It is from within this `hello` directory where we will invoke all subsequent commands.**

negative
: **NOTE:** Due to the limitation in the project we're going to build, the path of the directory you put the `hello` directory in *shouldn't contain any spaces*.

Get started by initialising your snap environment:

```bash
$ snapcraft init
```

This creates a `snapcraft.yaml` in which you declare how the snap is built and which properties it exposes to the user. We will edit this later.

The directory now structure looks like this:

```no-highlight
mysnaps/
└── hello
    └── snap
        └── snapcraft.yaml
```

positive
: **Note:**
Any future snaps you want to create should be put within they're own directory under `mysnaps`.

### Describing the snap

Let's take a look at the top part of your snapcraft.yaml file. It should look somewhat as shown below:

```yaml
name: my-snap-name # you probably want to 'snapcraft register <name>'
base: core18 # the base snap is the execution environment for this snap
version: '0.1' # just for humans, typically '1.2+git' or '1.3.2'
summary: Single-line elevator pitch for your amazing snap # 79 char long summary
description: |
  This is my-snap's description. You have a paragraph or two to tell the
  most important story about your snap. Keep it under 100 words though,
  we live in tweetspace and your description wants to look good in the snap
  store.

grade: devel # must be 'stable' to release into candidate/stable channels
confinement: devmode # use 'strict' once you have the right plugs and slots
```

This part of `snapcraft.yaml` is mandatory and is basic metadata for the snap.

Let's go through this line by line:
  - **name**: The name of the snap.

  - **base**: A foundation snap that provides a run-time environment with a minimal set of libraries that are common to most applications. For most snaps, this should be `core18`, which equates to Ubuntu 18.04 LTS.

  - **version**: The current version of the snap. This is just a human readable string. All snap uploads will get an incremental snap **revision**, which is independent from this version. It's separated so that you can upload multiple times the same snap for the same architecture with the same version. See it as a string that indicates to your user the current version, like "stable", "2.0", etc.

  - **summary**: A short, one-line summary or tag-line for your snap.

  - **description**: A longer description of the snap. It can span over multiple lines if prefixed
    with the '|' character.

  - **grade**: Can be used by the publisher to indicate the quality confidence in the build. The
    store will prevent publishing 'devel' grade builds to the 'stable' channel.

  - **confinement**: A snap’s confinement level is the degree of isolation it has from your system, and there are three levels: `strict`, `classic` and `devmode`. _strict_ snaps run in complete isolation, `classic` snaps have open access to system resources and _devmode_ snaps run as _strict_ but with open access to the system. The latter is ideal for development, but your snap will need move from _devmode_ to be published. See [Snap confinement][snap-confinement] for more details.

    In this tutorial, we will focus on `devmode` and `strict` confinement.

For more detailed information on this top-level metadata, see [Adding global metadata][global-metadata].

And that's it for the basics. It's now time to customise the _snapcraft.yaml_ file for our own snap. Taking the above into account, we can change the top of the file to be:

```no-highlight
name: hello
base: core18
version: '2.10'
summary: GNU Hello, the "hello world" snap
description: |
  GNU hello prints a friendly greeting.
grade: devel
confinement: devmode
```

positive
: **Note:**
Version information is for snap user consumption only, and has no effect on snap updates. It's defined within quotes, (`'2.10'`), because it needs to be a [YAML string](http://yaml.org/type/str.html) rather than a floating-point number. Using a string allows for non-numeric version details, such as '`myfirstversion`' or '`2.3-git`'.

### Adding a part

Parts are used to describe your application, where its various components can be found, its build and run-time requirements, and those of its dependencies. A snap consists of one or more parts, depending on its complexity.

Here are a few multiple-part snap examples:
- snaps with separate logical parts, such as a server snap containing a web server, a database and the application itself
- a game which ships the game engine and game data for three different games, each one being defined in its own part
- snaps with parts from different locations
- parts which are built in a different way

Our `hello` snap will be nice and simple. It will consist of only one part for now. In the following pages we are going to gradually extend it.

Two must-haves for every part are the 'source' and 'plugin' definition. Think of these as the "what" and the "how", respectively. As source you can, for example, pick a source repository (like `git`), a tarball, or a local directory. Snapcraft supports many plugins, allowing you to build a wide variety of project types (e.g. autotools, cmake, go, maven, nodejs, python2, python3).

To build `hello`, add the following 'parts' stanza to your `snapcraft.yaml` file (replace anything else that might be there):

```yaml
parts:
  gnu-hello:
    source: http://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz
    plugin: autotools
```

So we have added a part called `gnu-hello` (its name is arbitrary). For 'source', we specified a tarball located on the GNU project's FTP server. As 'plugin' we've chosen `autotools` which uses the traditional `./configure && make && make install` build steps.

See [Supported plugins][supported-plugins], or run `snapcraft list-plugins`, to get more information on which build-tools and platforms Snapcraft supports.

To build our snap all you need to do is:

```bash
$ snapcraft
```

The first time you run snapcraft, you may be asked for permission to install [Multipass][multipass]. Snapcraft uses Multipass to both simplify the build process and to confine the build environment within a virtual machine. It offers the best build experience, so we highly recommend answering 'y'. However, if you'd rather not use Multipass, you can also build natively, remotely, and with LXD. See [Build options][build-options] for details.

During the build, snapcraft will show plenty of output, however a successful build will end with:

```no-highlight
[...]
Staging gnu-hello
Priming gnu-hello
Snapping 'hello' |                                          	 
Snapped hello_2.10_amd64.snap
```

Congratulations! You've just built your first snap, which is now ready to be installed:

```bash
$ sudo snap install --devmode hello_2.10_amd64.snap
```

The output should declare:

```no-highlight
hello 2.10 installed
```

To get some info on the installed snap:

```bash
$ snap list hello
```

Sample output:

```no-highlight
Name   Version  Rev  Tracking  Developer  Notes
hello  2.10     x1   -         -          devmode
```

Let's try to execute it:

```bash
$ hello
```

On traditional Ubuntu you will get:

```no-highlight
The program 'hello' can be found in the following packages:
 * hello
 * hello-traditional
Try: sudo apt install <selected package>
```

Or you might get a different error if you previously installed the `hello` snap:

```bash
$ hello
```

Output:

```no-highlight
bash: /snap/bin/hello No such file
```

The command doesn't exist despite being part of our snap and installed! Indeed, snaps don't expose anything to the user by default (command, services, etc.). We have to do this explicitly and that's exactly what you are going to tackle next!

negative
: If it *does* work for you, you should verify that it's the correct `hello` command. Check the output of `which hello` - it might list something like `/usr/bin/hello`. What we're after is a binary under the `/snap/bin` directory.


## Exposing an app via your snap!
Duration: 3:00

positive
: *Lost or starting from here?*
This [snapshot][step6] shows what your directory should look like at this point.

### Defining commands

In order for services and commands to be exposed to users, you need to specify them in `snapcraft.yaml` of course! This will take care of a couple of things for you:

- it will make sure that services are automatically started/stopped
- all commands will be "namespaced", so that you could, for example, install the same snap from different publishers and still be able to run the snaps separately

Exposing the `hello` command is painless. All you need to do is add the following to your `snapcraft.yaml` file:

```yaml
apps:
  hello:
    command: bin/hello
```

This defines an app named `hello`, which points to the executable `bin/hello` in the directory structure shipped by the snap.

We generally advise to put this stanza between the metadata fields and the 'parts' field. Technically the order doesn't matter, but it makes sense to place basic pieces before more complex ones.

Our `snapcraft.yaml` file should now resemble this:

```yaml
name: hello
version: '2.10'
summary: GNU Hello, the "hello world" snap
description: |
  GNU hello prints a friendly greeting.
grade: devel
confinement: devmode

apps:
  hello:
    command: bin/hello

parts:
  gnu-hello:
    source: http://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz
    plugin: autotools
```

### Iterating over your snap

Now that the command is defined, let's rebuild the snap. You can do do this by simply running _snapcraft_ again - only the new or changed elements will be built and merged into a new snap.

However, to show a more typical snap-building process, we're going to use a slightly different command that will allow us to peek into the snap we're building _before_ the snap is created:

```bash
$ snapcraft prime --shell
```

This command tells snapcraft to run the build up until the "prime" step and open a shell within the snap build environment, with _prime_ being the final stage in a four step process:

1. pull: downloads or otherwise retrieves the components needed to build the part
1. build: constructs the part from the previously pulled components
1. copies the built components into the staging area
1. copies the staged components into the priming area, to their final locations for the resulting snap. 

Another useful command is `snapcraft --debug`. This will open a shell in the build environment when an error occurs, letting you investigate the error before resuming the build.

From within the shell, you can see that while the binary we just added is in the _stage_ directory, it's not yet in _prime_:

```bash
$ ls stage/bin/
hello
$ ls prime/bin/
ls: cannot access 'prime/bin': No such file or directory
```

You can continue building your snap from within the build environment using the same _snapcraft_ commands you use outside, with the convenience of having a prompt directly within the environment. To build the prime stage, for example, just type `snapcraft prime`:

```bash
$ snapcraft prime
Skipping pull gnu-hello (already ran)
Skipping build gnu-hello (already ran)
Skipping stage gnu-hello (already ran)
Priming gnu-hello
```

The _hello_ binary will now be in the _prime/bin_ directory:

```bash
$ ls prime/bin
hello
```
To resume the build and generate the snap, you can type `snapcraft` within the build environment, or _exit_ and run `snapcraft` again from there. Either way, the resultant snap will be placed in the snap project directory.

We can now re-install the new snap and run _hello_:

```bash
$ hello
Hello, world!
```

The path for the binary should be correctly set too:

```bash
$ which hello
/snap/bin/hello
```

Well done! You've just made your first working snap!

## A snap is made of parts
Duration: 3:00

positive
: *Lost or starting from here?*
This [snapshot][step3] shows what your directory should look like at this point.

Let's add another part to make the snap a bit more interesting. In the 'parts' definition, make an addition:

```yaml
parts:
  [...]
  gnu-bash:
    source: http://ftp.gnu.org/gnu/bash/bash-4.3.tar.gz
    plugin: autotools
```

You will notice that this part (named `gnu-bash`) works very much like the `gnu-hello` part from before: it downloads a tarball and builds it using the `autotools` plugin.

As we did before, we need to define the command we want to expose. Let's do this now. In the 'apps' definition, add:

```yaml
apps:
  [...]
  bash:
    command: bash
```

This time the command name is different from the snap name. By default, all commands are exposed to the user as `<snap-name>.<command-name>`. This binary will thus be `hello.bash`. That way, we will avoid a clash with `/bin/bash` (system binaries trump binaries shipped by snaps) or any other snaps shipping a `bash` command. However, as you may remember, the first binary is named `hello`. This is due to the simplification when <command-name> equals <snap-name>. Instead of `hello.hello`, we
have the command condensed to `hello`.

Our snap will thus result in two binaries being shipped: `hello` and `hello.bash`.

Note that we set `bash` as the command parameter, and not `bin/bash` relative to the system snap directory (`$SNAP=/snap/hello/current`) as we did for `hello`. Both are equally valid because `snapcraft` and `snapd` create a small wrapper around your executable command which sets some environment variables. Technically, `$SNAP/bin` will be prepended to your `$PATH` for this snap. This avoids the need to set the path explicitly. This topic will be touched upon in upcoming sections.

Now re-do the build:

```bash
$ snapcraft
```

Only the `gnu-bash` part will be built now (as nothing changed in the other part). This makes things quicker but since Bash is itself a significant piece of software this command will still take quite some time to complete.

Install the resulting snap again and check whether the new binary is available:

```bash
$ hello
Hello, world!
```

Now try bash:

```bash
$ hello.bash
```
The above should yield:

```no-highlight
bash-4.3$ env
[ outputs a list of environment variables ]
```

Now exit that Bash shell:

```bash
bash-4.3$ exit
```

You will see that the environment variables available from your snap are a little different from your user environment. Some additional variables are added like `$SNAP_` and some system environment variables have been altered to point to your snap directory, like `$PATH` or `$LD_LIBRARY_PATH`. Take the time to get familiar with them!

See [Environment variables][environment-variables] for further details.

Excellent work! You have it all nice and working!

## Removing devmode
Duration: 2:00

positive
: *Lost or starting from here?*
This [snapshot][step4] shows what your directory should look like at this point.

One last thing you might want to do before the snap is ready for wider consumption is to remove the `devmode` status.

negative
: **Important:**
Users of snaps using `devmode` will need to pass `--devmode` during the installation, so they explicitly agree to trust you and your snap. Another benefit of removing `devmode` is that you will be able to ship your snap on the 'stable' or 'candidate' channels (you can only release to the other channels, like 'beta' or 'edge' as your snap is less trusted) and users will be able to search for it using `snap find`.

For this to be declared in your snap, let's set `confinement` to `strict` in `snapcraft.yaml`:

```yaml
confinement: strict
```

Now let's build the snap and install it properly! That is, we are going to call `snapcraft` without `--devmode` to really test it under confinement:

```bash
$ snapcraft
[...]
$ sudo snap install hello_2.10_amd64.snap
```

positive
: **Note:**
We got the snap package name from the last output line from the `snapcraft` command.

Yikes! This gives:

```no-highlight
error: cannot find signatures with metadata for snap "hello_2.10_amd64.snap"
```

Indeed, we tried to install a snap that wasn't signed by the Snap Store. Previously, we performed local installations via `--devmode` which implied (in addition to being run without confinement) that an unsigned snap was OK to be installed. As this is not the case any more we need to indicate that it's OK to install an unsigned snap. This is done via the `--dangerous` option:

```bash
$ sudo snap install hello_2.10_amd64.snap --dangerous
```

Test again!

```bash
$ hello
Hello, world!
```

Creating a new shell

```bash
$ hello.bash
```
...and issue a command there:

```no-highlight
bash-4.3$ ls
```

now gives:

```no-highlight
ls: cannot open directory '.': Permission denied
```

Exit the shell for now:

```bash
bash-4.3$ exit
```

What's happening here? Your snap is not broken, it's just confined now and so it can only access its own respective directories.

positive
: **Note:**
For other snaps you might need to declare if commands or services need special permissions (e.g. access to the network or audio). A tutorial on "interfaces", "slots", and "plugs" will cover this very topic.

You are done. This snap is ready for publication. Awesome!

## Push to the store
Duration: 5:00

positive
: *Lost or starting from here?*
This [snapshot][step5] shows what your directory should look like at this point.

Applications are easily uploaded to the [Snap Store](https://snapcraft.io/discover/). Registering an account is easy, so let's do that first.

### Registering an account

Begin by going to the [Snapcraft dashboard][snapcraft-dashboard] and clicking on the "Sign in or register" button in the top-right corner:

![IMAGE][asset_snapcraft-dashboard]

If you do not already have an Ubuntu One (SSO) account then select "I am a new Ubuntu One user" and complete the needed data:

![IMAGE](https://assets.ubuntu.com/v1/47ddef27-Screenshot-2017-12-8+Log+in.png)

Once logged into Ubuntu One you will see your name in the top-right corner. Click your name to reveal a menu and then choose "Account details". You will need to agree to the Developer Terms and Conditions before clicking the green "Sign up" button:

![IMAGE][asset_snapcraft-account-settings]

Your current settings will be displayed. Review them. Your "Snap store username" may be preset and non-editable. There are "Contact details" you may wish to fill out as well as a personal photo to upload.

If you made any changes, press the green "Update my account" button.

### Command-line authentication

We'll now log in with the snapcraft command using your new account. The first time you do so you will be asked to enable multi-factor authentication and agree with the developer terms & conditions:

```bash
$ snapcraft login
```

A sample session follows:

```no-highlight
Enter your Ubuntu One e-mail address and password.
If you do not have an Ubuntu One account, you can create one at https://snapcraft.io/account
Email: myemail@provider.com
Password:
Second-factor auth: (press Enter if you don't use two-factor authentication):

Login successful.
```

You can log out any time with `snapcraft logout`.

### Register a snap name

Before being able to upload a snap, you will need to register (reserve) a name for it. This is done with `snapcraft register <some_name>`.

Here, assuming *javier* is the store username established above, we'll do:

```bash
$ snapcraft register hello-javier
```

A sample session follows:

```no-highlight
We always want to ensure that users get the software they expect
for a particular name.

If needed, we will rename snaps to ensure that a particular name
reflects the software most widely expected by our community.

For example, most people would expect 'thunderbird' to be published by
Mozilla. They would also expect to be able to get other snaps of
Thunderbird as 'thunderbird-$username'.

Would you say that MOST users will expect 'hello-javier' to come from
You, and be the software you intend to publish there? [y/N]: y

Registering hello-javier.
Congratulations! You're now the publisher for 'hello-javier'.
```

Clearly, the Store prefers the name to be of the format `<local snap name>-<store-username>`.

The snap name `hello-javier` is different from `hello` that we initially placed in our `snapcraft.yaml` file. We will need to edit that file accordingly and rebuild the snap. This is also an opportune time to change the 'grade' to 'stable'!

The file should now include the following lines:

```yaml
name: hello-javier
grade: stable
```

Rebuild:

```bash
$ snapcraft
```

You should now have a snap package called `hello_-javier_2.10_amd64.snap`.

positive
: **Note:**
Recall that you already installed a snap package called `hello_2.10_amd64.snap`. Don't forget to uninstall it with `sudo snap remove hello`.

### Push and release your snap

It's time to make this snap available to the world!

Let's release it to the 'candidate' channel for now:

```bash
snapcraft push hello-javier_2.10_amd64.snap --release=candidate
```

Output:

```no-highlight
Pushing hello-javier_2.10_amd64.snap
After pushing, an attempt will be made to release to 'candidate'
Preparing to push '/home/ubuntu/mysnaps/hello/hello-javier_2.10_amd64.snap' to the store.
Pushing hello-javier_2.10_amd64.snap [=====================================================] 100%
Processing...|                                                                                                                                                                                                      
Ready to release!
Revision 1 of 'hello-javier' created.
Track    Arch    Channel    Version    Revision
latest   amd64   stable     -          -
                 candidate  2.10       1
                 beta       ^          ^
                 edge       ^          ^
The 'candidate' channel is now open.
```

You should receive an email informing you that your snap is pending review (automatic checking). If you are not using any reserved interfaces and security checks are passing, users will be able to install it like so:

```bash
$ sudo snap install hello-javier --channel=candidate
```

As we uploaded an amd64 binary, only people on 64-bit machines will get access to this snap. You can either focus on one architecture to support, manually build a binary for each architecture you wish to support, or use _remote build_ or [build.snapcraft.io](https://build.snapcraft.io) to push your `snapcraft.yaml`, and get resulting snaps built on all architectures for you!

See [Build options][build-options] for more details.

From here, if you are happy with the testing of your snap, you can use the `snapcraft release` command to have fine-grained control over what you are releasing and where:

`snapcraft release <snap-name> <revision> <channel>`

Therefore, to release `hello-javier` to the 'stable' channel, and make it immediately visible in
the Store:

```bash
$ snapcraft release hello-javier 1 stable
```

Remember that snaps with `confinement: devmode` can't be released to the 'stable' or 'candidate' channels.

The web interface will give you information about the publication status. Take a look to see all the available options!

## That's all folks!
Duration: 1:00

### Easy, wasn't it?

Congratulations! You made it!

By now you will have built your first snap, fixed build issues, exposed user commands, learned about uploading snaps to the Snap Store, and found out about a lot of other useful details (plugins, snapcraft help, channels, etc.).

positive
: **Final code:**
Your final directory should now look like this [snapshot][final]. You can use it to build a snap if you only read through this tutorial!

### Next steps

  - Take a look at tutorial [Build a nodejs service snap][tutorial_build-a-nodejs-service-snap].
    It is the logical follow-up to this tutorial. It includes debugging techniques, more
    information on confinement, and how to package a snap as a service.
  - Learn some advanced snap coding techniques by looking at some of the other snap tutorials.
  - Join the Snapcraft community on the [Snapcraft forum][snapcraft-forum].

### Further readings

  - See the [Snapcraft documentation][snapcraft-documentation] for the definitive snap and
    snapcraft documentation.
  - The [Snapcraft command reference][snapcraft-command-reference] covers all command syntax and
    options, including those for the daemon.


<!-- LINKS -->

[what-are-snaps]: https://snapcraft.io/docs/getting-started
[ubuntu-bionic]: http://releases.ubuntu.com/18.04/
[tutorial_basic-snap-usage]: https://snapcraft.io/docs/getting-started
[step3]: https://github.com/ubuntu/snap-tutorials-code/tree/master/create-your-first-snap/step3
[step4]: https://github.com/ubuntu/snap-tutorials-code/tree/master/create-your-first-snap/step4
[step5]: https://github.com/ubuntu/snap-tutorials-code/tree/master/create-your-first-snap/step5
[step6]: https://github.com/ubuntu/snap-tutorials-code/tree/master/create-your-first-snap/step6
[final]: https://github.com/ubuntu/snap-tutorials-code/tree/master/create-your-first-snap/final
[tutorial_build-a-nodejs-service-snap]: https://tutorials.ubuntu.com/tutorial/build-a-nodejs-service
[snapcraft-forum]: https://forum.snapcraft.io/
[snapcraft-documentation]: http://snapcraft.io/docs/
[snapcraft-command-reference]: http://snapcraft.io/docs/build-snaps/syntax
[snapcraft-dashboard]: https://dashboard.snapcraft.io/
[installing-snapd]: https://snapcraft.io/docs/installing-snapd
[snap-confinement]: https://snapcraft.io/docs/snap-confinement
[creating-a-snap]: https://snapcraft.io/docs/creating-a-snap
[global-metadata]: https://snapcraft.io/docs/adding-global-metadata
[supported-plugins]: https://snapcraft.io/docs/supported-plugins
[multipass]: https://multipass.run/
[environment-variables]: https://snapcraft.io/docs/environment-variables
[build-options]: https://snapcraft.io/docs/build-options

[asset_snapcraft-dashboard]: https://assets.ubuntu.com/v1/21aca2dd-snapcraft-dashboard.png
[asset_snapcraft-account-settings]: https://assets.ubuntu.com/v1/4a0c07e0-snapcraft-account-settings.png
