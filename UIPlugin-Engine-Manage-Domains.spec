%define _version 0.4
%define _release 2.3

Name:		UIPlugin-Engine-Manage-Domains
Version:	%{_version}
Release:	%{_release}%{?dist}
Summary:	Engine Domains Management UIPlugin for EayunOS

Group:		EayunOS
License:	GPL
URL:		http://www.eayun.com
Source0:	UIPlugin-Engine-Manage-Domains-%{_version}.tar.gz
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
cp -r UIPlugin/* %{buildroot}/usr/share/ovirt-engine/ui-plugins/
cp Servlet/engine-manage-domains/target/engineManageDomains.war %{buildroot}/usr/share/engine-manage-domains/deployments/
cp ovirt-plugin-emd.conf %{buildroot}/etc/httpd/conf.d/
cp engine-manage-domains %{buildroot}/etc/rc.d/init.d/
cp engine-manage-domains.xml %{buildroot}/etc/engine-manage-domains/
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
/usr/share/ovirt-engine/ui-plugins/
/usr/share/engine-manage-domains/
/var/log/engine-manage-domains/
/etc/engine-manage-domains/


%changelog
* Tue Nov 25 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.3
- Fix rewrite service run method

* Mon Nov 24 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.2
- Fix service cannot check and terminate existing proccess

* Fri Nov 21 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.1
- Add system service script

* Thu Nov 20 2014 MaZhe <zhe.ma@eayun.com> 0.4-2
- First build
