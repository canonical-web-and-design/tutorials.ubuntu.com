---
id: install-ssl-with-letsencrypt
summary: This tutorial covers the installation and configuration of LetsEncrypt to provide an Ubuntu server with SSL certificates.
categories: server
tags: ubuntu-server, ssl, certbot, lets-encrypt, https
difficulty: 3
status: Draft
feedback-url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Aden Padilla <adenpadilla@gmail.com>
published: 2017-11-29

---

#Install SSL with LetsEncrypt

##Overview
Duration: 1:00

Having HTTPS on a site ensures sensitive information sent through a visitor's browser to a server is encrypted. It also let users know that they're on the real site.

Today's we're going to install an SSL certificate from Let's Encrypt to enable HTTPS on your site!

In their own words: Let’s Encrypt is a free, automated, and open certificate authority brought to you by the non-profit Internet Security Research Group (ISRG).

In this tutorial we're going to go through the steps of having an SSL certificate installed.

###What you'll learn
- How to install an SSL certificate on Ubuntu Server

###What you'll need
- Ubuntu Server 16.04
- Apache
- Shell Access (SSH) access to your Server

If you have all those, let's not wait any longer!

##Installing required packages
Duration: 3:00

We start by installing `software-properties-common` since it's not pre-installed on Ubuntu Server
```
sudo apt update
sudo apt install software-properties-common
```
After that we'll add LetsEncrypt's Certbot repository using
```
sudo add-apt-repository ppa:certbot/certbot
sudo apt update
```
Then finally, we install Certbot by running
```
sudo apt install python-certbot-apache
```

And we're done with Certbot installation, let's move on to the next part!

##Configuring CertBot (Part 1)
Duration: 2:00

CertBot automatically obtains and install the SSL certificate for you. All you have to do is run
```
sudo certbot --apache
```
After running the command, you'll be prompted to enter your email (You'll receive important updates such as certificate expiry notification there)
```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator apache, Installer apache
Enter email address (used for urgent renewal and security notices) (Enter 'c' to
cancel): youremail@domain.com
```
Read their ToS and if you agree to it, enter `A` to let them know.
```
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v01.api.letsencrypt.org/directory
-------------------------------------------------------------------------------
(A)gree/(C)ancel: A
```
You'll also be offered to subscribe to Electronic Frontier Foundation's mailing list. If you'd wish to subscribe, agree with `Y`. (This is entirely optional, you may decline the offer by entering `N`)
```
Would you be willing to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let's Encrypt project and the non-profit
organization that develops Certbot? We'd like to send you email about EFF and
our work to encrypt the web, protect its users and defend digital rights.
-------------------------------------------------------------------------------
(Y)es/(N)o: Y
```

After we're done here, we shall proceed to the next and almost last step!
##Configuring Certbot (Part 2)
Duration: 1:00

Finally, you'll be asked which (sub)domain you'd like to install the certificate on (In this case it's `1`)
```
Which names would you like to activate HTTPS for?
-------------------------------------------------------------------------------
1: gci-ubuntu.example.com
-------------------------------------------------------------------------------
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 1
```
We should see these if the obtaining and installation of certificate goes well
```
Obtaining a new certificate
Performing the following challenges:
tls-sni-01 challenge for gci-ubuntu.example.com
Enabled Apache socache_shmcb module
Enabled Apache ssl module
Waiting for verification...
Cleaning up challenges
Created an SSL vhost at /etc/apache2/sites-available/000-default-le-ssl.conf
Enabled Apache socache_shmcb module
Enabled Apache ssl module
Deploying Certificate for gci-ubuntu.example.com to VirtualHost /etc/apache2/sites-available/000-default-le-ssl.conf
Enabling available site: /etc/apache2/sites-available/000-default-le-ssl.conf
```

After that, it'll ask whether or not to redirect all HTTP traffic to HTTPS. (We chose 2 in this case because we wanted it to)
```
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
-------------------------------------------------------------------------------
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
-------------------------------------------------------------------------------
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2

```

##Victory!
Duration: 1:00

If all went well we should get this message
```
Congratulations! You have successfully enabled https://gci-ubuntu.example.com

You should test your configuration at:
https://www.ssllabs.com/ssltest/analyze.html?d=gci-ubuntu.example.com
-------------------------------------------------------------------------------

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/gci-ubuntu.example.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/gci-ubuntu.example.com/privkey.pem
   Your cert will expire on 2018-02-27. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot again
   with the "certonly" option. To non-interactively renew *all* of
   your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

Finally, we type in our address in to see our hard work pay off!
![Success](images/success.png)
