package org.ovirtChina.enginePlugin.engineManageDomains.model;

public class Domain2Add {

  /*
  * engine-manage-domains add
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
  private String user;
  private String provider;
  private boolean addPermissions = false;
  private String configFile = "";
  private String ldapServers = "";
  private boolean resolveKdc = false;
  private String passwordFile = "";

  private final String allowedDomainPattern = "";
  private final String allowedUserPattern = "";
  private final String allowedProviderPattern = "\\A(ad|ipa|rhds|itds|olap)\\Z";
  private final String allowedPathPattern = "";
  private final String allowedLdapServersPattern = "";

  private boolean requestCorrect = true;
  private String requestErrors = "";

  private String newline;

  public Domain2Add(String domain, String provider, String user, boolean addPermissions, String configFile, String ldapServers, boolean resolveKdc, String passwordFile){

    newline = System.getProperty("line.separator");

    if (testRequieredField("Domain", domain, allowedDomainPattern)){
      this.domain = domain;
    }

    if (testRequieredField("Provider", provider, allowedProviderPattern)){
      this.provider = provider;
    }

    if (testRequieredField("User", user, allowedUserPattern)){
      this.user = user;
    }

    this.addPermissions = addPermissions;
    this.resolveKdc = resolveKdc;

    if (testOptionalField("ConfigFile", configFile, allowedPathPattern)){
      this.configFile = configFile;
    }

    if (testOptionalField("LdapServers", ldapServers, allowedLdapServersPattern)){
      this.ldapServers = ldapServers;
    }

    if (testRequieredField("PasswordFile", passwordFile, allowedPathPattern)){
    // PasswordFile is a requiered field as it not possible to use password yet.
    //if (testOptionalField("PasswordFile", passwordFile, allowedPathPattern)){
      this.passwordFile = passwordFile;
    }

  }

  /**
  * Returns the result of the test proceeded on the field.
  */
  private boolean testRequieredField(String fieldName, String field, String pattern){
    // First, test if the field is empty or null
    if (provider = null || provider.isEmpty()){
      requestErrors += " - " + fieldName + " can't be empty." + newline;
      requestCorrect = false;
      return false;
    } else {
      if (field.matches(pattern)){
        return true;
      } else {
        requestErrors += " - " + field + " is not a valid " + fieldName.lowerCase() + "." + newline;
        requestCorrect = false;
        return false;
      }
    }
  }

  /**
  * Returns the result of the test proceeded on the field.
  */
  private boolean testOptionalField(String fieldName, String field, String pattern){
    // First, test if the field is empty or null
    // because it is optional nothing doesn't mean false
    if (provider = null || provider.isEmpty()){
      return true;
    } else {
      if (field.matches(pattern)){
        return true;
      } else {
        requestErrors += " - " + field + " is not a valid " + fieldName.lowerCase() + "." + newline;
        requestCorrect = false;
        return false;
      }
    }
  }

  /**
  * Return is all the
  */
  public boolean isRequestCorrect (){
    return requestCorrect;
  }

  /**
  * TODO
  */
  public String getRequestErrors (){
    return requestErrors;
  }

  /*
  * Basics getters for the variable of the domain to add
  */
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

}
