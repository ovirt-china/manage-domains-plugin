package org.ovirtChina.enginePlugin.engineManageDomains.process;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class ListCLI {

  private String result;

	public ListCLI() {

		String command = "engine-manage-domains list";

		result = executeCommand(command);

		System.out.println(result);

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
