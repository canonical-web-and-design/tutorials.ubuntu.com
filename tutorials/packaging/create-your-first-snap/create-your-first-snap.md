---
id: create-your-first-snap
summary: We are going to use snapcraft to walk you through the creation of your first snap and main snapcraft concepts.
categories: packaging
status: published
tags: snapcraft, usage, build, beginner, idf-2016
difficulty: 1
published: 2018-07-12
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Canonical Web Team <webteam@canonical.com>

---

# Create your first snap

## Overview
Duration: 1:00

The `snapcraft` tool is the preferred way to build snaps. It reads a simple, declarative file and
runs the build for us. We will get to play with snapcraft, see how easy it is to use and create our
first snap along the way.

![IMAGE](https://assets.ubuntu.com/v1/074862f8-snaps-hero.png)

### What you'll learn

  - How to install the snapcraft tool.
  - How to create a new project.
  - How to declare snap metadata.
  - How an app is made of parts.
  - How to build a snap and to fix common build issues.
  - How to upload a snap to the Snap Store.

### What you'll need

  - Ubuntu installed
  - Some basic knowledge of command line use. To know how to edit a file.
  - Rudimentary knowledge of snaps. Tutorial [Basic snap usage][tutorial_basic-snap-usage] is a
    good introduction to snaps.

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

This tutorial requires an Ubuntu 16.04 LTS (Xenial) based system, such as:

* A native Ubuntu 16.04 installation
* A GNU/Linux distribution derived from an Ubuntu 16.04 base (eg. Linux Mint 18.x)
* An Ubuntu 16.04 virtual machine
* An Ubuntu 16.04 [LXD](https://linuxcontainers.org/lxd/getting-started-cli/) or [Docker](https://hub.docker.com/_/ubuntu/) container

negative
: **NOTE:**
This tutorial has been written to work with Ubuntu 16.04 LTS (Xenial Xerus) and its point releases only, and may not work with later Ubuntu releases.

### Installing dependencies

We will now update the APT database and install some additional build tools we are going to need:

```bash
sudo apt update
sudo apt install build-essential
```

We will now install snapcraft, the utility for building snaps:

```bash
sudo snap install --classic snapcraft
```

positive
: **NOTE:**
    * If the `snap` command is not available, install the `snapd` package via APT.
    * The `--classic` switch enables the installation of a snap that uses *classic confinement*.  We discuss snap security confinement in the following section.

We're all set. Let's get cracking and build our first snap!

## Building a snap is easy
Duration: 4:00

### Starting the project

The first thing to do is to create a general snaps directory followed by a working directory for
this specific snap project:

```bash
mkdir -p ~/mysnaps/hello
cd ~/mysnaps/hello
```

**It is from within this `hello` directory where we will invoke all subsequent commands.**

negative
: **NOTE:** Due to the limitation of GNU Hello's build system, the path of the directory you put the `hello` directory in *shouldn't contain any spaces*.

Get started by initialising your snap:

```bash
snapcraft init
```

This created a `snapcraft.yaml` in which you declare how the snap is built and which properties it
exposes to the user. We will edit this later.

The directory structure looks like this:

```no-highlight
mysnaps/
└── hello
    └── snap
        └── snapcraft.yaml
```

positive
: **Note:**
Any future snap would be put in its own directory under `mysnaps`.

### Describing the snap

Let's take a look at the top part of your snapcraft.yaml file. It should look somewhat as shown
below:

```yaml
name: my-snap-name # you probably want to 'snapcraft register <name>'
version: '0.1' # just for humans, typically '1.2+git' or '1.3.2'
summary: Single-line elevator pitch for your amazing snap # 79 char long summary
description: |
  This is my-snap's description. You have a paragraph or two to tell the
  most important story about your snap. Keep it under 100 words though,
  we live in tweetspace and your description wants to look good in the snap
  store.

grade: devel # must be 'stable' to release into 'candidate' and 'stable' channels
confinement: devmode # use 'strict' once you have the right plugs and slots
```

This part of `snapcraft.yaml` is mandatory and is basic metadata for the snap.
Let's go through this line by line:

  - **name**: The name of the snap.

  - **version**: The current version of the snap. This is just a human readable string. All snap
    uploads will get an incremental snap **revision**, which is independent from this version. It's
    separated so that you can upload multiple times the same snap for the same architecture with
    the same version. See it as a string that indicates to your user the current version, like
    "stable", "2.0", etc.

  - **summary**: A short, one-line summary or tag-line for your snap.

  - **description**: A longer description of the snap. It can span over multiple lines if prefixed
    with the '|' character.

  - **grade**: Can be used by the publisher to indicate the quality confidence in the build. The
    store will prevent publishing 'devel' grade builds to the 'stable' channel.

  - **confinement**: Can be either 'devmode',  'strict', or 'classic'. A newly-developed snap should start out
    in `devmode`. Security requirements can get in the way during development and 'devmode' eases
    these requirements. Security aspects like confinement can be addressed once the snap is
    working.  If there are technical issues that obstruct the confinement of a snap, it may also be developed and released using `classic` confinement. *Classic* imposes no additional restrictions and effectively grants device ownership to the snap. Consequently, snaps using *classic* confinement require a manual review before being released to the store (see [Classic confinement review process](https://forum.snapcraft.io/t/process-for-reviewing-classic-confinement-snaps/1460) for further details).
    
    However, in this tutorial we will only focus on `devmode` and `strict` confinement.

So much for the basics. Let's customise this for your own snap. Change the top of the file to be:

```no-highlight
name: hello
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

A snap can consist of multiple parts. Here are a few examples of this:

  - Snaps with separate logical parts, e.g. a server snap, which contains a web server, a database
    and the application itself or a game which ships the game engine and game data for three
    different games, each one being defined in its own part.
  - Snaps with parts which come from different locations.
  - Parts which are built in a different way.

Our `hello` snap will be nice and simple. It will consist of only one part for now. In the
following pages we are going to gradually extend it.

Two must-haves for every part are the 'source' and 'plugin' definition. Think of these as the
"what" and the "how", respectively. As source you can, for example, pick a source repository (like
`git`), a tarball, or a local directory. Snapcraft supports many plugins, allowing you to build
a wide variety of project types (e.g. autotools, cmake, go, maven, nodejs, python2, python3).

To build `hello`, add the following 'parts' stanza to your `snapcraft.yaml` file (replace anything
else that might be there):

```yaml
parts:
  gnu-hello:
    source: http://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz
    plugin: autotools
```

So we have added a part called `gnu-hello` (its name is arbitrary). As 'source' we specified a
tarball located on the GNU project's FTP server. As 'plugin' we've chosen `autotools` which uses
the traditional `./configure && make && make install` build steps.

You can get the exhaustive list of supported snapcraft plugins with `snapcraft list-plugins`
command. Those maps popular build tools that projects could use.

To build our snap all you need to do is:

```bash
snapcraft
```

There will be much output but a successful build should end with:

```no-highlight
[...]
Staging gnu-hello
Priming gnu-hello
Snapping 'hello' |                                          	 
Snapped hello_2.10_amd64.snap
```

You will be prompted for the system password to install any missing dependencies.

The directory structure has now become:

```no-highlight
mysnaps/
└── hello
    ├── hello_2.10_amd64.snap
    ├── parts
    │   └── gnu-hello
    │       ├── build
    │       ├── install
    │       ├── src
    │       └── state
    ├── prime
    │   ├── bin
    │   │   └── hello
    │   ├── meta
    │   │   └── snap.yaml
    │   ├── share
    │   │   ├── info
    │   │   ├── locale
    │   │   └── man
    │   └── snap
    ├── snap
    │   └── snapcraft.yaml
    └── stage
        ├── bin
        │   └── hello
        └── share
            ├── info
            ├── locale
            └── man
```

Congratulations! Your snap is now ready to be installed:

```bash
sudo snap install --devmode hello_2.10_amd64.snap
snap list
```

The output should declare:

```no-highlight
hello 2.10 installed
```

To get some info on the installed snap:

```bash
snap list hello
```

Sample output:

```no-highlight
Name   Version  Rev  Tracking  Developer  Notes
hello  2.10     x1   -         -          devmode
```

Let's try to execute it:

```bash
hello
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
hello
```

Output:

```no-highlight
bash: /snap/bin/hello No such file
```

The command doesn't exist despite being part of our snap and installed! Indeed, snaps don't expose
anything to the user by default (command, services, etc.). We have to do this explicitly and that's
exactly what you are going to tackle next!

negative
: If it *does* work for you, you should verify that it's the correct `hello` command. Check the
output of `which hello` - it might list something like `/usr/bin/hello`. What we're after is a
binary under the `/snap/bin` directory.

## Exposing an app via your snap!
Duration: 3:00

positive
: *Lost or starting from here?*
This [snapshot][step6] shows what your directory should look like at this point.

### Defining commands

In order for services and commands to be exposed to users, you need to specify them in
`snapcraft.yaml` of course! This will take care of a couple of things for you:

  - It will make sure that services are automatically started/stopped.
  - All commands will be "namespaced", so that you could for example install the same snap from
    different publishers and still be able to run the snaps separately.

Exposing the `hello` command is painless. All you need to do is add the following to your
`snapcraft.yaml` file:

```yaml
apps:
  hello:
    command: bin/hello
```

This defines an app named `hello`, which points to the executable `bin/hello` in the directory
structure shipped by the snap.

We generally advise to put this stanza between the metadata fields and the 'parts' field.
Technically the order doesn't matter, but it makes sense to place basic pieces before more complex
ones.

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

Now that the command is defined let's rebuild the snap. Instead of running snapcraft, here's a
technique to quickly iterate over your snap during development:

```bash
snapcraft prime
```

What we did was tell snapcraft to run the build up until the "prime" step. That is, we are
omitting the "pack" step (see lower down for an explanation of each step in a snapcraft
lifecycle). What this invocation gives therefore are the unpacked contents of a snap.

We can then provide this content to `snap try`:

```bash
sudo snap try --devmode prime
```

This gives:

```no-highlight
hello 2.10 mounted from /home/ubuntu/mysnaps/hello/prime
```

So an unpacked snap was "installed" for testing purposes. Note that any non-metadata changes will
take effect instantly, thereby expediting your testing.

positive
: **Note:**
The different steps of [the snapcraft lifecycle](https://docs.snapcraft.io/snapcraft-lifecycle/5123) are: "pull" (download source for all parts), "build", "stage"
(consolidate installed files of all parts), "prime" (distill down to just the desired files), and
"pack" (create a snap out of the prime/ directory). Each step depends on the successful completion
of the previous one.

Things should be working now. Let's test:

```bash
hello
```

Expected output:

```no-highlight
Hello, world!
```
And

```bash
which hello
```

should give:

```no-highlight
/snap/bin/hello
```

Well done! You've just made your first working snap!

negative
: **Important:**
If `hello` does not run and you get the error `cannot change current working directory to the
original directory: No such file or directory` then most likely you are developing the snap in a
directory other than your home directory. An example of a directory that would generate this error,
is the `/tmp/` directory. Fix it by uninstalling the snap with `sudo snap remove hello` and
starting over.

## A snap is made of parts
Duration: 3:00

positive
: *Lost or starting from here?*
This [snapshot][step3] shows what your directory should look like at this point.

Let's add another part to make the snap a bit more interesting. In the 'parts' definition, make an
addition:

```yaml
parts:
  [...]
  gnu-bash:
    source: http://ftp.gnu.org/gnu/bash/bash-4.3.tar.gz
    plugin: autotools
```

You will notice that this part (named `gnu-bash`) works very much like the `gnu-hello` part from
before: it downloads a tarball and builds it using the `autotools` plugin.

As we did before, we need to define the command we want to expose. Let's do this now. In the 'apps'
definition, add:

```yaml
apps:
  [...]
  bash:
    command: bash
```

This time the command name is different from the snap name. By default, all commands are exposed to
the user as `<snap-name>.<command-name>`. This binary will thus be `hello.bash`. That way we will
avoid a clash with `/bin/bash` (system binaries trump binaries shipped by snaps) or any other snaps
shipping a `bash` command. However, as you may remember, the first binary is named `hello`. This is
due to the simplification when <command-name> equals <snap-name>. Instead of `hello.hello`, we
have the command condensed to `hello`.

Our snap will thus result in two binaries being shipped: `hello` and `hello.bash`.

Note that we set `bash` as the command parameter, and not `bin/bash` relative to the system snap
directory (`$SNAP=/snap/hello/current`) as we did for `hello`. Both are equally valid because `snapcraft` and
`snapd` create a small wrapper around your executable command which sets some environment
variables. Technically, `$SNAP/bin` will be prepended to your `$PATH` for this snap. This avoids
the need to set the path explicitly. This topic will be touched upon in upcoming sections.

Now re-do the build using our previous trick:

```bash
snapcraft prime
```

Only the `gnu-bash` part will be built now (as nothing changed in the other part). This makes
things quicker but since Bash is itself a significant piece of software this command will still
take quite some time to complete.

### Our first build failure

Oh nooo! The build stops with:

```no-highlight
Failed to stage: Parts 'gnu-bash' and 'gnu-hello' have the following files, but with different contents:
    share/info/dir
```

What does this mean? Both our `gnu-hello` and `gnu-bash` parts want to ship a version of
`share/info/dir` with differing contents. The two most common ways to rectify this kind of problem
are:

  - Instruct only one of the two parts to place content in this directory. We can also tell both
    to supress the content. Which solution depends on the necessity of said content. Either is
    achieved by influencing the 'snap' and 'stage' steps.
  - Change the directory location for one of the two parts.

Luckily the second option is easy to implement and it's nice being able to ship both. The
`./configure` script of Bash comes with an `--infodir` option that does what we want. Let's use
`/var/bash/info`:

```yaml
parts:
  [...]
  gnu-bash:
    source: http://ftp.gnu.org/gnu/bash/bash-4.3.tar.gz
    plugin: autotools
    configflags: ["--infodir=/var/bash/info"]
```

This will cause `--infodir=/var/bash/info` to be passed as an argument to `./configure` during the
build.

The `configflags` option is specific to the `autotools` plugin. Luckily `snapcraft` comes with a
built-in help system. You can discover all the options by running:

   - `snapcraft help sources` for source options
   - `snapcraft help <plugin-name>` for any given plugin
   - `snapcraft list-plugins` for a list of all available plugins

Now run:

```bash
snapcraft clean gnu-bash -s build
snapcraft prime
```

Here you clean just the build step of the `gnu-bash` part, so the source does not need to be
re-downloaded. Then the build is run again and it passes! Now let's see if both our commands work:

```bash
sudo snap try --devmode prime
hello
```

This should give:

```no-highlight
Hello, world!
```

And

```bash
hello.bash
```

should yield:

```no-highlight
bash-4.3$ env
[ outputs a list of environment variables ]
```

Now exit that Bash shell:

```bash
bash-4.3$ exit
```

positive
: **Note:**
You will see that the environment variables available from your snap are a little different from
your user environment. Some additional variables are added like `$SNAP_` and some system
environment variables have been altered to point to your snap directory, like `$PATH` or
`$LD_LIBRARY_PATH`. Take the time to get familiar with them!

Excellent work! You have it all nice and working!

## Removing devmode
Duration: 2:00

positive
: *Lost or starting from here?*
This [snapshot][step4] shows what your directory should look like at this point.

One last thing you might want to do before the snap is ready for wider consumption is to remove the
`devmode` status.

negative
: **Important:**
Users of snaps using `devmode`, will need to pass `--devmode` during the installation, so they
explicitly agree to trust you and your snap. Another benefit of removing `devmode` is that you will
be able to ship your snap on the 'stable' or 'candidate' channels (you can only release to the
other channels, like 'beta' or 'edge' as your snap is less trusted) and users will be able to
search for it using `snap find`.

For this to be declared in your snap, let's set `confinement` to `strict` in `snapcraft.yaml`:

```yaml
confinement: strict
```

Now let's build the snap and install it properly! That is, we are going to call `snapcraft` without
`prime` and `snap install` (as opposed to `snap try`). You should also stop using the `--devmode`
switch to really test it under confinement:

```bash
snapcraft
sudo snap install hello_2.10_amd64.snap
```

positive
: **Note:**
We got the snap package name from the last output line from the `snapcraft` command.

Yikes! This gives:

```no-highlight
error: cannot find signatures with metadata for snap "hello_2.10_amd64.snap"
```

Indeed, we tried to install a snap that wasn't signed by the Snap Store. Previously, we performed
local installations via `--devmode` which implied (in addition to being run without confinement)
that an unsigned snap was OK to be installed. As this is not the case any more we need to indicate
that it's OK to install an unsigned snap. This is done via the `--dangerous` option:

```bash
sudo snap install hello_2.10_amd64.snap --dangerous
```

Test again!

```bash
hello
```

Yep:

```no-highlight
Hello, world!
```

Creating a new shell

```bash
hello.bash
```

and issue a command there:

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

What's happening here? Your snap is not broken, it's just confined now and so it can only access
its own respective directories.

positive
: **Note:**
For other snaps you might need to declare if commands or services need special permissions (e.g.
access to the network or audio). A tutorial on "interfaces", "slots", and "plugs" will cover this
very topic.

You are done. This snap is ready for publication. Awesome!

## Push to the store
Duration: 5:00

positive
: *Lost or starting from here?*
This [snapshot][step5] shows what your directory should look like at this point.

Applications are easily uploaded to the [Snap Store](https://snapcraft.io/discover/). Registering
an account is easy, so let's do that first.

### Registering an account

Begin by going to the [Snapcraft dashboard][snapcraft-dashboard] and clicking on the "Sign in or
register" button in the top-right corner:

![IMAGE][asset_snapcraft-dashboard]

If you do not already have an Ubuntu One (SSO) account then select "I am a new Ubuntu One user" and
complete the needed data:

![IMAGE](https://assets.ubuntu.com/v1/47ddef27-Screenshot-2017-12-8+Log+in.png)

Once logged into Ubuntu One you will see your name in the top-right corner. Click your name to
reveal a menu and then choose "Account details". You will need to agree to the Developer Terms and
Conditions before clicking the green "Sign up" button:

![IMAGE][asset_snapcraft-account-settings]

Your current settings will be displayed. Review them. Your "Snap store username" may be preset and
non-editable. There are "Contact details" you may wish to fill out as well as a personal photo to
upload.

If you made any changes, press the green "Update my account" button.

### Command-line authentication

We'll now log in with the snapcraft command using your new account. The first time you do so you
will be asked to enable multi-factor authentication and agree with the developer terms &
conditions:

```bash
snapcraft login
```

A sample session follows:

```no-highlight
Enter your Ubuntu One e-mail address and password.
If you do not have an Ubuntu One account, you can create one at https://dashboard.snapcraft.io/openid/login
Email: myemail@provider.com
Password:
One-time password (press Enter if you don't use two-factor authentication):
Authenticating against Ubuntu One SSO.
Login successful.
```

You can log out any time with `snapcraft logout`.

### Register a snap name

Before being able to upload a snap, you will need to register (reserve) a name for it. This is
done with `snapcraft register <some_name>`.

Here, assuming *javier* is the store username established above, we'll do:

```bash
snapcraft register hello-javier
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

The snap name `hello-javier` is different from `hello` that we initially placed in our
`snapcraft.yaml` file. We will need to edit that file accordingly and rebuild the snap. This is
also an opportune time to change the 'grade' to 'stable'!

The file should now include the following lines:

```yaml
name: hello-javier
grade: stable
```

Rebuild:

```bash
snapcraft
```

You should now have a snap package called `hello_-javier_2.10_amd64.snap`.

positive
: **Note:**
Recall that you already installed a snap package called `hello_2.10_amd64.snap`. Don't forget to
uninstall it with `sudo snap remove hello`.

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

You should receive an email informing you that your snap is pending review (automatic checking). If
you are not using any reserved interfaces and security checks are passing, users will be able to
install it like so:

```bash
sudo snap install hello-javier --channel=candidate
```

negative
: **Important:**
As we uploaded an amd64 binary, only people on 64-bit machines will get access to this snap. You
can either focus on one architecture to support, manually build a binary for each architecture you
wish to support, or use [build.snapcraft.io](https://build.snapcraft.io) to push your
`snapcraft.yaml`, and get resulting snaps built on all architectures for you!

From here, if you are happy with the testing of your snap, you can use the `snapcraft release`
command to have fine-grained control over what you are releasing and where:

`snapcraft release <snap-name> <revision> <channel>`

Therefore, to release `hello-javier` to the 'stable' channel, and make it immediately visible in
the Store:

```bash
snapcraft release hello-javier 1 stable
```

Remember that snaps with `confinement: devmode` can't be released to the 'stable' or 'candidate'
channels.

The web interface will give you information about the publication status. Take a look to see all
the available options!

## That's all folks!
Duration: 1:00

### Easy, wasn't it?

Congratulations! You made it!

By now you will have built your first snap, fixed build issues, exposed user commands, learned
about uploading snaps to the Snap Store, and found out about a lot of other useful details
(plugins, snapcraft help, channels, etc.).

positive
: **Final code:**
Your final directory should now look like this [snapshot][final]. You can use it to build a snap
if you only read through this tutorial!

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

[tutorial_basic-snap-usage]: https://tutorials.ubuntu.com/tutorial/basic-snap-usage
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

[asset_snapcraft-dashboard]: https://assets.ubuntu.com/v1/21aca2dd-snapcraft-dashboard.png
[asset_snapcraft-account-settings]: https://assets.ubuntu.com/v1/4a0c07e0-snapcraft-account-settings.png
