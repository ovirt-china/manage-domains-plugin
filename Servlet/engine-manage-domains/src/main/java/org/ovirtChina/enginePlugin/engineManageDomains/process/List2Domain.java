package org.ovirtChina.enginePlugin.engineManageDomains.process;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

import org.ovirtChina.enginePlugin.engineManageDomains.model.Domain;

public class List2Domain {
  private String text2parse;
  private boolean waiting4Domain = true;
  private final String DOMAIN = "Domain";
  private final String USERNAME = "User name";

  public List2Domain(String text2parse){
    this.text2parse = text2parse;
  }

  /**
  * Returns a List of the Domains from the String text2parse.
  * A Domain is add to the list only if the it have a name and a user.
  *
  * @return    List of Domains object (Empty list if there is no Domain).
  */
  public List<Domain> parse(){
    // Declare the List<Domain> to fill
    List<Domain> domainList = new ArrayList<Domain>();

    // Create the scanner
    Scanner scanner =  new Scanner(text2parse);

    String domainName = "";

    while (scanner.hasNextLine()){
      String value = processLine(scanner.nextLine());

      if (!value.isEmpty()){
        if(waiting4Domain){
          domainName = value;
          waiting4Domain = false;

        } else {
          domainList.add(new Domain(domainName,value));
          waiting4Domain = true;
        }
      }

    }

    return domainList;
  }

  /**
  * Returns the value of the field describe on this line according to what is needed to create a domain (waiting4domain).
  * Otherwise return an empty String.
  *
  * @param  aLine  line to parse
  * @return        value on the line
  */
  private String processLine(String aLine){
    //use a second Scanner to parse the content of each line
    Scanner scanner = new Scanner(aLine);

    scanner.useDelimiter(":");

    if (scanner.hasNext()){

      String name = scanner.next().trim();
      String value = scanner.next().trim();

      if (waiting4Domain && name.equals(DOMAIN)){
        return value;

      } else if (!waiting4Domain && name.equals(USERNAME)) {
        return value;

      } else {
        System.out.println("None relevant information on that line.");
        return "";

      }

    } else {
      System.out.println("Empty or invalid line. Unable to process.");
      return "";

    }
  }
}
