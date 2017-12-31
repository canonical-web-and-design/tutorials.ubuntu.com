---
id: enable-the-livepatch-service
summary: Learn how to enable the Canonical Livepatch service.
categories: server
tags: server, livepatch, security, kernel, update
difficulty: 1
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2018-01-01
author: Konrad Krawiec <konrad11901@gmail.com>

---

# Enabling the Canonical Livepatch service

## Overview
Duration: 1:00

[Canonical Livepatch service](https://www.ubuntu.com/server/livepatch) applies critical kernel security patches without rebooting Ubuntu.

This tutorial will show you how to enable this service on your Ubuntu system.

### What you'll need

- A computer running Ubuntu 16.04 LTS or 14.04 LTS with Internet connection
* An Ubuntu One account
- Some basic command-line knowledge

## Getting the Livepatch token
Duration: 1:00

In order to use this service, you have to generate the Livepatch token.

To get it, simply visit the [Livepatch portal](https://auth.livepatch.canonical.com/). Then, select the "Ubuntu user" option and click "Get your Livepatch token". You'll have to log in with your Ubuntu One account if you haven't done it already.

You'll see a key associated with your account. Don't close the page or copy the token somewhere - you'll need it later.

## Installing the Livepatch daemon
Duration: 3:00

### Enabling the snap support

The Livepatch daemon is distributed through Snap Store. If you are using Ubuntu 14.04 LTS, you have to enable the snap support first:

```bash
$ sudo apt update
$ sudo apt install snapd
```

Then, start a new shell so you `PATH` variable is updated to include the `snapd` package.

Ubuntu 16.04 LTS supports snaps by default - you don't have to do anything more.

### Instaling the daemon

To install the Livepatch daemon, simply type:

```bash
$ sudo snap install canonical-livepatch
```

## Enabling the Livepatch
Duration: 1:00

Almost there! You now have to enable the service:

```bash
$ sudo canonical-livepatch enable [TOKEN]
```

Use the token you got from the Livepatch portal.

## That's all!
Duration: 1:00

Congratulation, you now have zero downtime kernel patching on your system!

### Next steps

If you have a problem, we're ready to help! Check the following links:

* [Ubuntu forums](https://community.ubuntu.com)
* [Ask Ubuntu](https://askubuntu.com/)

### Further reading

* [This datasheet](https://assets.ubuntu.com/v1/ac3aa269-DS_Canonical_Livepatch_Service_screen-AW_08.17.pdf) contains more technical details and FAQs on the Canonical Livepatch service.
