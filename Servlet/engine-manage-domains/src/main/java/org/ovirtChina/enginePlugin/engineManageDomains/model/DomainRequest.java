package org.ovirtChina.enginePlugin.engineManageDomains.model;

import java.io.File;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

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

  private final String allowedDomainPattern = "^(http:\\/\\/www\\.|https:\\/\\/www\\.|www\\.|)[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$";
  private final String allowedUserPattern = "^[^;|&]+$";
  private final String allowedProviderPattern = "^(ad|ipa|rhds|itds|olap)$";
  private final String allowedPathPattern = "^(\\/[\\w-]+)+(.[a-zA-Z]+?)$";
  private final String allowedLdapServersPattern = "^(http:\\/\\/www\\.|https:\\/\\/www\\.|www\\.|)[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$";

  private boolean requestCorrect = true;
  private String requestErrors = "";

  private String newline;

  public DomainRequest(){
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
    this.domain = domain;
    this.provider = provider;
    this.user = user;
    this.addPermissions = addPermissions;
    this.resolveKdc = resolveKdc;
    this.configFile = configFile;
    this.passwordFile = passwordFile;
    this.ldapServers = ldapServers;
  }

  private void generalValidation(){

    boolean isDomainCorrect = testRequieredField("Domain", domain, allowedDomainPattern);
    boolean isConfigFileCorrect = testFile("ConfigFile", configFile);
    boolean isPasswordFileCorrect = testFile("PasswordFile", passwordFile);

    ldapServers = sanitizeListServers(ldapServers);

    if (!isDomainCorrect){
      domain = "";
    }

    if (!isConfigFileCorrect){
      configFile = "";
    }

    // Because the normal password is not allowed, the user must use the password file.
    if (passwordFile != null || !passwordFile.isEmpty()) {
      if (!isPasswordFileCorrect){
        passwordFile = "";
      }
    } else {
      requestErrors += " - PasswordFile can't be empty." + newline;
      requestCorrect = false;
    }
  }

  public void validate4Add(){

    generalValidation();

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

    generalValidation();

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

      if (path.matches(allowedPathPattern)){
        System.out.println("path.matches(allowedPathPattern) is " + path.matches(allowedPathPattern));
        File file = new File(path);

        if(file.exists() && file.isFile() && file.canRead()){
          return true;

        } else {
          requestErrors += " - Can't read " + fileName.toLowerCase() + " at " + path + "." + newline;
          requestCorrect = false;
          return false;

        }
      } else {
        requestErrors += " - " + path + " is not a valid path for the " + fileName.toLowerCase() + "." + newline;
        requestCorrect = false;
        return false;
      }
    }
  }

  /**
  * Test each domain in the list and return a String containing each valid domain.
  */
  private String sanitizeListServers(String serversList){
    String serversListSanitize = "";

    // Because it is an optional field, we should check if it is not null or empty first
    if (serversList != null && !serversList.isEmpty()){

      // Parse the String in a list of String
      List<String> servers = Arrays.asList(serversList.split("\\s*,\\s*"));

      // If the list is empty, this means that the list is not well formatted.
      if (servers.isEmpty()){
        requestErrors += " - The LDAP servers list is not well formatted." + newline;
        requestCorrect = false;

      } else {
        // Iterate over each server address to be sure they are correct.
        for (String server : servers) {
          if(server.matches(allowedLdapServersPattern)){
            serversListSanitize += server + ",";
          } else {
            requestErrors += " - " + server + " is not a valid LDAP server address." + newline;
            requestCorrect = false;
          }
        }

        // remove the last coma in the String (test if the string is no empty first)
        if (!serversListSanitize.isEmpty()){
          serversListSanitize = serversListSanitize.substring(0, serversListSanitize.length()-1);
        }
      }
    }

    return serversListSanitize;
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

  /**
  * @ovewrite
  */
  public String toString(){
    String domain2Str = "{\"domain\":\"" + domain + "\", "
                        + "\"provider\":\"" + provider + "\", "
                        + "\"user\":\"" + user + "\", "
                        + "\"addPermissions\":" + addPermissions + ", "
                        + "\"configFile\":\"" + configFile + "\", "
                        + "\"ldapServers\":\"" + ldapServers + "\", "
                        + "\"resolveKdc\":" + resolveKdc + ", "
                        + "\"passwordFile\":\"" + passwordFile + "\"}";
    return domain2Str;
  }

}
