---
id: install-and-configure-apache
summary: This tutorial covers the installation and configuration of Apache web server on Ubuntu Server.
categories: server
tags: ubuntu-server, apache, web server
difficulty: 3
status: published
feedback-url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Aden Padilla <adenpadilla@gmail.com>
published: 2017-11-30

---

#Install and Configure Apache

##Overview
Duration: 1:00

Apache is an open source web server that's available for linux servers free of charge.

In this tutorial we'll be going through the steps of setting up Apache server on your Ubuntu Server.

###What you'll learn
- How to set up Apache
- Some basic Apache configuration

###What you'll need
- A server running Ubuntu Server
- Secure Shell (SSH) access to your server
- Basic Linux command line knowledge

Have everything ready and want to have your website up and running as soon as possible? Click next to start!

##Installing Apache
Duration: 1:00

To install Apache, we want to install the latest meta-package `apache2` by running
```
sudo apt update
sudo apt install apache2
```

After letting the command run, all required packages are installed and we can test it out by typing in our host name that's pointing to the server in a browser.

![Apache-Installed](images/install-success.png)

If you see the page above, it means that Apache has been successfully installed on your server! Let's move on.

##Setting Up Our Webpage (Part 1)
Duration: 4:00

By default, Apache comes with a basic site (the one that we saw in the previous step) enabled. We can modify it's settings by editing its VirtualHost file found in `/etc/apache2/sites-enabled/000-default.conf` or it's content in `/var/www/html`.

positive
: **VirtualHost file**
A VirtualHost file contains configuration of our virtual host which enables Apache to recognize different host names. We can host multiple websites with different host names by adding multiple VirtualHost files and enabling them.

Today, we're going to leave the default Apache page to www.example.com and set up our own at gci.example.com.
So let's start by creating a folder for our new website in `/var/www/` by running
```
mkdir /var/www/gci/
```
We have it named `gci` here but any name will work, as long as we point to it in the configuration file later.

Now that we have a directory created for our site, we want to have an HTML file in it. Let's go into our newly created directory and create one by typing
```
cd /var/www/gci/
nano index.html
```
We're using this for our `index.html` as an example
```HTML
<html>
<head>
  <title> Ubuntu rocks! </title>
</head>
<body>
  <p> I'm running this website on an Ubuntu Server server!
</body>
</html>
```
Pretty cool, right?

Now let's create a VirtualHost file for it so it'll show up when we type in gci.example.com

##Setting up Our Webpage (Part 2)
Duration: 3:00

We start this step by going into the configuration files directory
```
cd /etc/apache2/sites-available/
```
Since Apache came with a default VirtualHost file, let's use that as a base. (`gci.conf` is used here to match our subdomain name)
```
cp 000-defualt.conf gci.conf
```
Now we want to edit the configuration file
```
nano gci.conf
```
We want to have our email in `ServerAdmin` as Apache will display it alongside an error so users can reach you
```
ServerAdmin yourname@example.com
```
We also want the `DocumentRoot` directive to point to the directory our site files are hosted on.
```
DocumentRoot /var/www/gci/
```
The default file doesn't come with a `ServerName` directive so we'll have to add and define it by adding this line below the last directive
```
ServerName gci.example.com
```
This ensures people reach the right site instead of the default one when they type in gci.example.com

Now that we're done configuring our site, let's save and activate it in the next step!

##Activating VirtualHost file
Duration: 1:00

In the same directory, run this
```
sudo a2ensite gci.conf
```
You should see the following output
```
root@ubuntu-server:/etc/apache2/sites-available# sudo a2ensite gci.conf
Enabling site gci.
To activate the new configuration, you need to run:
  service apache2 reload
root@ubuntu-server:/etc/apache2/sites-available#

```
To load the new site, we restart Apache by typing
```
service apache2 reload
```

##End result

Now is the moment of truth, let's type our host name in a browser.
![Final](images/final.png)
Hooray!
