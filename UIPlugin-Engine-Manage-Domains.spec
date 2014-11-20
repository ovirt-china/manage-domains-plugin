%define _version 0.4
%define _release 2

Name:		UIPlugin-Engine-Manage-Domains
Version:	%{_version}
Release:	%{_release}%{?dist}
Summary:	Engine Domains Management UIPlugin for EayunOS

Group:		EayunOS
License:	GPL
URL:		http://www.eayun.com
Source0:	UIPlugin-Engine-Manage-Domains-%{_version}.%{_release}.tar.gz
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
cp -r UIPlugin/* %{buildroot}/usr/share/ovirt-engine/ui-plugins/
cp ovirt-plugin-emd.conf %{buildroot}/etc/httpd/conf.d/
cp Servlet/engine-manage-domains/target/engineManageDomains.war %{buildroot}/usr/share/ovirt-engine-jboss-as/standalone/deployments/

%clean
rm -rf %{buildroot}


%files
%defattr(-,root,root,-)
%doc
%dir /usr/share/ovirt-engine/ui-plugins/
%dir /etc/httpd/conf.d/
%dir /usr/share/ovirt-engine-jboss-as/standalone/deployments/


%changelog

* Thu Nov 20 2014 MaZhe <zhe.ma@eayun.com> 0.4-2
- First build

