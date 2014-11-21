%define _version 0.4
%define _release 2.1

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
mkdir -p %{buildroot}/etc/httpd/conf.d/
mkdir -p %{buildroot}/usr/share/ovirt-engine-jboss-as/standalone/deployments/
mkdir -p %{buildroot}/etc/rc.d/init.d/
mkdir -p %{buildroot}/usr/share/ovirt-engine-jboss-as/standalone/configuration
cp -r UIPlugin/* %{buildroot}/usr/share/ovirt-engine/ui-plugins/
cp ovirt-plugin-emd.conf %{buildroot}/etc/httpd/conf.d/
cp Servlet/engine-manage-domains/target/engineManageDomains.war %{buildroot}/usr/share/ovirt-engine-jboss-as/standalone/deployments/
cp oeja-standalone %{buildroot}/etc/rc.d/init.d/
cp engine-manage-domains.xml %{buildroot}/usr/share/ovirt-engine-jboss-as/standalone/configuration

%post
sed -i '3i echo $$ > /var/run/oeja-standalone.pid' standalone.sh
chkconfig --add oeja-standalone

%clean
rm -rf %{buildroot}


%files
%defattr(-,root,root,-)
%dir /etc/httpd/conf.d/
%dir /etc/rc.d/init.d/
%config /etc/httpd/conf.d/ovirt-plugin-emd.conf
%config(0755,root,root) /etc/rc.d/init.d/oeja-standalone
%config /usr/share/ovirt-engine-jboss-as/standalone/configuration/engine-manage-domains.xml
/usr/share/ovirt-engine/ui-plugins/
/usr/share/ovirt-engine-jboss-as/standalone/deployments/


%changelog

* Thu Nov 20 2014 MaZhe <zhe.ma@eayun.com> 0.4-2
- First build

* Fri Nov 21 2014 MaZhe <zhe.ma@eayun.com> 0.4-2.1
- Add system service script
