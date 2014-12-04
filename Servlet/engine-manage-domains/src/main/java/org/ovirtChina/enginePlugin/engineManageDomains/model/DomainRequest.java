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

  private String password="";

  private final String allowedDomainPattern = "^(http:\\/\\/www\\.|https:\\/\\/www\\.|www\\.|)[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$";
  private final String allowedUserPattern = "^[^;|&]+$";
  private final String allowedProviderPattern = "^(ad|ipa|rhds|itds|olap)$";
  private final String allowedPathPattern = "^(\\/[\\w-]+)+(.[a-zA-Z]+?)$";
  private final String allowedLdapServersPattern = "^(http:\\/\\/www\\.|https:\\/\\/www\\.|www\\.|)[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$";

  private boolean requestCorrect = true;
  private List<String> requestErrors;

  private String newline;

  public DomainRequest(){

    newline = System.getProperty("line.separator");
    requestErrors = new ArrayList<String>();

    this.domain = "";
    this.user = "";
    this.provider = "";
    this.addPermissions = false;
    this.configFile = "";
    this.ldapServers = "";
    this.resolveKdc = false;
    this.passwordFile = "";

    this.password = "";
  }

  public DomainRequest(String domain, String provider, String user, boolean addPermissions, String configFile, String ldapServers, boolean resolveKdc, String passwordFile, String password){

    newline = System.getProperty("line.separator");
    requestErrors = new ArrayList<String>();

    this.domain = domain;
    this.provider = provider;
    this.user = user;
    this.addPermissions = addPermissions;
    this.resolveKdc = resolveKdc;
    this.configFile = configFile;
    this.passwordFile = passwordFile;
    this.ldapServers = ldapServers;

    this.password = password;
  }

  /**
  * Validate the field common to the add and edit request
  */
  private void generalValidation(){

    // Test and sanitize
    ldapServers = sanitizeListServers(ldapServers);

    // Test the domain
    boolean isDomainCorrect = testRequieredField("Domain", domain, allowedDomainPattern);
    if (!isDomainCorrect){
      domain = "";
    }

    // Test the config File
    boolean isConfigFileCorrect = testFile("ConfigFile", configFile);
    if (!isConfigFileCorrect){
      configFile = "";
    }

    // Test password and passwordFile if there is no password
    if (password == null || password.isEmpty()){
      password = "";

      if (passwordFile != null || !passwordFile.isEmpty()){
        // Test if the given passwordFile is correct
        boolean isPasswordFileCorrect = testFile("PasswordFile", passwordFile);

        if (!isPasswordFileCorrect){
          passwordFile = "";
        }
      } else {
        passwordFile = "";
        addError("Password can't be empty.");
      }
    } else {
      passwordFile = "";
    }
  }

  /**
  * Validate the field to perform an add request
  */
  public void validate4Add(){

    // Validate the common fields between the add and edit request function
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

  /**
  * Validate the field to perform an edit request
  */
  public void validate4Edit(){

    // Validate the common fields between the add and edit request function
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

      String error2add = fieldName + " can't be empty.";
      addError(error2add);

      return false;

    } else {

      // Test if the field matches the pattern
      if (field.matches(pattern)){

        return true;

      } else {

        String error2add = field + " is not a valid " + fieldName.toLowerCase() + ".";
        addError(error2add);

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

      // Test if the field matches the pattern
      if (field.matches(pattern)){

        return true;

      } else {

        String error2add = field + " is not a valid " + fieldName.toLowerCase() + ".";
        addError(error2add);

        return false;
      }
    }
  }

  /**
  * Test if the file is usable by the CLI
  *
  * @param  String filename   Name of the file to include it in the error report.
  * @param  String path       Path of the file to test
  * @return boolean           Success of the tests
  */
  private boolean testFile(String fileName, String path){

    // Return false if the path is empty but it is not an error because all the file fields are optional.
    if (path.isEmpty() || path != null){
      return false;
    }

    if (path.matches(allowedPathPattern)){

      File file = new File(path);

      if(file.exists() && file.isFile() && file.canRead()){
        return true;

      } else {

        String error2add = "Can't read " + fileName.toLowerCase() + " at " + path + ".";
        addError(error2add);

        return false;

      }

    } else {

      String error2add = path + " is not a valid path for the " + fileName.toLowerCase() + ".";
      addError(error2add);

      return false;
    }

  }

  /**
  * Test each domain in the list and return a String containing each valid domain.
  *
  * @param  String serverList   List of the servers separate by comas
  * @return String              List of servers ready to be used in the CLI
  */
  private String sanitizeListServers(String serversList){
    String serversListSanitize = "";

    // Because it is an optional field, we should check if it is not null or empty first
    if (serversList != null && !serversList.isEmpty()){

      // Parse the String in a list of String
      List<String> servers = Arrays.asList(serversList.split("\\s*,\\s*"));

      // If the list is empty, this means that the list is not well formatted.
      if (servers.isEmpty()){

        addError("The LDAP servers list is not well formatted.");

      } else {
        // Iterate over each server address to be sure they are correct.
        for (String server : servers) {

          if(server.matches(allowedLdapServersPattern)){

            serversListSanitize += server + ",";

          } else {

            String error2add = server + " is not a valid LDAP server address.";
            addError(error2add);
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
  * Add Error in the errors list
  */
  private void addError(String errorDescr){
    requestErrors.add(errorDescr);
    requestCorrect = false;
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
    String requestErrorOutput = "<ul>";

    for (String error : requestErrors) {

      requestErrorOutput += "<li>" + error + "</li>";
    }

    requestErrorOutput += "</ul>";

    return requestErrorOutput;
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
  public String getPassword() {
    return password;
  }

  /**
  * @ovewrite
  */
  public String toString(){
    String domain2Str = "{\"domain\":\"" + domain + "\", "
                        + "\"provider\":\"" + provider + "\", "
                        + "\"user\":\"" + user + "\", "
                        + "\"password\":\"" + password + "\", "
                        + "\"addPermissions\":" + addPermissions + ", "
                        + "\"configFile\":\"" + configFile + "\", "
                        + "\"ldapServers\":\"" + ldapServers + "\", "
                        + "\"resolveKdc\":" + resolveKdc + ", "
                        + "\"passwordFile\":\"" + passwordFile + "\"}";
    return domain2Str;
  }

}
