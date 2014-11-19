package org.ovirtChina.enginePlugin.engineManageDomains.process;

import java.util.ArrayList;
import java.util.List;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import javax.ws.rs.core.Response;

import org.ovirtChina.enginePlugin.engineManageDomains.model.Domain;
import org.ovirtChina.enginePlugin.engineManageDomains.model.DomainRequest;
import org.ovirtChina.enginePlugin.engineManageDomains.process.List2Domain;

public class CommandExecuter {

  private String result;
  private String successSentence = "Manage Domains completed successfully";
  private String domainNotFoundPattern = "Domain\\s.*?\\sdoesn't exist in the configuration[.]";
  private String engineRestartRequiered = "oVirt Engine restart is required in order for the changes to take place (service ovirt-engine restart).";

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
      String command = createAddCommand(domain);
      String output = executeCommand(command);

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

  /**
  * Create the command to add a domain
  */
  private String createAddCommand(DomainRequest domain){
    String command = "engine-manage-domains add --domain=" + domain.getDomain()
                      + " --provider=" + domain.getProvider()
                      + " --user=" + domain.getUser();

    String configFile = domain.getConfigFile();
    String ldapServers = domain.getLdapServers();
    String passwordFile = domain.getPasswordFile();

    if (domain.getAddPermissions()){
      command += " --add-permissions";
    }

    if (!configFile.isEmpty()){
      command += " --config-file=" + configFile;
    }

    if (!ldapServers.isEmpty()){
      command += " --ldap-servers=" + ldapServers;
    }

    if (domain.getResolveKdc()){
      command += " --resolve-kdc";
    }

    if (!passwordFile.isEmpty()){
      command += " --password-file=" + passwordFile;
    }

    return command;

  }


  /**
  * Execute and return a Response for the command /edit
  */
  public Response edit(DomainRequest domain){

    domain.validate4Edit();

    if (domain.isRequestCorrect()){
      String command = createEditCommand(domain);
      String output = executeCommand(command);

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
  private String createEditCommand(DomainRequest domain){
    String command = "engine-manage-domains edit --domain=" + domain.getDomain();

    String provider = domain.getProvider();
    String user = domain.getUser();
    String configFile = domain.getConfigFile();
    String ldapServers = domain.getLdapServers();
    String passwordFile = domain.getPasswordFile();

    if (!provider.isEmpty()){
      command += " --provider=" + provider;
    }

    if (!user.isEmpty()){
      command += " --user=" + user;
    }

    if (domain.getAddPermissions()){
      command += " --add-permissions";
    }

    if (!configFile.isEmpty()){
      command += " --config-file=" + configFile;
    }

    if (!ldapServers.isEmpty()){
      command += " --ldap-servers=" + ldapServers;
    }

    if (domain.getResolveKdc()){
      command += " --resolve-kdc";
    }

    if (!passwordFile.isEmpty()){
      command += " --password-file=" + passwordFile;
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
			BufferedReader reader =
                            new BufferedReader(new InputStreamReader(p.getInputStream()));

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

  private void writeRequestAnswer(int status, String msg){
    System.out.println("Request Answer: (" + status + ") " + msg);
    System.out.println("-x-x- End Request -x-x-");
  }

  public String getResult() {
    return result;
  }

}
