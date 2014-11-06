package org.ovirtChina.enginePlugin.engineManageDomains.model;

import java.io.File;

public class DomainRequest {

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
  private String user="";
  private String provider="";
  private boolean addPermissions = false;
  private String configFile = "";
  private String ldapServers = "";
  private boolean resolveKdc = false;
  private String passwordFile = "";

  private final String allowedDomainPattern = "^.*$";
  private final String allowedUserPattern = "^.*$";
  private final String allowedProviderPattern = "\\A(ad|ipa|rhds|itds|olap)\\Z";
  private final String allowedPathPattern = "^.*$";
  private final String allowedLdapServersPattern = "^.*$";

  private boolean requestCorrect = true;
  private String requestErrors = "";

  private String newline;

  public DomainRequest(){
    System.out.println("Default Constructor used.");
    newline = System.getProperty("line.separator");
    this.domain = "";
    this.user = "";
    this.provider = "";
    this.addPermissions = false;
    this.configFile = "";
    this.ldapServers = "";
    this.resolveKdc = false;
    this.passwordFile = "";
  }

  public DomainRequest(String domain, String provider, String user, boolean addPermissions, String configFile, String ldapServers, boolean resolveKdc, String passwordFile){

    newline = System.getProperty("line.separator");

    System.out.println("The domain is : " + domain);

    if (testRequieredField("Domain", domain, allowedDomainPattern)){
      this.domain = domain;
    }

    this.provider = provider;
    this.user = user;

    this.addPermissions = addPermissions;
    this.resolveKdc = resolveKdc;

    if (testFile("ConfigFile", configFile)){
      this.configFile = configFile;
    }

    if (testOptionalField("LdapServers", ldapServers, allowedLdapServersPattern)){
      this.ldapServers = ldapServers;
    }

    // Because the normal password is still not allowed, the user must use the password file.
    if (passwordFile != null || !passwordFile.isEmpty()) {
      if (testFile("PasswordFile", passwordFile)){
      // PasswordFile is a requiered field as it not possible to use password yet.
        this.passwordFile = passwordFile;
      }
    } else {
            requestErrors += " - PasswordFile can't be empty." + newline;
      requestCorrect = false;
    }
  }

  public void validate4Add(){

    boolean isProviderCorrect = testRequieredField("Provider", provider, allowedProviderPattern);
    boolean isUserCorrect = testRequieredField("User", user, allowedUserPattern);

    if (!isProviderCorrect){
      this.provider = "";
    }

    if (!isUserCorrect){
      this.user = "";
    }
  }

  public void validate4Edit(){

    boolean isProviderCorrect = testOptionalField("Provider", provider, allowedProviderPattern);
    boolean isUserCorrect = testOptionalField("User", user, allowedUserPattern);

    if (!isProviderCorrect){
      this.provider = "";
    }

    if (!isUserCorrect){
      this.user = "";
    }
  }

  /**
  * Returns the result of the test proceeded on the field.
  */
  private boolean testRequieredField(String fieldName, String field, String pattern){
    // First, test if the field is empty or null
    if (field == null || field.isEmpty()){
      requestErrors += " - " + fieldName + " can't be empty." + newline;
      requestCorrect = false;
      return false;
    } else {
      if (field.matches(pattern)){
        return true;
      } else {
        requestErrors += " - " + field + " is not a valid " + fieldName.toLowerCase() + "." + newline;
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
    if (field == null || field.isEmpty()){
      return true;
    } else {
      if (field.matches(pattern)){
        return true;
      } else {
        requestErrors += " - " + field + " is not a valid " + fieldName.toLowerCase() + "." + newline;
        requestCorrect = false;
        return false;
      }
    }
  }

  private boolean testFile(String fileName, String path){
    if (path == null || path.isEmpty()){
      return true;

    } else {
      File file = new File(path);

      if(file.isFile()){
        return true;

      } else {
        requestErrors += " - " + path + " is not a valid path for the " + fileName.toLowerCase() + "." + newline;
        requestCorrect = false;
        return false;

      }
    }
  }

  /**
  * Return is all the
  */
  public boolean isRequestCorrect(){
    return requestCorrect;
  }

  /**
  * TODO
  */
  public String getRequestErrors(){
    return requestErrors;
  }

  // public void setDomain(String domainName) {
  //   if (testRequieredField("Domain", domain, allowedDomainPattern)){
  //     this.domain = domainName;
  //   }
  // }

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
  public boolean getAddPermissions() {
    return addPermissions;
  }
  public String getConfigFile() {
    return configFile;
  }
  public String getLdapServers() {
    return ldapServers;
  }
  public boolean getResolveKdc() {
    return resolveKdc;
  }
  public String getPasswordFile() {
    return passwordFile;
  }

}
