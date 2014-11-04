package org.ovirtChina.enginePlugin.engineManageDomains.process;

import java.util.ArrayList;
import java.util.List;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import javax.ws.rs.core.Response;

import org.ovirtChina.enginePlugin.engineManageDomains.model.Domain;
import org.ovirtChina.enginePlugin.engineManageDomains.model.Domain2Add;
import org.ovirtChina.enginePlugin.engineManageDomains.process.List2Domain;

public class CommandExecuter {

  private String result;
  private String successSentence = "Manage Domains completed successfully\n";
  private String domainNotFoundPattern = "Domain\\s.*?\\sdoesn't exist in the configuration[.]\\n";

	public CommandExecuter() {
    //---DEBUG---
		System.out.println("Command Executer created.");
    //---!DEBUG---
	}

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
        return Response.status(204).build();
      }else{
        return Response.status(200).entity(domainList).build();
      }

    }else{
      return Response.status(500).entity(output).build();

    }
  }

  public Response delete(String domainName){
    //TODO Be sure that the domainName is really a domain name and that it is not going to try to do something else.
    //Remove everything after first espace and look for separator.

    // Execute the command in the linux shell
    String command = "engine-manage-domains delete --domain=" + domainName + " --force";
    String output = executeCommand(command);

    //If the deletion is successful
    if (output.contains(successSentence)){
      return Response.status(204).build();

    //If the domain name has not been found
    }else if(output.matches(domainNotFoundPattern)){
      return Response.status(404).entity(output).build();

    //Default answer
    } else {
      return Response.status(500).entity(output).build();

    }
  }

  public Response add(Domain2Add domain){
    return Response.status(418).entity("Nothing ready yet to add a new domain.").build();
  }

	private String executeCommand(String command) {

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

		return output.toString();

	}

  public String getResult() {
    return result;
  }

}
