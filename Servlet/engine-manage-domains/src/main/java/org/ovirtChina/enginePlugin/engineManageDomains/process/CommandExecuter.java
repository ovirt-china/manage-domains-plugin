package org.ovirtChina.enginePlugin.engineManageDomains.process;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import javax.ws.rs.core.Response;

import org.ovirtChina.enginePlugin.engineManageDomains.process.List2Domain;

public class CommandExecuter {

  private String result;

	public CommandExecuter() {
    //---DEBUG---
		System.out.println("Command Executer created.");
    //---!DEBUG---
	}

  public Response list(){

    // Execute the command in the linux shell
    String command = "engine-manage-domains list";
    String output = executeCommand(command);

    // Test if the command is successful
    String successSentence = "Manage Domains completed successfully\n";
    int msgSize = output.length() - successSentence.length();

    //---DEBUG---
    System.out.println("Success Sentence  : " + successSentence);
    System.out.println("Extracted Sentence: " + output.substring(msgSize));
    System.out.println("Is the command successful?: " + output.substring(msgSize).equals(successSentence));
    //---!DEBUG---

    if (output.substring(msgSize).equals(successSentence)){
      List2Domain listParser = new List2Domain(output.substring(0, msgSize));

      // String outputSuccess = output.substring(0, msgSize);

      // return Response.status(200).entity(listParser.parse()).setContentType("application/json").build();
      return Response.status(200).entity(listParser.parse()).build();

    }else{
      return Response.status(500).entity(output).build();

    }
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
