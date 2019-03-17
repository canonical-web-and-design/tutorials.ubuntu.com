---
id: snap-a-python-application
summary: In this tutorial, you’ll create a snap of a command-line utility for website benchmarking, called httpstat. This utility is written in Python and requires only access to the network to perform its task
categories: packaging
environment: snapcraft, usage, build, beginner, python
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
tags: python,network,interface
difficulty: 2
published: 2017-02-14
author: Canonical Web Team (formerly "simos") <webteam@canonical.com>

---

# Snap a Python application

## Overview
Duration: 1:00

Creating a snap doesn't have to mean writing a lot of code from scratch. There are already plenty of applications that would benefit from being available as a snap.
In this tutorial we are going to snap a network utility called [httpstat], which is written in Python. `httpstat` is a visualisation tool for curl, which displays useful information in a clear and easy to read way.

![IMAGE](https://assets.ubuntu.com/v1/7b88f509-httpstat-example-run.png)

The screenshot above shows the output of httpstat when we run it on [https://www.ubuntu.com]. `httpstat` shows how much time it took for each individual stage of the page transfer, in this case:

  - DNS Lookup
  - TCP Connection
  - SSL Handshake
  - Server Processing
  - Content Transfer

A system administrator would want to reduce those times as much as possible. For example, they could switch to a different server location, get a faster server or optimise the server software so that it delivers the content much faster. In this specific example, we actually learn that our connection was served by a reverse proxy (shown as jujube.canonical.com), which guarantees a very short time in server processing while the web page content remains unchanged.


### What you’ll learn

  - How to package a Python project with snapcraft
  - How to pull source code from a specific git tag
  - How to make a snap that is strictly confined

### What you’ll need

  - Ubuntu 16.04 or newer
  - Basic knowledge of the Linux command line
  - Some familiarity with snaps would help! (you can follow these two introductory tutorials: “[basic snap usage]” and “[create your first snap]”)

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience?
 - Novice
 - Intermediate
 - Proficient

## Get familiar with the project
Duration: 2:00

This project is a **Python** application. It has a very simple project layout with an installation and test script.

### Introspect the code

To be able to create the snap, we should also be a little familiar with the code, how it gets built and how it is run.

We are going to use `git` to fetch the source code. Install it with:

```bash
sudo apt update
sudo apt install git
```

Then, let's fetch the source from its repository:

```bash
git clone https://github.com/reorx/httpstat
```

If we take a look inside the directory

```bash
tree httpstat
```

...we can see that it is a flat file structure with only a few files:

```
httpstat/
├── httpstat.py
├── httpstat_test.sh
├── LICENSE
├── Makefile
├── README.md
├── screenshot.png
└── setup.py

```

For now, the two interesting files in that directory are:
  - `httpstat.py` corresponding to the main (and only!) source file, containing the code. You can execute it directly once it’s made executable.
  - `setup.py`, which is a standard Python installation script file. Running setup will build and install the project on the target host. The good news is that snapcraft has full support for projects following this best practice for Python.

You will note that this project has no `requirements.txt` file, meaning that there are no non-standard library modules used which would need to be pulled in at build time. If that were the case, snapcraft would have handled this for you, pulling the correct dependencies via pip, itself.

Do not hesitate to open the files to get familiar with them. Once you are done, you can remove that `httpstat` directory.


## Craft a working snap in devmode
Duration: 9:00

Now that we are familiar with the code we are going to snap, we can start doing some proper work!

### Make a scaffold

We are going to create a directory for the snapcraft project. We will pull the main source code directly from github each time we build the snap.
Let’s use `snapcraft` to scaffold an initial configuration file and then build on that to create the snap for `httpstat`.

Create the directory:

```bash
mkdir httpstat-snap
cd httpstat-snap
```
Then we can generate a snapcraft project there:

```bash
snapcraft init
```
You will hopefully receive the message:

```bash
Created snap/snapcraft.yaml.
Edit the file to your liking or run `snapcraft` to get started
```

The `init` option has created a template `snap/snapcraft.yaml`. The next step is to fill that with useful information!

### Add snapcraft.yaml metadata

Here is the first part of the httpstat `snapcraft.yaml`. Let’s add some metadata to it which describes our snap and the project. Change your file to match the following:


```bash
name: httpstat
version: '1.1.3'
summary: Curl statistics made simple
description: |
    httpstat is a utility that analyses show fast is a website
    when you are trying to connect to it.
    This utility is particularly useful to Web administrators.
grade: stable
confinement: devmode
```

First, for the a name, we use `httpstat`.

Second, we select a version. Instead of using the latest development version that might not work or might happen to be broken momentarily, you can pick and choose the stable branch or the latest tagged version from the repository.

![IMAGE](https://assets.ubuntu.com/v1/7faaf892-httpstat-tag.png)



The tag `v1.1.3` will do!

Third and fourth, we add a summary and a description from text we got from the `httpstat` GitHub page.

Fifth, we select a `grade`. That would be either `devel` (for development) or `stable`. This snap is going to land in the stable channel in the store.

Sixth, we select the **confinement** of the snap. As for other snaps, we are going to set it first as `devmode` before turning it to `strict` confinement later.


### Add a python part

This simple application is going to be made of a single part, referencing the GitHub source repository. We also know that we want to pull a certain revision (a git tag) and that the project is made with Python.

This translates into:

```yaml
parts:
  httpstat:
    source: https://github.com/reorx/httpstat.git
    source-tag: v1.1.3
    plugin: python
```

And that’s it! The `parts` section provides instructions as to how to process the `httpstat` target we added.


![IMAGE](https://assets.ubuntu.com/v1/716ad769-codelabs-httpstat-git-url.png)


We first specify the git URL for the source (note that it ends with .git) and then the tag version we want. The git URL is the same one that appears if you click on the `Clone or download` green button on the GitHub. More information on the source is available via the `snapcraft source` command.

We then specify that we want to use the `plugin: python`, which is a plugin that performs `python setup.py build` and `python setup.py install`.  The default behavior is to build a Python 3.x  program. The `python-version:` element can be specified to set the python version to 2. As we discussed previously, this project doesn’t have a requirements.txt file, so no dependencies will be pulled in by snapcraft. Otherwise, this would have been done conveniently for you, in a relocatable fashion! Note that `snapcraft help python` will give you way more information about the Python plugin:

```bash
The python plugin can be used for python 2 or 3 based parts.

It can be used for python projects where you would want to do:

    - import python modules with a requirements.txt
    - build a python project that has a setup.py
    - install packages straight from pip

This plugin uses the common plugin keywords as well as those for "sources".
For more information check the 'plugins' topic for the former and the
'sources' topic for the latter.

Additionally, this plugin uses the following plugin-specific keywords:

    - requirements:
      (string)
      Path to a requirements.txt file
    - constraints:
      (string)
      Path to a constraints file
    - process-dependency-links:
      (bool; default: false)
      Enable the processing of dependency links.
    - python-packages:
      (list)
      A list of dependencies to get from PyPi
    - python-version:
      (string; default: python3)
      The python version to use. Valid options are: python2 and python3
```

Although we are not finished with the metadata yet (we haven't exposed any commands), we can try to build it at this stage to make sure that we have the basic definition correct.

Run the command:

```bash
snapcraft prime
```

...and snapcraft will start building the snap. You will get a lot of feedback so you can see the whole process:

```bash
Preparing to pull httpstat                                              
Hit http://archive.ubuntu.com/ubuntu xenial InRelease                                                      
Get:1 http://archive.canonical.com xenial InRelease [11.5 kB]                                              
[…]
Fetched 6208 kB in 0s (0 B/s)                                                                              
Pulling httpstat
Cloning in '<…>/parts/httpstat/src'...
remote: Counting objects: 251, done.
remote: Total 251 (delta 0), reused 0 (delta 0), pack-reused 251
Réception d'objets: 100% (251/251), 330.03 KiB | 0 bytes/s, fait.
Résolution des deltas: 100% (138/138), fait.
Vérification de la connectivité... fait.
Note: checking out '0f0e653309982178302ec1d5023bda2de047a72d'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by performing another checkout.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -b with the checkout command again. Example:

  git checkout -b <new-branch-name>

Collecting pip
  Using cached pip-9.0.1-py2.py3-none-any.whl
  Saved ./parts/httpstat/packages/pip-9.0.1-py2.py3-none-any.whl
Collecting setuptools
  Downloading setuptools-34.2.0-py2.py3-none-any.whl (389kB)
    100% |████████████████████████████████| 399kB 2.2MB/s
  Saved ./parts/httpstat/packages/setuptools-34.2.0-py2.py3-none-any.whl
[…]
Installing collected packages: pip, six, appdirs, pyparsing, packaging, setuptools, wheel
Successfully installed appdirs packaging pip-8.1.1 pyparsing-2.0.3 setuptools-20.7.0 six-1.10.0 wheel-0.29.0
pip download --disable-pip-version-check --dest <…>/parts/httpstat/packages .
Processing <…>/step3/parts/httpstat/src
  Link is a directory, ignoring download_dir
Successfully downloaded httpstat
Preparing to build httpstat
Building httpstat
Collecting pip
  Saved /tmp/tmpmj_yh4e1/pip-9.0.1-py2.py3-none-any.whl
Collecting setuptools
  Saved /tmp/tmpmj_yh4e1/setuptools-34.2.0-py2.py3-none-any.whl
[…]
Successfully installed appdirs-1.4.0 packaging-16.8 pip-9.0.1 pyparsing-2.1.10 setuptools-34.2.0 six-1.10.0 wheel-0.29.0
pip wheel --disable-pip-version-check --no-index --find-links <…>/step3/parts/httpstat/packages --wheel-dir /tmp/tmpah1cbkq9 .
Processing <…>/step3/parts/httpstat/build
Building wheels for collected packages: httpstat
  Running setup.py bdist_wheel for httpstat ... done
  Stored in directory: /tmp/tmpah1cbkq9
Successfully built httpstat
DEPRECATION: The default format will switch to columns in the future. You can use --format=(legacy|columns) (or define a format=(legacy|columns) in your pip.conf under the [list] section) to disable this warning.
pip install --user --no-compile --disable-pip-version-check --no-index --find-links <…>/step3/parts/httpstat/packages httpstat --no-deps --upgrade
Collecting httpstat
Installing collected packages: httpstat
Successfully installed httpstat-1.1.3
Staging httpstat
Priming httpstat
```

Success! (Well, as long as you don’t have a typo in your yaml file ;)). Reading the log, you can see that the python plugin did some heavy lifting for you:

  - Installing pip, setuptools, and a lot of other tools (from the distribution and pip)
  - Putting the python3 binaries and standard library as part of the snap
  - Running `setup.py` which installs the `httpstat` binary. This one finally ends up as `prime/bin/httpstat`.



positive
: Note:
Do not hesitate to look at the content of the `prime/` directory. This is what will be in your final snap. You will really appreciate all the work snapcraft did for you there!


### Add the httpstat command

Ok, our httpstat project is being built, but we are missing something: a command to run it! Although the software is being built, you have to specify exactly what commands the snap will 'expose'.

Add in your `snapcraft.yaml`, between the top metadata and the `parts:` paragraph:


```bash
apps:
  httpstat:
    command: httpstat
```

We specify that the users will be running an executable named `httpstat` via the `command:` argument. We name that command `httpstat` itself.

That’s it? Yes it is!

positive
: If your application exposes more than one command, you just need to add more `command: <name>`
lines to this part of the snapcraft.yaml file and they will also be exposed.

Now lets build a working snap. Once again we run:

```bash
snapcraft prime
```
This time, the command can skip over the parts it has already done previously::

```
Skipping pull httpstat (already ran)
Skipping build httpstat (already ran)
Skipping stage httpstat (already ran)
Skipping prime httpstat (already ran)
```

And we're done! Let’s ship it.

Oh wait! Testing? Hum maybe… but let’s add a new section for this.


positive
: Note:
You will notice in the generated `command-httpstat.wrapper` file in the `prime/` directory that snapcraft 'python' plugin helped you by exporting  `$PYTHONUSERBASE` and `$PYTHONHOME` to reference your local Python installation. Nifty!


### Polishing our snap (or rather, making it work ;))

Ok, let’s see what this gets us when we try the snap on our system. First of all we need to activate the snap - we will use the temporary 'try' mode rather than a full install

```bash
sudo snap try --devmode prime/
```

Now we can try to run the command we exposed. Let's check the help!

```bash
httpstat --help
```

And we can see it works fine:

```bash
Usage: httpstat URL [CURL_OPTIONS]
       httpstat -h | --help
       httpstat --version

Arguments:
  URL     url to request, could be with or without `http(s)://` prefix

Options:
  CURL_OPTIONS  any curl supported options, except for -w -D -o -S -s,
                which are already used internally.
  -h --help     show this screen.
  --version     show version.

Environments:
  HTTPSTAT_SHOW_BODY    By default httpstat will write response body
                        in a tempfile, but you can let it print out by setting
                        this variable to `true`.
  HTTPSTAT_SHOW_SPEED   set to `true` to show download and upload speed.
```

Looks great! Let’s try now to get some statistics on https://www.ubuntu.com:


```bash
httpstat https://www.ubuntu.com
```

Ooops...

```bash
Traceback (most recent call last):
  File "/snap/httpstat/x1/bin/httpstat", line 11, in <module>
    sys.exit(main())
  File "/snap/httpstat/x1/lib/python3.5/site-packages/httpstat.py", line 155, in main
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=cmd_env)
  File "/snap/httpstat/x1/usr/lib/python3.5/subprocess.py", line 947, in __init__
    restore_signals, start_new_session)
  File "/snap/httpstat/x1/usr/lib/python3.5/subprocess.py", line 1551, in _execute_child
    raise child_exception_type(errno_num, err_msg)
FileNotFoundError: [Errno 2] No such file or directory: 'curl'
```

Ah, not so good...

The error message is helpful though: **No such file or directory: ‘curl’**. Indeed, `curl` is a separate binary, not part of httpstat or an imported Python module, and so we aren't shipping it as part of our snap. The `curl` package is available in the Ubuntu `apt` repositories though, so we can use the `stage-packages` functionality of snapcraft in order to re-use this available binary package:


```bash
parts:
  httpstat:
    […]
    stage-packages: [curl]
```

Here, we only add one package to the stage-packages list: `curl`.

negative
: Important: The error messages may be long and perhaps confusing. It is important to skim the whole error message for the interesting information. In the above case, we learn that the error produced a Python traceback (a trace of the instructions from start to the point of the error). At the end of the traceback, we get the important hint: `FileNotFoundError: [Errno 2] No such file or directory: 'curl'`. It could not find curl, one of the most common utilities for downloading content from websites. Every snap is considered "empty" or disconnected unless we explicitly add commands that are needed.

Let’s try again!

As we changed a part definition, we should clean out the cached stages first:

```bash
snapcraft clean
```
Which should confirm that the various directories are cleaned up:

```bash
Cleaning up priming area
Cleaning up staging area
Cleaning up parts directory
```

Now we can again prime the snap

```bash
snapcraft prime
```

...and activate it...

```bash
sudo snap try --devmode prime/
```

...and cross our fingers and run the command...

```bash
httpstat https://www.ubuntu.com
```

...and...

```bash
HTTP/1.1 200 OK
Date: Thu, 6 Jul 2017 14:44:40 GMT
Server: gunicorn/17.5
Strict-Transport-Security: max-age=15768000
Content-Type: text/html; charset=utf-8
Age: 173
Content-Length: 34074
X-Cache: HIT from privet.canonical.com
X-Cache-Lookup: HIT from privet.canonical.com:80
Via: 1.0 privet.canonical.com:80 (squid/2.7.STABLE7)
Vary: Accept-Encoding

Body stored in: /tmp/tmp3m7quqre

  DNS Lookup   TCP Connection   SSL Handshake   Server Processing   Content Transfer
[    61ms    |      17ms      |     230ms     |       20ms        |       38ms       ]
             |                |               |                   |                  |
    namelookup:61ms           |               |                   |                  |
                        connect:78ms          |                   |                  |
                                    pretransfer:308ms             |                  |
                                                      starttransfer:328ms            |
                                                                                 total:366ms  
```

Success! Before shipping our snap, to be able to publish in the stable channel, we need to turn confinement on though. But that’s for the next step, we have worked enough here!


## Let’s confine everything!
Duration: 4:00

Ok, the title may be a little bit catchy. Let’s start by confining this snap alone :)


positive
: Lost or starting from here?
Check or download [here] to see what your current directory should look like.


### Testing our current snap without modifying it

In other tutorials, we directly edited snapcraft.yaml and replaced `confinement: devmode` by `strict`, rebuilt the snap and so on. We will need to do that for the final snap. However, we can bypass this by now by installing our devmode snap with strict confinement.

How to do this? Quite easily:


```bash
$ sudo snap try --jailmode prime/
httpstat 1.1.3 mounted from <…>/prime
```

Using `--jailmode` forces any snap needing devmode to be fully confined.

Let’s give this a shot:


```bash
httpstat https://www.ubuntu.com
```

but this time we get:

```bash
curl -w <output-format> -D <tempfile> -o <tempfile> -s -S https://www.ubuntu.com
curl error: curl: (6) Could not resolve host: www.ubuntu.com
```

We are almost there, but as you saw, this didn’t work! Indeed, the snap does not have access to the Internet anymore because of the strict confinement. We need to declare the type of access we need (and no more than that - for example, the `httpstat` should still not have any access to the files in our home directory).


negative
: Important: The error message was curl error: `curl: (6) Couldn't resolve host 'www.ubuntu.com'`. When trying to make an Internet connection, an app needs to first _resolve_ the name of the server into the IP address. When there is no access to the Internet, the `resolve` (the first step towards a network connection) will not work, thus this error. A snap with `confinement: strict` does not have any access to the Internet, unless explicitly allowed.

### Enabling access to network

To allow networking access to a snap, we need to specify that networking is OK for this snap. `network` is an **interface** in snaps and it is one of the many supported interfaces for snaps. There is the notion of `plugs` (provider of resource) and `slots` (consumer of resource). For most cases, like this one here, we need a plug, a plug for network.

Let’s edit our `snapcraft.yaml` and declare for our `httpstat` command this access:


```bash
apps:
  httpstat:
    command: httpstat
    plugs: [network]
```

While we are at it and before we rebuild our snap, let’s change the `confinement:` line to set it as `strict`:

```bash
confinement: strict
```

and let’s build it all:

```bash
$ snapcraft
Skipping pull httpstat (already ran)
Skipping build httpstat (already ran)
Skipping stage httpstat (already ran)
Skipping prime httpstat (already ran)
Snapping 'httpstat' -                                                                        
Snapped httpstat_1.1.3_amd64.snap

```


negative
: Note: plugs are not required or supported outside of strict confinement - a `classic` snap which declares plugs will fail automatic checks if it is submitted to the store.


### Final testing

It’s time to install the final snap, which is now confined, and retest it (remember to use `--dangerous`, as we are installing a local snap, and not one signed from the store):

```bash
$ snap install --dangerous httpstat_1.1.3_amd64.snap
httpstat 1.1.3 installed
$ httpstat https://www.ubuntu.com

HTTP/1.1 200 OK
Date: Mon, 10 Jul 2017 10:51:05 GMT
Server: gunicorn/17.5
Strict-Transport-Security: max-age=15768000
Content-Type: text/html; charset=utf-8
Age: 189
X-Cache: HIT from avocado.canonical.com
X-Cache-Lookup: HIT from avocado.canonical.com:80
Via: 1.1 avocado.canonical.com (squid/3.5.12)
Vary: Accept-Encoding
Transfer-Encoding: chunked

Body stored in: /tmp/tmpvnlglnz3

  DNS Lookup   TCP Connection   SSL Handshake   Server Processing   Content Transfer
[    12ms    |      25ms      |     240ms     |       21ms        |       40ms       ]
             |                |               |                   |                  |
    namelookup:12ms           |               |                   |                  |
                        connect:37ms          |                   |                  |
                                    pretransfer:277ms             |                  |
                                                      starttransfer:298ms            |
                                                                                 total:338ms  


```

And that’s it! The snap, with strict confinement, works!

## That’s all folks!
Duration: 1:00

There we go, that was quite easy wasn’t it?


positive
: Final code
Your final code directory should now look like [this]. Do not hesitate to download and build your snap from it if you only read it through!


You should now have a complete Python snap ready to be uploaded to the store, fully confined with access to the network.

You now know how to snap a simple Python application, the available options and handy features available to make life easier! You also have some idea about how to reference external programs, branching them at specific tags. Finally, looking at the output of our program, we were able to understand the secure interfaces it requires. This allowed us to specify plugs and turn on confinement.

### Next steps

  - Now that you have packaged an application, you can learn how to snap a service, discover a more iterative process on debugging confinement issues and more, on our unique [build a nodejs service] tutorial. Chuck Norris also stars, how can you resist? :)
  - Learn advanced techniques on how to use your snap system by following our other tutorials!
  - Join the snapcraft.io community on the [snapcraft forum].

### Further reading

  - You can check online the [python plugin reference].
  - [Common source] options are used to define where to branch your code from.
  - [Snapcraft.io user interface documentation] will give you some basics about slots, plugs and interfaces.
  - An [interface reference] explains and list existing interface, if they auto-connect or not and more.
  - Some basic notions on [debugging a snap].
  - [Snapcraft syntax reference], covering various available options like the daemon ones.
  - Check how you can [contact us and the broader community].


[httpstat]: https://github.com/reorx/httpstat
[https://www.ubuntu.com]: https://www.ubuntu.com
[basic snap usage]: https://tutorials.ubuntu.com/tutorial/basic-snap-usage
[create your first snap]: https://tutorials.ubuntu.com/tutorial/create-your-first-snap
[here]: https://github.com/ubuntu/snap-tutorials-code/tree/master/snap-python-app/step3
[this]: https://github.com/ubuntu/snap-tutorials-code/tree/master/snap-python-app/final
[snapcraft forum]: https://forum.snapcraft.io/
[python plugin reference]: https://snapcraft.io/docs/reference/plugins/python
[Common source]: https://snapcraft.io/docs/reference/plugins/source
[Snapcraft.io user interface documentation]: http://snapcraft.io/docs/core/interfaces
[interface reference]: http://snapcraft.io/docs/reference/interfaces
[debugging a snap]: http://snapcraft.io/docs/build-snaps/debugging
[Snapcraft syntax reference]: http://snapcraft.io/docs/build-snaps/syntax
[contact us and the broader community]: http://snapcraft.io/community/
[build a nodejs service]: https://tutorials.ubuntu.com/tutorial/build-a-nodejs-service#0
