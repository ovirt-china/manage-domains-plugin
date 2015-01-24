package org.ovirtChina.enginePlugin.engineManageDomains.process;

import java.util.ArrayList;
import java.util.List;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;

import java.io.File;
import java.io.FileOutputStream;
import java.io.Writer;
import java.io.FileWriter;

import java.util.Random;

import javax.ws.rs.core.Response;

import org.ovirtChina.enginePlugin.engineManageDomains.model.Domain;
import org.ovirtChina.enginePlugin.engineManageDomains.model.DomainRequest;
import org.ovirtChina.enginePlugin.engineManageDomains.process.List2Domain;

public class CommandExecuter {

  private String result;
  private String successSentence = "Manage Domains completed successfully";
  private String domainNotFoundPattern = "Domain\\s.*?\\sdoesn't exist in the configuration[.]";
  private String engineRestartRequiered = "oVirt Engine restart is required in order for the changes to take place (service ovirt-engine restart).";
  private String promptPassword = "Enter password:";

	public CommandExecuter() {
	}


  /**
  * Execute and return a Response for the command /list
  */
  public Response list(){

    // Execute the command in the linux shell
    String command = "engine-manage-domains list";
    String output = executeCommand(command);

    /**
    * We admit that if the command is successful the output will contain successSentence
    * and if not it means the command failed.
    */
    if (output.contains(successSentence)){
      List2Domain listParser = new List2Domain(output.replace(successSentence,""));

      List<Domain> domainList = listParser.parse();

      /**
      * Test is the list is empty qnd return a 204 answer if so.
      * Otherwise return the list.
      */
      if (domainList.isEmpty()){
        writeRequestAnswer(204, "");
        return Response.status(204).build();
      }else{
        writeRequestAnswer(200, domainList.toString());
        return Response.status(200).entity(domainList).build();
      }

    }else{
      writeRequestAnswer(500, output);
      return Response.status(500).entity(output).build();

    }
  }

  /**
  * Execute and return a Response for the command /delete
  */
  public Response delete(String domainName){
    //TODO Be sure that the domainName is really a domain name and that it is not going to try to do something else.
    //Remove everything after first espace and look for separator.

    // Execute the command in the linux shell
    String command = "engine-manage-domains delete --domain=" + domainName + " --force";
    String output = executeCommand(command);

    //If the deletion is successful
    if (output.contains(successSentence)){
      writeRequestAnswer(204, "");
      return Response.status(204).build();

    //If the domain name has not been found
    }else if(output.matches(domainNotFoundPattern)){
      writeRequestAnswer(404, output);
      return Response.status(404).entity(output).build();

    //Default answer
    } else {
      writeRequestAnswer(500, output);
      return Response.status(500).entity(output).build();

    }
  }

  /**
  * Execute and return a Response for the command /add
  */
  public Response add(DomainRequest domain){

    domain.validate4Add();

    if (domain.isRequestCorrect()){
      List<String> command = createAddCommand(domain);

      String password = domain.getPassword();
      String output = "";

      if (!password.isEmpty()) {
        output = executeCommandwithPassword(command, domain.getPassword());
      } else {
        output = executeCommand(writeCommand(command));
      }

      String domainName = domain.getDomain();

      //If the addition is successful
      if (output.contains(successSentence)){
        String outputSuccess = "The domain <strong>" + domainName + "</strong> has been added successfully.";

        writeRequestAnswer(201, outputSuccess);
        return Response.status(201).entity(outputSuccess).build();

      } else {
        writeRequestAnswer(500, output);
        return Response.status(500).entity(output).build();

      }
    } else {
      writeRequestAnswer(400, domain.getRequestErrors());
      return Response.status(400).entity(domain.getRequestErrors()).build();
    }
  }

  private List<String> createAddCommand(DomainRequest domain){

    List<String> command = new ArrayList<String>();

    command.add("engine-manage-domains");
    command.add("add");

    command.add("--domain=" + domain.getDomain());
    command.add("--provider=" + domain.getProvider());
    command.add("--user=" + domain.getUser());

    if (domain.getAddPermissions()){
      command.add("--add-permissions");
    }

    String configFile = domain.getConfigFile();
    String ldapServers = domain.getLdapServers();
    String passwordFile = domain.getPasswordFile();
    String password = domain.getPassword();

    if (!configFile.isEmpty()){
      command.add("--config-file=" + configFile);
    }

    if (!ldapServers.isEmpty()){
      command.add("--ldap-servers=" + ldapServers);
    }

    if (domain.getResolveKdc()){
      command.add("--resolve-kdc");
    }

    // If a password is define it is always the default authentication procedure
    if (!passwordFile.isEmpty() && password.isEmpty()){
      command.add("--password-file=" + passwordFile);
    }

    return command;
  }


  /**
  * Execute and return a Response for the command /edit
  */
  public Response edit(DomainRequest domain){

    domain.validate4Edit();

    if (domain.isRequestCorrect()){

      List<String> command = createEditCommand(domain);

      String password = domain.getPassword();
      String output = "";

      if (!password.isEmpty()) {
        output = executeCommandwithPassword(command, domain.getPassword());
      } else {
        output = executeCommand(writeCommand(command));
      }

      String domainName = domain.getDomain();

      //If the addition is successful
      if (output.contains(successSentence)){
        String outputSuccess = "The domain <strong>" + domainName + "</strong> has been edit successfully.";

        writeRequestAnswer(201, outputSuccess);
        return Response.status(201).entity(outputSuccess).build();

      } else {
        writeRequestAnswer(500, output);
        return Response.status(500).entity(output).build();

      }
    } else {
      writeRequestAnswer(400, domain.getRequestErrors());
      return Response.status(400).entity(domain.getRequestErrors()).build();
    }
  }

  /**
  * Create the command to edit a domain
  */
  private List<String> createEditCommand(DomainRequest domain){

    List<String> command = new ArrayList<String>();

    command.add("engine-manage-domains");
    command.add("edit");

    command.add("--domain=" + domain.getDomain());

    String provider = domain.getProvider();
    String user = domain.getUser();

    if (!provider.isEmpty()){
      command.add("--provider=" + provider);
    }

    if (!user.isEmpty()){
      command.add("--user=" + user);
    }

    if (domain.getAddPermissions()){
      command.add("--add-permissions");
    }

    String configFile = domain.getConfigFile();
    String ldapServers = domain.getLdapServers();
    String passwordFile = domain.getPasswordFile();
    String password = domain.getPassword();

    if (!configFile.isEmpty()){
      command.add("--config-file=" + configFile);
    }

    if (!ldapServers.isEmpty()){
      command.add("--ldap-servers=" + ldapServers);
    }

    if (domain.getResolveKdc()){
      command.add("--resolve-kdc");
    }

    // If a password is define it is always the default authentication procedure
    if (!passwordFile.isEmpty() && password.isEmpty()){
      command.add("--password-file=" + passwordFile);
    }

    return command;
  }


  /**
  * Execute command
  */
	private String executeCommand(String command) {

    System.out.println("Executing command: " + command);

		StringBuffer output = new StringBuffer();

		Process p;
		try {
			p = Runtime.getRuntime().exec(command);
			p.waitFor();
			BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
      String line = "";
			while ((line = reader.readLine())!= null) {
				output.append(line + "\n");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

    System.out.println("Output: " + output.toString().trim());
		return output.toString().trim();

	}

  /**
  * This function create a file with the password inside to allow the servlet to use a passwordFile to execute a command.
  */
  private String executeCommandwithPassword(List<String> command, String password) {

    String outputCmd = "Error. Impossible to create the PasswordFile.";

    try{
      // Create a file with a random name
      File passwordFile = new File(generateRandomFileName(10, ".txt"));

      // Write the password in the new passwordFile
      try {
        BufferedWriter output = new BufferedWriter(new FileWriter(passwordFile));
        output.write(password);
        output.close();

        command.add("--password-file=" + passwordFile.getAbsolutePath());

        outputCmd = executeCommand(writeCommand(command));
      } catch (Exception e) {
        e.printStackTrace();
      }

      passwordFile.delete();

    } catch (Exception e) {
      e.printStackTrace();
    }

    return outputCmd;
  }

  private void writeRequestAnswer(int status, String msg){
    System.out.println("Request Answer: (" + status + ") " + msg);
    System.out.println("-x-x- End Request -x-x-");
  }

  /*
  * Transform the List<String> in a single String command
  */
  private String writeCommand (List<String> commands){
    String commandStr = "";

    for (String command : commands) {
      commandStr += command + " ";
    }

    return commandStr.trim();
  }

  /*
  * Generate a random file name
  */
  private String generateRandomFileName (int fileNameSize, String extension){
    String alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    int N = alphabet.length();

    String fileName = "";

    Random r = new Random();

    for (int i = 0; i < (fileNameSize - 1); i++) {
        fileName += alphabet.charAt(r.nextInt(N));
    }

    fileName += extension;

    return fileName;
  }

  public String getResult() {
    return result;
  }

}
