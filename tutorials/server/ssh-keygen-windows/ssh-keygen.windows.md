---
id: tutorial-ssh-keygen-on-windows
summary: Use the Ubuntu command line or PuTTY running on Windows 10 to generate SSH keys for use with SSH authentication and your own remote connections.
categories: server
tags: tutorial,ssh,installation,windows,ubuntu,terminal
difficulty: 2
status: published
published: 2017-10-02
author: Graham Morrison <graham.morrison@canonical.com>
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues

---

# Generate SSH Keys on Windows 10
Duration: 1:00

## Overview

SSH, the secure shell, is often used to access remote Linux systems. But its authentication mechanism, where a *private local key* is paired with a *public remote key*, is used to secure all kinds of online services, from [GitHub][github] and [Launchpad][launchpad] to Linux running on [Microsoft's Azure][azure] cloud.

Generating these keys from Linux is easy, and thanks to [Ubuntu on Windows][ubuntuonwin], you can follow the same process from Windows 10. But even without Ubuntu, SSH keys can also be generated with the free and open source Windows application, [PuTTy][putty]

Over the following few steps, we'll guide you through the process of generating SSH keys using both *Ubuntu on Windows* and *PuTTY*.

### Requirements

All you need is a PC running Windows 10 and either of the following installed:

- [Ubuntu on Windows][ubuntuonwin]
- The `puttygen.exe` executable from [PuTTY][putty]

If you don't already have Ubuntu on Windows, take a look at our [Install Ubuntu on Windows 10][ubuntuonwintut] tutorial.

![screenshot](https://assets.ubuntu.com/v1/5995b99e-windows_github.png)


## Passphrase considerations
Duration: 1:00

When creating the SSH key pair, as shown in the following steps, you can choose to either lock your private key with a passphrase or use no passphrase at all.

Adding a passphrase requires the same passphrase to be entered whenever the key pair is used. Not adding a passphrase removes this requirement. For this reason, creating a key pair without a passphrase is more convenient and potentially essential for certain scripts and automation tasks. But it's also less secure.

If a third party gains access to a private key without a passphrase they will be able to access all connections and services using the public key.

A good compromise between convenience and security is to generate a separate key pair for each service or connection you want to use, adding a passphrase only for critical services. If you suspect a key has been compromised, simply generate a new pair for that service and remove the less secure key.

![screenshot](https://assets.ubuntu.com/v1/53c41ab4-windows_ubuntu_keygen.png)


## Key generation with Ubuntu
Duration: 2:00

Launch **Bash on Ubuntu on Windows** from the start menu and make sure SSH is installed by entering following command at the command prompt:

```bash
sudo apt install ssh
```
The key generation process is identical to the process on a native Linux or Ubuntu installation. With SSH installed, run the SSH key generator by typing the following:

```bash
ssh-keygen -t rsa
```

You will be asked two questions. The first asks where to save the key, and you can press return to accept the default value. The second question asks for the passphrase. As discussed, entering a passphrase will require you to use the same passphrase whenever the key is accessed.

However, the passphrase isn't a requirement, and pressing return (twice) will generate a key pair without one. Consequently, you won't be asked for a passphrase when using your key.

When the process has finished, the private key and the public key can be found in the `~/.ssh` directory accessible from the Ubuntu terminal, or the following folder from Windows file manager:

```bash
C:\Users\<Windows username>\AppData\Local\lxss\home\<Ubuntu username>\.ssh
```

Both the *AppData* and *lxss* directories are hidden from the default view and will need to be entered manually.

![screenshot](https://assets.ubuntu.com/v1/e16ba069-windows_ubuntu_keygen_keys.png)


## Key generation with PuTTY
Duration: 3:00

To generate a key pair with the PuTTY key generator, simply run `puttygen.exe` and click the **Generate** button in the window that appears.

You will be asked to move the mouse and press keys to improve the random number generation at the heart of SSH security. After this, the raw contents of the public key will be displayed alongside its fingerprint and a timestamp comment.

Two important fields, *Key passphrase* and *Confirm passphrase*, allow you to enter a passphrase to protect the private key.

Finally, you will need to export both the private and public keys separately:

- to export the *private key*, select **Export OpenSSH key** from the **Conversions** menu
- to export the *public key*, click **Save public key** from the main window

Public keys typically use the `.pub` suffix. By convention, the private key is usually called `id_rsa` and the public key `id_rsa.pub`, but this isn't a requirement. It's common to have many keys with more descriptive filenames, for instance.

![screenshot](https://assets.ubuntu.com/v1/399589eb-windows_keygen_putty_export.png)


## Getting help
Duration: 1:00

Congratulations! You have just generated a SSH key pair from Windows 10. You can now add the *public* key to those services you wish to authenticate.

If you need some guidance on using SSH keys, take a look at the [Ubuntu community documentation][commdocs], and if you get stuck, help is always at hand:

* [Ask Ubuntu][askubuntu]
* [Ubuntu Forums][forums]
* [IRC-based support][ubuntuirc]

<!-- LINKS -->
[commdocs]: https://help.ubuntu.com/community/SSH/OpenSSH/Keys
[msubuntu]: https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6
[getstartedcli]: https://help.ubuntu.com/community/UsingTheTerminal
[github]: https://help.github.com/categories/authenticating-to-github/
[launchpad]: https://help.launchpad.net/YourAccount/CreatingAnSSHKeyPair
[azure]: https://docs.microsoft.com/en-us/azure/virtual-machines/linux/ssh-from-windows
[ubuntuonwin]: https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6
[ubuntuonwintut]: https://tutorials.ubuntu.com/tutorial/tutorial-ubuntu-on-windows
[putty]: http://www.putty.org/
[askubuntu]: https://askubuntu.com/
[forums]: https://ubuntuforums.org/
[ubuntuirc]: https://wiki.ubuntu.com/IRC/ChannelList
