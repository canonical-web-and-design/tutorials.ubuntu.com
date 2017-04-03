<google-codelab
  id="codelabobj"
  title="Example tutorial"
  environment="web"
  feedback-link="https://github.com/ubuntudesign/tutorials.ubuntu.com/issues">
  <app-route
    route="{{route}}"
    tail="{{routeTail}}"></app-route>

  <google-codelab-step label="Introduction" duration="1">
    <p>Welcome to the world of snaps! In this codelab, we are going to cover the very basics on how to use <a href="http://snapcraft.io/" target="_blank">snaps</a> on your Linux distribution, and you&#39;ll directly see the main benefits of them in action.</p>
<p><img style="max-width: 500.00px" src="CODELABURL/img/17e5009256674631.png"></p>
<h2 class="checklist">What you&#39;ll learn</h2>
<ul class="checklist">
<li>How to install the <code>snapd</code> service on your system.</li>
<li>How to search for software.</li>
<li>How to check the list of installed pieces of software.</li>
<li>How snaps are updated.</li>
<li>What snap channels are and how to use them.</li>
<li>How to roll back to the previous version of a snap.</li>
</ul>
<p>If this looks like a long list to you, you will find that you are going to get through it in a breeze. All of the above is very easy to do thanks to the simplicity of the snap command line interface.</p>
<h2>What you&#39;ll need</h2>
<ul>
<li>Any supported GNU/Linux distribution (see next step of the codelab for more details).</li>
<li>Some very basic knowledge of command line use.</li>
</ul>
<p>This codelab is focused on using the <code>snap</code> command. Some command line tools are provided for you to simply copy and paste.</p>
<google-codelab-survey survey-id="basic-snap-usage-1">
<h4>How will you use this tutorial?</h4>
<paper-radio-group>
<paper-radio-button>Only read through it</paper-radio-button>
<paper-radio-button>Read it and complete the exercises</paper-radio-button>
</paper-radio-group>
<h4>What is your current level of experience working with snap?</h4>
<paper-radio-group>
<paper-radio-button>Novice</paper-radio-button>
<paper-radio-button>Intermediate</paper-radio-button>
<paper-radio-button>Proficient</paper-radio-button>
</paper-radio-group>
</google-codelab-survey>


  </google-codelab-step>

  <google-codelab-step label="Getting set up" duration="2">
    <h2>Installing snapd</h2>
<p><code>snapd</code> is the service which runs on your machine and keeps track of your installed snaps, interacts with the store and provides the <code>snap</code> command for you to interact with it. Installing it on any of the Linux distributions mentioned below is straight-forward.</p>
<p><img style="max-width: 500.00px" src="/src/codelabs/example/img/f9f287c2e1980df1.png"></p>
<h2>Different distributions:</h2>
<h3>Arch</h3>
<pre>$ sudo pacman -S snapd

# enable the snapd systemd service:
sudo systemctl enable --now snapd.socket</pre>
<h3>Debian (Sid only)</h3>
<pre>$ sudo apt install snapd</pre>
<h3>Fedora</h3>
<pre>$ sudo dnf copr enable zyga/snapcore
$ sudo dnf install snapd

# enable the snapd systemd service:
$ sudo systemctl enable --now snapd.service

# SELinux support is in beta, so currently:
$ sudo setenforce 0

# to persist, edit /etc/selinux/config to set SELINUX=permissive and reboot.</pre>
<h3>Gentoo</h3>
<p>Install the <a href="https://github.com/zyga/gentoo-snappy" target="_blank">gentoo-snappy overlay</a>.</p>
<h3>OpenEmbedded/Yocto</h3>
<p>Install the <a href="https://github.com/morphis/meta-snappy/blob/master/README.md" target="_blank">snap meta layer</a>.</p>
<h3>openSuSE</h3>
<pre>$ sudo zypper addrepo http://download.opensuse.org/repositories/system:/snappy/openSUSE_Leap_42.2/ snappy
$ sudo zypper install snapd</pre>
<h3>OpenWrt</h3>
<p>Enable the <a href="https://github.com/teknoraver/snap-openwrt/blob/master/README.md" target="_blank">snap-openwrt feed</a>.</p>
<h3>Ubuntu</h3>
<p>You should already be all set on ubuntu 16.04 LTS desktop, just in case run:</p>
<pre>$ sudo apt install snapd</pre>
<p>Now that your system is all ready to go, let&#39;s install your first snap on it.</p>
<aside class="warning"><p>Important: we are currently disabling SELinux for some distributions and as such don&#39;t provide full confinement and security on those platforms yet. We are working heavily on this so that all Linux distributions benefit from these features as soon as possible.</p>
</aside>
<p>Now that your system is all ready to go, let&#39;s install your first snap on it!</p>


  </google-codelab-step>

  <google-codelab-step label="Installing and running your first snap" duration="3">
    <h2>Searching for a snap</h2>
<p><code>snapd</code> is up and running now, so let&#39;s start using it! Here is how you can find any &#34;hello world&#34; kind of snaps in the store:</p>
<pre>$ snap find hello
hello-node-snap       1.0.2        bhdouglass      -          A simple hello world command
hello-mdeslaur        2.10         mdeslaur        -          GNU Hello, the &#34;hello world&#34; snap
hello-snap            0.01         muhammad        -          GNU hello-snap, the &#34;Hello, Snap!&#34; snap
hello                 2.10         canonical       -          GNU Hello, the &#34;hello world&#34; snap
hello-world           6.3          canonical       -          The &#39;hello-world&#39; of snaps
hello-sergiusens      1.0          sergiusens      -          hello world example
hello-gabriell        0.1          gabriell        -          Qt Hello World example
hello-bluet           0.1          bluet           -          Qt Hello World example
so-hello-world        0.2          shadowen        -          the old classic
hello-huge            1.0          noise           -          a really big snap</pre>
<p><code>snap find &lt;search terms&gt;</code> will query the store and list the results with their version number, developer names and description.</p>
<h2>Install and execution</h2>
<p>As you can see, a number of developers uploaded snaps related to &#34;hello world&#34;. Let&#39;s just install one of them.</p>
<pre>$ sudo snap install hello

hello (stable) 2.10 from &#39;canonical&#39; installed</pre>
<aside class="special"><p>Note: when you install the first snap, <code>snapd</code> will download the base OS snap (which includes the very minimal bits required apps in confinement and amounts to some megabytes). Consequently, your first snap download time can take a little bit longer than it will be in the future for any other snap.</p>
</aside>
<p>To run the command, simply type hello in the command line (which is a command provided by the <code>hello</code> snap:</p>
<pre>$ hello
Hello, world!</pre>
<p>This is obviously just a simple example, what it has in common with all other snaps though, is that it runs fully confined and can only access its own data.</p>
<h2>Check which snaps are installed</h2>
<p>See the snaps installed on your system with <code>snap list</code>, which will also tell you the software version, the unique revision, the developer of the installed snap, and any optional extra information.</p>
<pre>$ snap list
Name                     Version        Rev  Developer   Notes
hello                    2.10           20   canonical   -
ubuntu-core              16.04.1        423  canonical   -</pre>
<p>You will note that the <code>ubuntu-core</code> snap, containing the base snap system is also part of the list. Among other things does it include a newer snapd, which will make sure you will always be up to date).</p>
<h2>Keeping your system up to date</h2>
<p>The good news is that snaps are updated automatically in the background every day! If you want, you can still get the latest version of all your snaps manually by running <code>snap refresh</code>. It will bring you completely up to date for all snaps, unless you specify a particular snap to refresh.</p>
<pre>$ sudo snap refresh hello
error: cannot refresh &#34;hello&#34;: snap &#34;hello&#34; has no updates available
$ sudo snap refresh
core updated
hello 64.75 MB [=====================================&gt;___]   12s
</pre>
<p>But these aren&#39;t the only features of the <code>snap</code> command: you can get way more fine-grained in terms of tracking various versions of the same app, depending on how close to current development you want to be. This is all possible thanks to the channel feature! We might delve into this later on.</p>


  </google-codelab-step>
</google-codelab>
