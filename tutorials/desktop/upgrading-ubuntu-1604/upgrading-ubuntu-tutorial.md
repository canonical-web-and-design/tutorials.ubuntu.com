---
id: tutorial-upgrading-ubuntu-desktop
summary: If you’re already running Ubuntu, you can upgrade in a few clicks from the Software Updater.
categories: desktop
tags: tutorial,installation,upgrade,ubuntu,desktop
difficulty: 2
status: published
published: 2018-04-16
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Canonical Web Team <webteam@canonical.com>

---

# Upgrade Ubuntu desktop

## Before you start
Duration: 1:00

positive
: We recommend that you backup your existing Ubuntu installation before you update your computer.

Being able to upgrade Ubuntu from one version to the next is one of Ubuntu's best features. You benefit from getting the latest software, including new security patches, and all the upgraded technology that comes with a new release without having to resort to reinstalling and reconfiguring your system. 

Best of all, upgrading Ubuntu to the latest release is easy. As we'll demonstrate!

If you are upgrading from a version released prior to Ubuntu 15.10, [please read the upgrade notes for more information](https://help.ubuntu.com/community/UpgradeNotes).

For more recent versions, please read the release notes for [Ubuntu 18.04](https://wiki.ubuntu.com/BionicBeaver/ReleaseNotes).

## Launch the Software Updater
Duration: 1:00

On versions of Ubuntu prior to 17.10, press the **Superkey (Windows key)** to launch the Dash and search for **Update Manager**.

![Software Updater from Dash](https://assets.ubuntu.com/v1/de3da8d8-download-desktop-upgrade-1.jpg)

For Ubuntu 17.10, click on the **Show Applications** icon in the bottom left of the desktop and search for **Update Manager**.

![Software Updater from Gnome](https://assets.ubuntu.com/v1/c1acb197-1710-update-manager.png)

As the application launches it will first check if there are any updates for your current version of Ubuntu that need to be installed. If it does find any, install these first and run *Update Manager* again if you need to restart your machine.

## Check for updates
Duration: 3:00

*Update Manager* will open a window to inform you that your computer is up to date. Click on the **Settings** button to open the main user-interface.

![Software Updater settings](https://assets.ubuntu.com/v1/01a74737-ubuntu-upgrade-updates.png)

Select the tab called **Updates**, if not already selected. Then set the **Notify me of a new Ubuntu version** dropdown menu to either **For any new version** or **For long-term support versions**, if you're wanting to update to the latest LTS release. You may be asked for your password to make this change. See the [Ubuntu wiki](https://wiki.ubuntu.com/LTS) for details on the differences between standard and LTS releases.

Click on **Close** to be taken back to the update pane and **OK** to close this.

We now need to open *Update Manager* one more time, only this time *Update Manager* will open up and tell you that a new distribution is available. Click **Upgrade**.

![Software Updater new version discovered](https://assets.ubuntu.com/v1/dc25872f-ubuntu-upgrade-xenial.png)

### If no upgrade appears

As mentioned in the [Ubuntu wiki](https://wiki.ubuntu.com/BionicBeaver/ReleaseNotes#Upgrading_from_Ubuntu_16.04_LTS_or_17.10), upgrades from 17.10 will not be enabled until a few days after the release of 18.04 and upgrades from 16.04 LTS will not be enabled until a few days after the release of 18.04.1, expected in late July 2018.

You can force the upgrade, however, with the following steps:

- close *Update Manager* if it's still running
- open a terminal in the same way you opened *Update Manager*
- type `update-manager -d` and press enter

![Update manager forced update](https://assets.ubuntu.com/v1/e5578786-bionic-terminal-update.png) 

positive
: Our images show an upgrade from Ubuntu 16.04 LTS to Ubuntu 18.04 LTS, but the process is the same when upgrading other versions of Ubuntu.

## Install the upgrade
Duration: 15:00

After asking for your password, you will be presented with the *Release Notes* for the release you're about to upgrade to.

![Release notes for Bionic Beaver](https://assets.ubuntu.com/v1/7471791f-ubuntu-upgrade-beaver.png)

Select the **Upgrade** button to start the initialisation process. A few moments later you'll be asked *Do you want to start the upgrade?* Press **Start Upgrade** to pass the point of no return and start the upgrade process.

The upgrade will now proceed. The *Distribution Upgrade* pane will track the upgrade process and allow you to monitor progress. As the process is dependent on both your network connection and the performance of your computer, the upgrade could take anything from ten or 20 minutes to an hour or more.

![Upgrade progress](https://assets.ubuntu.com/v1/9b7ca0ad-ubuntu-upgrade-process.png)

After the new packages are installed, you may be asked whether you want to remove any *obsolete packages*. These are packages that were installed on your previous version of Ubuntu but are no longer required by the new one. You can safely select **Remove**. 

![Upgrade complete](https://assets.ubuntu.com/v1/3b5f8552-ubuntu-upgrade-complete.png)

Finally, you'll be asked to restart the system to complete the upgrade.

Congratulations! You have successfully upgraded Ubuntu!

## Finding help
Duration: 1:00

If you get stuck, help is always at hand.

* [Ask Ubuntu](https://askubuntu.com/)
* [Ubuntu Forums](https://ubuntuforums.org/)
* [IRC-based support](https://wiki.ubuntu.com/IRC/ChannelList)

