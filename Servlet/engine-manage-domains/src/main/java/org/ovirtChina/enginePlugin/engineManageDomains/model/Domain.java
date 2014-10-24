package org.ovirtChina.enginePlugin.engineManageDomains.model;

public class Domain {

  private String name;
  private String username;

  public Domain(){
    this.name="";
    this.username="";
  }
  public Domain(String name,String username){
    this.name=name;
    this.username=username;
  }
  public String getName() {
    return name;
  }
  public String getUsername() {
    return username;
  }
}
