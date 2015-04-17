%define _version 0.5
%define _release 2

Name:		manage-domains-plugin
Version:	%{_version}
Release:	%{_release}%{?dist}
Summary:	Engine Domains Management UIPlugin for ovirt

Group:		oVirt
License:	GPL
URL:		http://www.ovirt-china.org
Source0:	manage-domains-plugin-%{_version}.tar.gz
BuildRoot:	%(mktemp -ud %{_tmppath}/%{name}-%{version}-%{release}-XXXXXX)

BuildRequires:	/bin/bash
Requires:	ovirt-engine >= 3.5.0

%description
This plugin is integrating an Authentication Domains Controller in the WebAdmin of EayunOS. 
This plugin then adds a Tab named "Domain" to the webadmin portal.
You can use it to management the engine domain.

%prep
%setup -q


%build


%install
rm -rf %{buildroot}
mkdir -p %{buildroot}/usr/share/ovirt-engine/ui-plugins/
mkdir -p %{buildroot}/usr/share/engine-manage-domains/deployments/
mkdir -p %{buildroot}/etc/httpd/conf.d/
mkdir -p %{buildroot}/etc/engine-manage-domains
mkdir -p %{buildroot}/etc/rc.d/init.d/
mkdir -p %{buildroot}/var/log/engine-manage-domains
mkdir -p %{buildroot}/usr/sbin/
cp -r UIPlugin/* %{buildroot}/usr/share/ovirt-engine/ui-plugins/
cp Servlet/engine-manage-domains/target/engineManageDomains.war %{buildroot}/usr/share/engine-manage-domains/deployments/
cp ovirt-plugin-emd.conf %{buildroot}/etc/httpd/conf.d/
cp engine-manage-domains %{buildroot}/etc/rc.d/init.d/
cp engine-manage-domains.xml %{buildroot}/etc/engine-manage-domains/
cp engine-manage-domains-setup %{buildroot}/usr/sbin/
touch %{buildroot}/etc/engine-manage-domains/mgmt-users.properties
touch %{buildroot}/etc/engine-manage-domains/application-users.properties

%post
chkconfig --add engine-manage-domains

%clean
rm -rf %{buildroot}


%files
%defattr(-,root,root,-)
%dir /etc/httpd/conf.d/
%dir /etc/rc.d/init.d/
%dir /etc/engine-manage-domains/
%config /etc/httpd/conf.d/ovirt-plugin-emd.conf
%config /etc/engine-manage-domains/engine-manage-domains.xml
%config %attr(0755,root,root) /etc/rc.d/init.d/engine-manage-domains
%attr(0755,root,root) /usr/sbin/engine-manage-domains-setup
/usr/share/ovirt-engine/ui-plugins/
/usr/share/engine-manage-domains/
/var/log/engine-manage-domains/
/etc/engine-manage-domains/


%changelog
* Fri Dec 19 2014 MaZhe <zhe.ma@eayun.com> 0.5-2
- Project rename
  Remove a lot of useless code
  Small Improvements in the UI
  New README
  New Documentation


* Fri Dec  5 2014 PanLiyang <liyang.pan@eayun.com> 0.5-1
- Remove logging file handler

* Fri Dec  5 2014 FengKai <lucas.vandroux@eayun.com> 0.5-0
- Packaging by MaZhe <zhe.ma@eayun.com>
- The plugin is now available in English and in Simplified Chinese.
- The users can enter the password of a domain directly from the UI (no need to use a PasswordFile anymore)
- Bug fixes

* Mon Dec  1 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.5
- Modify setup script

* Mon Dec  1 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.4
- Add setup script

* Tue Nov 25 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.3
- Fix rewrite service run method

* Mon Nov 24 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.2
- Fix service cannot check and terminate existing proccess

* Fri Nov 21 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.1
- Add system service script

* Thu Nov 20 2014 MaZhe <zhe.ma@eayun.com> 0.4-2
- First build
