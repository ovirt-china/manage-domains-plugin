Manage Domains Plugin
=====================

**A Simple way to manage your Authentification Domains in oVirt WebAdmin**

![Mockup of the emd-tab](https://raw.githubusercontent.com/eayun/UIPlugin-Engine-Manage-Domains/master/Mockup/mockup-emd-tab.png)

Requirements
------------

-	oVirt-Engine 3.5+

:warning: In 3.5 there is a new implementation of ldap interaction[[1]](http://gerrit.ovirt.org/gitweb?p=ovirt-engine-extension-aaa-ldap.git;a=blob;f=README;hb=HEAD)[[2]](http://www.ovirt.org/Features/AAA). The legacy implementation, including engine-manage-domain will be depreciated and maintained only for regressions.

Installation
------------

#### Deploying the UIPlugin

1.	Copy all what is inside the directory `/UIPlugin` to the directory `/usr/share/ovirt-engine/ui-plugins` on the ovirt-engine server.
2.	Change `https://0.0.0.0` with the address of the ovirt-engine server in the config file `emdplugin.json` here : `"config": {"allowedMessageOriginsJSON":{"allowedMessageOrigins": "https://0.0.0.0"}}`

:bulb: It is recommended to enter the ip address of your machine and its domain name in case it is possible to use both: `"config": {"allowedMessageOriginsJSON":{"allowedMessageOrigins": ["https://<IP_ADDRESS>", "https://<DOMAIN_NAME>"]}}`

#### Deploying the Servlet

1.	Copy the file [ovirt-plugin-emd.conf](https://raw.githubusercontent.com/eayun/UIPlugin-Engine-Manage-Domains/master/ovirt-plugin-emd.conf) in the directory `/etc/httpd/conf.d` on the server and run `$service httpd restart`.
2.	Copy the file `Servlet/engine-manage-domains/target/engineManageDomains.war` to the directory `/usr/share/ovirt-engine-jboss-as/standalone/deployments` on the server.
3.	Go to `/usr/share/ovirt-engine-jboss-as/bin` and run `$./standalone.sh`.

:bulb: For more precisions, the installation process is describe for each release in its notes or on the wiki page [Installation](https://github.com/eayun/UIPlugin-Engine-Manage-Domains/wiki/Installation)

How to use it
-------------

You will find all the material to understand this plugin in its [Github Wiki](https://github.com/eayun/UIPlugin-Engine-Manage-Domains/wiki).

However, here are some useful pages to start with:

-	[Add a New Domain](https://github.com/eayun/UIPlugin-Engine-Manage-Domains/wiki/Add-a-New-Domain)
-	[Edit a Domain](https://github.com/eayun/UIPlugin-Engine-Manage-Domains/wiki/Edit-a-Domain)
-	[Remove a Domain](https://github.com/eayun/UIPlugin-Engine-Manage-Domains/wiki/Remove-a-Domain)

Credit
------

This plugin has been designed and developed with the help of those amazing projects:

-	[AngularJS](https://docs.angularjs.org/) *v1.3.0*
-	[Patternfly](http://getbootstrap.com/) *v1.0.5*
-	[Font Awesome](http://fortawesome.github.io/Font-Awesome/) *v4.2.0*
-	[RESTEasy](http://resteasy.jboss.org/) *2.3.1.GA*

The template of the mockups is coming from the **Flat Browser - PSD** mockup from [Design Crazed](http://designscrazed.org/free-web-browser-mockups-psd/).

Contact
-------

You have multiple options to contact us about this plugin:

-	[Open an issue](https://github.com/eayun/UIPlugin-Engine-Manage-Domains/issues/new) on Github
-	Send us a mail at `eayunos at eayun.com`
-	Reach us on IRC Freenode #ovirt-china

---

<p align="center">
<a href="http://eayun.cn"><img alt="Logo Eayun" src="http://i.imgur.com/k9UTtMH.png"></img></a>
<a href="http://ovirt-china.org/" style="margin-left:30px;"><img alt="Logo oVirt-China" src="http://i.imgur.com/ognbI6J.png"></img></a>
<a href="http://www.ovirt.org"><img alt="Logo oVirt" src="http://i.imgur.com/inWbseQ.png"></img></a>
</p>
