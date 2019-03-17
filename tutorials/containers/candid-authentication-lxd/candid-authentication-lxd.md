---
id: candid-authentication-lxd
summary: Setting up network authentication for your LXD servers with Candid
categories: containers
tags: lxd, lxc, candid
difficulty: 3
status: published
published: 2018-10-05
author: Stéphane Graber <stgraber@ubuntu.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Candid authentication for LXD
## Overview
Duration: 3:00

As you may know, [LXD][lxd] can both be used locally on your machine or
remotely using its secure REST API.

In that mode, the default authentication method is an SSH-like private/public
key exchange combined with an (optional) trust password that's configured on
the remote server to make adding new trusted clients easier.

Adding a trusted client involves either an administrator providing its public
key for LXD to trust it or, more commonly, the administrator having set a trust
password which is then used by the client to add itself to the trust store.


This works well when you have a limited number of clients and don't need to add
or revoke access very often.

But what if you're in a more organized environment where you have a number of
people and services that need access to a number of LXD servers and you need to
be able to easily grant or revoke access, ideally by just managing group
memberships in a central authentication system?


Well, that's what LXD's external authentication support through [Candid][candid] is for.

It allows to setup an authentication gateway (candid) which connects your LXD
servers to your existing authentication system.

### What you'll learn
Duration: 01:00

- Install and setup Candid with basic local authentication
- Overview of additional authentication methods supported by Candid
- Setting up LXD to authenticated against a Candid server

### What you'll need
Duration: 01:00

For this tutorial, all you'll need is an Ubuntu 18.04 LTS system that you can install LXD on.
This can be a virtual machine or cloud instance but can't itself be a container.

The Candid server will be installed in a container on that system.

## Installing LXD
Duration: 10:00

### Installing the LXD snap
For this tutorial, we want the latest stable release of LXD, not the LTS release.

The easiest way to get it is by installing the LXD snap with `sudo snap install lxd`

Expected output should look like:

```bash
2018-10-13T03:25:01Z INFO Waiting for restart...
lxd 3.6 from 'canonical' installed
```

### Cleaning up any remnant of the LXD deb
And then have it migrate and cleanup any data from the pre-installed LXD with `sudo lxd.migrate`

Expected output should look like:

```bash
=> Connecting to source server
=> Connecting to destination server
=> Running sanity checks
The source server is empty, no migration needed.

The migration is now complete and your containers should be back online.
Do you want to uninstall the old LXD (yes/no) [default=yes]? 

All done. You may need to close your current shell and open a new one to have the "lxc" command work.
To migrate your existing client configuration, move ~/.config/lxc to ~/snap/lxd/current/.config/lxc
```

### Basic LXD configuration
Finally, it's time to get a basic configuration going with `lxd init`

Expected output should look like:

```bash
Would you like to use LXD clustering? (yes/no) [default=no]: 
Do you want to configure a new storage pool? (yes/no) [default=yes]: 
Name of the new storage pool [default=default]: 
Name of the storage backend to use (btrfs, ceph, dir, lvm, zfs) [default=zfs]: 
Create a new ZFS pool? (yes/no) [default=yes]: 
Would you like to use an existing block device? (yes/no) [default=no]: 
Size in GB of the new loop device (1GB minimum) [default=43GB]: 
Would you like to connect to a MAAS server? (yes/no) [default=no]: 
Would you like to create a new local network bridge? (yes/no) [default=yes]: 
What should the new bridge be called? [default=lxdbr0]: 
What IPv4 address should be used? (CIDR subnet notation, “auto” or “none”) [default=auto]: 
What IPv6 address should be used? (CIDR subnet notation, “auto” or “none”) [default=auto]: 
Would you like LXD to be available over the network? (yes/no) [default=no]: 
Would you like stale cached images to be updated automatically? (yes/no) [default=yes] 
Would you like a YAML "lxd init" preseed to be printed? (yes/no) [default=no]: 
```

For the purpose of this tutorial, all the defaults should be fine.

## Installing Candid
Duration: 10:00

### Creating the Candid container
We'll be creating an Ubuntu 18.04 container to run the Candid server.
This is done with `lxc launch ubuntu:18.04 candid`

Expected output should look like:

```bash
Creating candid
Starting candid
```

### Installing the Candid snap
At the time of writing, candid is only available in the edge channel.

First get a shell inside the container using `lxc exec candid bash`,
then use `snap install candid --edge` to install the snap from the edge
channel.

Expected output should look like:

```bash
2018-10-13T03:38:24Z INFO Waiting for restart...
candid (edge) v1.0.0-alpha4+git31.adea903 from 'rog' installed
```

And you can confirm that it's running a minimal candid server by running `ps aux | grep candidsrv`

Expected output should look like:

```bash
root       692  0.0  0.1 237124 12480 ?        Ssl  03:38   0:00 candidsrv /var/snap/candid/common/config.yaml
```

### Basic Candid configuration
Now it's time to configure candid to be usable with our LXD server.

As we didn't do any custom DNS setup and don't have a domain we can use for
this, we'll just run Candid in http-only mode and using the container's IPv4
address.

The configuration file is located at `/var/snap/candid/common/config.yaml` and should look like:

```yaml
## Documentation can be found here: https://github.com/CanonicalLtd/candid/blob/master/docs/configuration.md

## Server URLs and ports
listen-address: :8081
private-addr: 127.0.0.1
location: 'http://candid.lxd:8081'

## Persistent storage
# Defaults to non-persistent memory storage, install PostgreSQL or MongoDB
# and configure them below before using this service in production
storage:
  type: memory

#storage:
#  type: mongodb
#  address: 127.0.0.1:27017

#storage:
#  type: postgres
#  connection-string: postgres://user:pass@localhost/candid

## Identity providers
# Configure this with whatever authentication system you're using
identity-providers:
- type: static
  name: static
  users:
    user1:
      name: User One
      email: user1@example.com
      password: password1
      groups:
       - group1
       - group3
    user2:
      name: User Two
      email: user2@example.com
      password: password2
      groups:
       - group2
       - group3

## Logging
logging-config: INFO

## Authentication keys
public-key: oDbQFEs4Kv+KQnaYTowd8XTSpOqRr7UOi6jyUqxVA0k=
private-key: nm0E1c2TCaFUiE661XAmfU50XhIsPxsDFV679mQms9M=

# Don't change, snap-specific paths
access-log: /var/snap/candid/common/logs/candid.access.log
resource-path: /snap/candid/current/www/
```

Let's go ahead and edit it, changing:
 - `location` from `http://candid.lxd:8081` to `http://<ip of container>:8081`
 - Doing any changes you want to the static accounts or configure it to use
   another authentication method

With that done, run `snap restart candid` to reload the configuration.

Make a note of both your `location` URL and the `public-key`, you'll need them
in a minute when configuring LXD.

## Using Candid for LXD authentication
Duration: 05:00

### Configuring the LXD daemon
First lets configure our LXD daemon to use our newly setup Candid server.
This is done by setting `candid.api.url` and `candid.api.key` in the daemon configuration.
The `candid.api.key` option is only needed when your Candid server isn't running at a HTTPs URL.

And we'll also make our LXD daemon listen on the network as that's how clients will connect to it.

```bash
lxc config set candid.api.url http://10.153.38.126:8081
lxc config set candid.api.key oDbQFEs4Kv+KQnaYTowd8XTSpOqRr7UOi6jyUqxVA0k=
lxc config set core.https_address :8443
```

### Configuring the LXD client
On the client side, we'll add a new remote to talk to our local server using Candid.

`lxc remote add localhost https://localhost:8443 --auth-type=candid` will add a
new `localhost` remote for you talking to your local LXD using Candid for
authentication.

Expected output should look like:

```bash
Certificate fingerprint: 44bb4b17a008b163b4ccb86fcf335cae974131787945866188aa859497ce0a94
ok (y/n)? y
Opening an authorization web page in your browser.
If it does not open, please open this URL:
http://10.153.38.126:8081/login?did=d1087212a2032bec61f08e0ad8733ea571bf76102fc5b1ec4bd886d696bc36a4
```

At this point, if you've been following those instructions on a desktop
machine, your web browser should open and show you a login page, if on a
server, hit the URL you've been provided from a separate terminal using a text
browser like `w3m`.


As soon as you're logged in the browser, the client will notice and your remote will be added.
You can list all your remotes with `lxc remote list`

Expected output should look like:

```bash
+-----------------+------------------------------------------+---------------+-----------+--------+--------+
|      NAME       |                   URL                    |   PROTOCOL    | AUTH TYPE | PUBLIC | STATIC |
+-----------------+------------------------------------------+---------------+-----------+--------+--------+
| images          | https://images.linuxcontainers.org       | simplestreams |           | YES    | NO     |
+-----------------+------------------------------------------+---------------+-----------+--------+--------+
| local (default) | unix://                                  | lxd           | tls       | NO     | YES    |
+-----------------+------------------------------------------+---------------+-----------+--------+--------+
| localhost       | https://localhost:8443                   | lxd           | candid    | NO     | NO     |
+-----------------+------------------------------------------+---------------+-----------+--------+--------+
| ubuntu          | https://cloud-images.ubuntu.com/releases | simplestreams |           | YES    | YES    |
+-----------------+------------------------------------------+---------------+-----------+--------+--------+
| ubuntu-daily    | https://cloud-images.ubuntu.com/daily    | simplestreams |           | YES    | YES    |
+-----------------+------------------------------------------+---------------+-----------+--------+--------+
```

You can now switch over to that remote by default and all interactions with LXD
will be authenticated through Candid.

To switch your default remote over to the Candid one, use `lxc remote switch localhost`, then run `lxc list` to test it.

Expected output should look like:

```bash
+--------+---------+----------------------+-----------------------------------------------+------------+-----------+
|  NAME  |  STATE  |         IPV4         |                     IPV6                      |    TYPE    | SNAPSHOTS |
+--------+---------+----------------------+-----------------------------------------------+------------+-----------+
| candid | RUNNING | 10.153.38.126 (eth0) | fd42:ead8:b0cb:8343:216:3eff:fe19:80ba (eth0) | PERSISTENT |           |
+--------+---------+----------------------+-----------------------------------------------+------------+-----------+
```

## Conclusion
Duration: 02:00

This tutorial should have gotten you setup with Candid and LXD in a pretty minimal and artifical environment.

For a production environment, you'd at least want:

 - Setup persistent storage in Candid (PostgreSQL recommended)
 - Setup a proper identity provider for your environment (LDAP, SAML, ...)
 - Enable HTTPs
 - Setup a DNS record for your Candid server
 - Make Candid available to all your clients

With that, you can then add your Candid server to as many LXD servers as you
want and users can add them as remote which will send them to authenticate
using their browser and then give them access.

By default authentication tokens expire after 1 hour and will get auto-renewed by Candid.
This allows for somewhat fast revocation of access without having to deal with constant re-authentication.

## Further reading
Duration: 01:00

Some potentially useful reads

 - The [LXD documentation](https://lxd.readthedocs.io)
 - The [Candid configuration documentation](https://github.com/CanonicalLtd/candid/blob/master/docs/configuration.md)
 - [Original paper on Macaroons](https://ai.google/research/pubs/pub41892), the authentication mechanism used by Candid

### Finding help

 - [LXD forum](https://discuss.linuxcontainers.org)
 - [LXD bug tracker](https://github.com/lxc/lxd/issues)
 - [IRC-based support](https://webchat.freenode.net/?channels=#lxcontainers)

<!-- LINKS -->
[lxd]: https://www.ubuntu.com/containers/lxd
[candid]: https://github.com/CanonicalLtd/candid
