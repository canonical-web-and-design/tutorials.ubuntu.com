---
id: beginning-apparmor-profile-development
summary: Learn how to create AppArmor profiles to confine your applications.
categories: security
tags: tutorial, apparmor, guide, security, policy
image: https://assets.ubuntu.com/v1/16e21217-pictogram-safety-orange.svg
difficulty: 3
status: draft
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
published: 2018-03-23
author: Jamie Strandboge <jamie.strandboge@canonical.com>, Emily Ratliff <emily.ratliff@canonical.com>

---

# How to create an AppArmor Profile

## Overview
Duration: 2:00

AppArmor is a Mandatory Access Control (MAC) system which confines programs to a limited set of resources. AppArmor confinement is provided via profiles loaded into the kernel. AppArmor can be set to either enforce the profile or complain when profile rules are violated.

For this tutorial, we will generate an AppArmor profile for certspotter. certspotter is a new utility in Ubuntu as of 17.10 and no profile yet exists. certspotter monitors certificate transparency logs to see if new certificates have been generated for domains listed in a watchlist. Users of certspotter are encouraged to set up a cron job to regularly monitor new entries. I want to use this useful utility, but I haven't had a chance to browse the source code, so I want to limit what it can do on my system.


### What you'll learn

- How to create an AppArmor profile

### What you'll need

- Ubuntu 17.10 or Ubuntu 18.04 LTS

Ready? Let's get started!


## Introduction to AppArmor Profiles
Duration: 5:00

AppArmor profiles are simple text files. Absolute paths as well as file globbing can be used when specifying file access. Most file access rules specify the type of access which is allowed: 'r' (read), 'w' (write), 'm' (memory map as executable), 'k' (file locking), 'l' (creation hard links), and 'ix' to execute another program with the new program inheriting policy. Other file access rules also exist such as 'Px' (execute under another profile, after cleaning the environment), 'Cx' (execute under a child profile, after cleaning the environment), and 'Ux' (execute unconfined, after cleaning the environment).

AppArmor supports access controls for:
* files
* Linux capabilities
* network
* mount, remount and umount
* pivot_root
* ptrace
* signal
* DBus
* unix domain sockets

In addition:
* variables (eg `@{HOME}` can be defined and manipulated outside the profile (`#include <tunables/global>` for `@{PROC}` and `@{HOME}`)
* explicit deny rules are supported to override allow rules (eg access to `@{HOME}/bin/bad.sh` is denied with auditing due to `audit deny @{HOME}/bin/** mrwkl,` even though general access to `@{HOME}` is permitted with `@{HOME}/** rw,`)
* include files are supported to ease development and simplify profiles (ie `#include <abstractions/base>`, `#include <abstractions/nameservice>`, `#include <abstractions/user-tmp>`)

To get started, let's install some useful AppArmor utilities and the application that we want to confine:

```bash
sudo apt install apparmor-easyprof apparmor-notify apparmor-utils certspotter
```


## Generating a basic profile
Duration: 5:00

The easiest way to get started is to create a skeleton profile, set AppArmor to complain mode for your target and then use the `aa-logprof` tool to evaluate the denials.

We'll use `aa-easyprof` to generate the skeleton policy; let's see what it generates (be sure to specify the absolute path to the application):

```bash
$ aa-easyprof /usr/bin/certspotter
```
```
# vim:syntax=apparmor
# AppArmor policy for certspotter
# ###AUTHOR###
# ###COPYRIGHT###
# ###COMMENT###

#include <tunables/global>

# No template variables specified

"/usr/bin/certspotter" {
#include <abstractions/base>

# No abstractions specified

# No policy groups specified

# No read paths specified

# No write paths specified
}
```
Looks pretty basic, so let's write that output into the profile file (the name of the file can be anything; it is the contents of the file which matter):
```bash
$ aa-easyprof /usr/bin/certspotter > usr.bin.certspotter
$ sudo mv usr.bin.certspotter /etc/apparmor.d
```
and then load the profile into the kernel:
```bash
$ sudo apparmor_parser -r /etc/apparmor.d/usr.bin.certspotter
```
Trying to run certspotter, results in an immediate (safe) crash.
```bash
$ certspotter
certspotter: /home/testuser/.certspotter/watchlist: open /home/testuser/.certspotter/watchlist permission denied
```
This basic profile doesn't allow certspotter access to resources it needs, so let's look at the AppArmor denial messages to see what went wrong.

## AppArmor Denials and Complain Mode
Duration: 5:00

AppArmor denials are logged to `/var/log/syslog` (or `/var/log/audit/audit.log` for non-DBus policy violations if auditd is installed). The kernel will rate limit AppArmor denials which can cause problems while profiling. You can avoid this by installing auditd or by adjusting rate limiting in the kernel:
```bash
$ sudo sysctl -w kernel.printk_ratelimit=0
```

Another way to to view AppArmor denials is by using the aa-notify tool. aa-notify is a very simple program that will report any new AppArmor denials by consulting `/var/log/syslog` (or `/var/log/audit/audit.log` if auditd is installed). For example,
```bash
$ /usr/bin/aa-notify -s 1 -v
```
will show any AppArmor denials within the last day.

We are going to take the easy route to develop this profile and use the `aa-logprof` tool to evaluate the log entries that AppArmor makes in complain mode, so let's set the AppArmor profile for certspotter to complain mode for this policy so that we can see what is happening.
```bash
$ sudo aa-complain certspotter
```

Now let's try running certspotter again:
```bash
$ certspotter
```

It immediately starts generating AppArmor entries in the logs that look like this:
```
Feb 23 13:34:24 tutorials audit[18643]: AVC apparmor="ALLOWED" operation="recvmsg" profile="/usr/bin/certspotter" pid=18643 comm="certspotter" laddr=10.0.2.15 lport=46314 faddr=10.0.2.16 fport=443 family="inet" sock_type="stream" protocol=6 requested_mast="receive" denied_mask="receive"
```
because we haven't yet created the profile rules to allow it to access the network.


## Using aa-logprof to Refine the Profile
Duration: 5:00

The `aa-logprof` tool will parse the AppArmor messages and suggest policy rules which would permit certspotter to run under confinement.

```bash
$ sudo aa-logprof
```
```
Reading log entries from /var/log/syslog.
Updating AppArmor profiles in /etc/apparmor.d.
Complain-mode changes:

Profile: /usr/bin/certspotter
Path: /proc/sys/net/core/somaxconn
New Mode: r
Severity: 6

[1 - /proc/sys/net/core/somaxconn r,]
(A)llow / [(D)eny] / (I)gnore / (G)lob / Glob with (E)xtension / (N) ew / Audi(t) / Abo(r)t / (F)inish

A
```
There is no problem with letting certspotter read this file which specifies the maximum number of open socket connections, so we type A to allow it.

```
Profile: /usr/bin/certspotter
Path: /etc/nsswitch.conf
New Mode: r
Severity: unknown

[1 - #include <abstractions/nameservice>]
2 - /etc/nsswitch.conf r,
(A)llow / [(D)eny] / (I)gnore / (G)lob / Glob with (E)xtension / (N) ew / Audi(t) / Abo(r)t / (F)inish

A
```
certspotter uses the network to retrieve information from the certificate transparency logs. We have the choice to either specifically allow this first network related access or to use the existing nameservice abstraction which grants common access patterns. You can review the details of the abstraction in `/etc/apparmor.d/abstractions/nameservice`. This access pattern makes sense for certspotter, so let's allow it.
```
Profile: /usr/bin/certspotter
Path: /proc/sys/kernel/hostname
New Mode: r
Severity: 6

[1 - /proc/sys/kernel/hostname r,]
(A)llow / [(D)eny] / (I)gnore / (G)lob / Glob with (E)xtension / (N) ew / Audi(t) / Abo(r)t / (F)inish

A
```
We don't have a problem with certspotter knowing the system's hostname, so let's Allow it.
```
Profile: /usr/bin/certspotter
Path: /home/testuser/.certspotter/watchlist
New Mode: r
Severity: 4

[1 - /home/*/.certspotter/watchlist r,]
2 - /home/testuser/.certspotter/watchlist r,
(A)llow / [(D)eny] / (I)gnore / (G)lob / Glob with (E)xtension / (N) ew / Audi(t) / Abo(r)t / (F)inish

A
```
certspotter reads the watchlist to determine which domains to monitor. We want certspotter to work for all users of the system and not just ourselves, so suggested rule 1 is better than rule 2. However we also know that certspotter uses the `.certspotter` directory to write information that it discovers, its lock file and other data, so this 'r' rule will be insufficient. Additionally, we would prefer to use the `@{HOME}` tunable rather than the globbed path. For now, let's accept it as a placeholder and take a TODO to touch it up later.
```
Profile: /usr/bin/certspotter
Path: /home/testuser/.certspotter/version
New Mode: r
Severity: 4

[1 - /home/*/.certspotter/version r,]
2 - /home/testuser/.certspotter/version r,
(A)llow / [(D)eny] / (I)gnore / (G)lob / Glob with (E)xtension / (N) ew / Audi(t) / Abo(r)t / (F)inish
I
```
When we touch up the watchlist rule, we should cover all of these entries about files in `$HOME/.certspotter`, so we will Ignore these suggested rules for now.

<rule suggestions for other files in $HOME/.certspotter omitted>
```
Enforce-mode changes:

= Change Local Profiles =
The following local profiles were changed. Would you like to save them?

[1 - /usr/bin/certspotter]
(S)ave Changes / Save Selec(t)ed Profile / [(V)iew Changes] / View Change b/w (C)lean profiles / Abo(r)t
S
```
When you Save the profile, `aa-logprof` automatically causes the profile to be reloaded which immediately silences all of the AppArmor messages about certspotter using the network.


## Hand Editing the Profile
Duration: 2:00

Let's go back and touch up the profile to allow certspotter to read and write from the `$HOME/.certspotter` directory.
```bash
$ sudo vi /etc/apparmor.d/usr.bin.certspotter
```
let's change the `/home/*/.certspotter/watchlist r,` line to `owner @{HOME}/.certspotter/** rw,`. The `**` glob means certspotter can now read and write to all files, directories and all paths under the current user's `.certspotter` directory in their home directory. You can take this opportunity to touch up the `###AUTHOR###`, `###COPYRIGHT###`, and `###COMMENT###` placeholders with your preferred information. Reload the policy once again:
```bash
$ sudo apparmor_parser -r /etc/apparmor.d/usr.bin.certspotter
```

## AppArmor deny rules
Duration: 2:00

We're feeling especially paranoid today, so we are going to add in a few rules to ensure that certspotter can't exfiltrate some of the data from `$HOME`. While AppArmor profiles are default-deny by default, adding explicit deny rules can guard against profile mistakes:
```
deny @{HOME}/Documents/ rw,
deny @{HOME}/Private/ rw,
deny @{HOME}/Pictures/ rw,
deny @{HOME}/Videos/ rw,
deny @{HOME}/fake/ rw,
deny @{HOME}/.config/ rw,
deny @{HOME}/.ssh/ rw,
deny @{HOME}/.bashrc rw,
```
The fake directory doesn't exist on this system, but the policy rule is still valid and AppArmor will enforce rules on it if it ever gets created someday. Remember when specifying a directory itself to use the trailing '/'; this is how AppArmor tells the difference between a file and a directory.

Don't forget to reload the policy!
```bash
$ sudo apparmor_parser -r /etc/apparmor.d/usr.bin.certspotter
```
Ok, let's restart certspotter and see if it works:
```bash
$ /usr/bin/certspotter
```

It seems to be working with no new denials being generated, so let's take AppArmor out of complain mode for this profile and set it to enforcing:
```bash
$ sudo aa-enforce certspotter
```

## Tips for evaluating your AppArmor policy
Duration: 5:00

Some tips when evaluating your AppArmor policy:
* AppArmor provides additional permission checks to traditional Discretionary Access Controls (DAC). DAC is always checked in addition to the AppArmor permission checks. As such, AppArmor cannot override DAC to provide more access than what would be normally allowed.
* AppArmor normalizes path names. It resolves symlinks and considers each hard link as a different access path.
* Deny rules cannot be overridden by an allow rule.
* Creation of files requires the create permission (implied by w) on the path to be created. Separate rules for writing to the directory of where the file resides are not required. Deletion works like creation but requires the delete permission (implied by w). Copy requires 'r' of the source with create and write at the destination (implied by w). Move is like copy, but also requires delete at source.
* The profile must be loaded before an application starts for the confinement to take effect, but policy may be reloaded will the application is running with the rules taking effect immediately. You will want to make sure that you load policy during boot before any confined daemons or applications. This is done for you in Ubuntu.

Aha! The tip about deny rules not being able to be overridden by an allow rule is why we can't just deny all of `@{HOME}` to certspotter and just allow it access to `@{HOME}/.certspotter`.

For a final test, let's add a cron job for certspotter as the project recommends.

```bash
$ crontab -e
33 14 * * * /usr/bin/certspotter
```

Remember to check periodically to see if any new denials have been generated. For bonus points, try running through the certspotter package tests to exercise less common code path.


## That's it!
Duration: 1:00

And that's it! You have generated your first AppArmor profile. You should probably ask someone else to review the final profile to make sure that privilege hasn't been over granted. Hop into #apparmor on OFTC to ask questions. Submit a pull request to add your profile into the extras directory in the [AppArmor project on Gitlab] (https://gitlab.com/apparmor/apparmor/tree/master/profiles/apparmor/profiles/extras) so that other AppArmor users benefit from your work.


### Further reading
For more details about AppArmor profile rules and AppArmor utilities, see the AppArmor man pages
- [man 5 apparmor.d](http://manpages.ubuntu.com/manpages/bionic/en/man5/apparmor.d.5.html)
- [man 8 aa-notify](http://manpages.ubuntu.com/manpages/bionic/en/man8/aa-notify.8.html)
- [man 7 apparmor](http://manpages.ubuntu.com/manpages/bionic/en/man7/apparmor.7.html)

For detailed information, check out the [AppArmor Wiki](https://gitlab.com/apparmor/apparmor/wikis/home) especially the [Policy page](https://gitlab.com/apparmor/apparmor/wikis/AppArmorPolicy)

For more description of AppArmor profile development see [Application isolation with AppArmor](https://penguindroppings.wordpress.com/2013/01/11/application-isolation-with-apparmor-part-i/)

For more information about certspotter, see [CertSpotter](https://sslmate.com/certspotter/)
