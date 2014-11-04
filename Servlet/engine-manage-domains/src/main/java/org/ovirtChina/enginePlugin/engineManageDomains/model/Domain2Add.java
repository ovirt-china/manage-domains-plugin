package org.ovirtChina.enginePlugin.engineManageDomains.model;

public class Domain2Add {

  /** engine-manage-domains add
  * --domain=DOMAIN
  * --provider=PROVIDER
  * --user=USER
  * [--add-permissions]
  * [--config-file=CFG_FILE]
  * [--ldap-servers=SERVERS]
  * [--resolve-kdc]
  * [--password-file=PASS_FILE]
  */
  private String domain;
  private String provider;
  private String user;
  private Boolean addPermissions = null;
  private String configFile = null;
  private String ldapServers = null;
  private Boolean resolveKdc = null;
  private String passwordFile = null;

  private String allowedProviderPattern = "\\A(ad|ipa|rhds|itds|olap)\\Z";

  public Domain2Add(String domain, String user){
    // TODO verify that the entry are not arming the server.
    this.domain=domain;
    this.user=user;
  }

  public boolean setProvider(String provider) {
    // If the provider is one of the allowed provider set it and return true.
    if (provider.matches(allowedProviderPattern)){
      this.provider = provider;
      return true;

    // Otherwise do nothing and return false.
    }else{
      return false;
    }
  }
  public void setAddPermissions(boolean addPermissions) {
    this.addPermissions = addPermissions;
  }
  public boolean setConfigFile(String configFile) {
    //TODO test if the path is a good path (return false otherwise)
    this.configFile = configFile;
    return true;
  }
  public boolean setLdapServers(String ldapServers) {
    //TODO test if the list is properly formatted (return false otherwise)
    this.ldapServers = ldapServers;
    return true;
  }
  public void setResolveKdc(boolean resolveKdc) {
    this.resolveKdc = resolveKdc;
  }
  public boolean setPasswordFile(String passwordFile) {
    //TODO test if the path is a good path (return false otherwise)
    this.passwordFile = passwordFile;
    return true;
  }


  public String getDomain() {
    return domain;
  }
  public String getProvider() {
    return provider;
  }
  public String getUser() {
    return user;
  }
  public Boolean getAddPermissions() {
    return addPermissions;
  }
  public String configFile() {
    return configFile;
  }
  public String ldapServers() {
    return ldapServers;
  }
  public Boolean resolveKdc() {
    return resolveKdc;
  }
  public String passwordFile() {
    return passwordFile;
  }

  // @Override
  // public String toString() {
  //   return new StringBuffer(" Domain : ").append(this.domain)
  //       .append(" Username : ").append(this.username)
  //       .append(" Status : ").append(this.status).toString();
  // }

}
