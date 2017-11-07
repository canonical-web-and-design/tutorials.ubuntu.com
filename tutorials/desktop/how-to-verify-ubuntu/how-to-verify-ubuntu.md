---
id: tutorial-how-to-verify-ubuntu
summary: Verifying your ISO helps insure the data integrity and authenticity of your download.
categories: desktop
tags: tutorial,installation,verify,ubuntu
difficulty: 3
status: Published
published: 2017-05-31

---

# How to verify your Ubuntu download

## Getting started
Duration: 0:02

positive
: Note - You will need to use a terminal app to verify an Ubuntu ISO image. These instructions assume basic knowledge of the command line, checking of SHA256 checksums and use of GnuPG.

Verifying your ISO helps insure the data integrity and authenticity of your download. The process is fairly straightforward, but it involves a number of steps. They are:

1. Download SHA256SUMS and SHA256SUMS.gpg files
2. Get the key used for the signature from the Ubuntu key server
3. Verify the signature
4. Check your Ubuntu ISO with sha256sum against the downloaded sums

After verifying the ISO file, you can then either install Ubuntu or run it live from your CD/DVD or USB drive.

## Download sums
Duration: 0:02

Download the SHA256SUMS and SHA256SUMS.gpg files from any of the mirrors and put them in the same directory.

[Download sums and signature for Ubuntu 16.04.2 LTS&nbsp;&rsaquo;](http://releases.ubuntu.com/16.04)

![screenshot](https://assets.ubuntu.com/v1/f1cce1af-verify-1-releases.png)

## Verify release screenshot
Duration: 0:04

Get the signature key

positive
: Tip - On non-Linux systems, you might need to download the GPG tools for this next step. To check if you have the GPG tools installed, run the command `gpg --version or gpg2 --version`.

Get the public keys from the Ubuntu key server and add them to your keyring.

```bash
gpg --keyserver hkp://keyserver.ubuntu.com --recv-keys "8439 38DF 228D 22F7 B374 2BC0 D94A A3F0 EFE2 1092" "C598 6B4F 1257 FFA8 6632 CBA7 4618 1433 FBB7 5451"
```
```bash
gpg: directory `/home/ubuntu/.gnupg' created
gpg: new configuration file `/home/ubuntu/.gnupg/gpg.conf' created
gpg: WARNING: options in `/home/ubuntu/.gnupg/gpg.conf' are not yet active during this run
gpg: keyring `/home/ubuntu/.gnupg/secring.gpg' created
gpg: keyring `/home/ubuntu/.gnupg/pubring.gpg' created
gpg: requesting key EFE21092 from hkp server keyserver.ubuntu.com
gpg: requesting key FBB75451 from hkp server keyserver.ubuntu.com
gpg: /home/ubuntu/.gnupg/trustdb.gpg: trustdb created
gpg: key EFE21092: public key "Ubuntu CD Image Automatic Signing Key (2012) <cdimage@ubuntu.com>" imported
gpg: key FBB75451: public key "Ubuntu CD Image Automatic Signing Key <cdimage@ubuntu.com>" imported
gpg: no ultimately trusted keys found
gpg: Total number processed: 2
gpg:               imported: 2  (RSA: 1)
```

Verify the key fingerprints.

```bash
gpg --list-keys --with-fingerprint 0xFBB75451 0xEFE21092
```
```bash
pub 1024D/FBB75451 2004-12-30
Key fingerprint = C598 6B4F 1257 FFA8 6632 CBA7 4618 1433 FBB7 5451
uid Ubuntu CD Image Automatic Signing Key cdimage@ubuntu.com

pub 4096R/EFE21092 2012-05-11
Key fingerprint = 8439 38DF 228D 22F7 B374 2BC0 D94A A3F0 EFE2 1092
uid Ubuntu CD Image Automatic Signing Key (2012) cdimage@ubuntu.com
```

## Verify signature
Duration: 0:02

Now you can verify the signature.

```bash
gpg --verify SHA256SUMS.gpg SHA256SUMS
```
```bash
gpg: Signature made Fri 25 Mar 04:36:20 2016 GMT using DSA key ID FBB75451
gpg: Good signature from "Ubuntu CD Image Automatic Signing Key <cdimage@ubuntu.com>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: C598 6B4F 1257 FFA8 6632  CBA7 4618 1433 FBB7 5451
gpg: Signature made Fri 25 Mar 04:36:20 2016 GMT using RSA key ID EFE21092
gpg: Good signature from "Ubuntu CD Image Automatic Signing Key (2012) <cdimage@ubuntu.com>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 8439 38DF 228D 22F7 B374  2BC0 D94A A3F0 EFE2 1092
```

positive
: This is an example of a ‘good’ signature. GPG is only validating the integrity of the given file. The warning messages indicate that your current GnuPG trust database does not have trust information for the signing key and that, unless you have actually verified and signed one of the public keys belonging to signers of the Ubuntu ISO image signing key, you will get these warnings.

## Check the ISO
Duration: 0:02

Now you need to generate a sha256 checksum for the downloaded ISO and compare it to the one you downloaded in your SHA256SUM file.

Make sure the downloaded the SHA256SUMS and SHA256SUMS.gpg files are in the same directory as the Ubuntu iso. Then run the following commands in a terminal.

On Ubuntu, the command to check will look like:

```bash
sha256sum -c SHA256SUMS 2>&1 | grep OK
```

On macOS, the command and good output will look like the following.

```bash
shasum -a 256 -c SHA256SUMS 2>&1 | grep OK
```

If you’re using Windows, you may need to download a [SHA-256 tool](http://www.labtestproject.com/files/win/sha256sum/sha256sum.exe) first. Once you have, your command will look like:

```bash
sha256sum.exe -c SHA256SUMS
```

The output you want will look similar to the following:

```bash
ubuntu-16.04.2-desktop-amd64.iso: OK
```

If you get no results (or any result other than that shown above) you will need to check your download again.

## Finding help

If you get stuck, help is always at hand.

* [Ask Ubuntu](https://askubuntu.com/)
* [Ubuntu Forums](https://ubuntuforums.org/)
* [IRC-based support](https://wiki.ubuntu.com/IRC/ChannelList)
