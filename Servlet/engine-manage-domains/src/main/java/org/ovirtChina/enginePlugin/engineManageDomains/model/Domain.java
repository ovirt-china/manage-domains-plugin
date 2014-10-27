package org.ovirtChina.enginePlugin.engineManageDomains.model;

public class Domain {

  private String domain;
  private String username;

  public Domain(){
    this.domain="";
    this.username="";
  }
  public Domain(String domain,String username){
    this.domain=domain;
    this.username=username;
  }
  public String getDomain() {
    return domain;
  }
  public String getUsername() {
    return username;
  }

  @Override
	public String toString() {
		return new StringBuffer(" Domain : ").append(this.name)
				.append(" Username : ").append(this.username).toString();
	}

}
