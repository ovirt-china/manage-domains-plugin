package org.ovirtChina.enginePlugin.engineManageDomains.model;

public class Domain {

  private String domain;
  private String username;
  private Boolean status;

  public Domain(){
    this.domain="";
    this.username="";
    this.status=false;
  }
  public Domain(String domain,String username, Boolean status){
    this.domain=domain;
    this.username=username;
    this.status=status;
  }
  public String getDomain() {
    return domain;
  }
  public String getUsername() {
    return username;
  }
  public Boolean getStatus() {
    return status;
  }

  @Override
	public String toString() {
		return new StringBuffer(" Domain : ").append(this.name)
				.append(" Username : ").append(this.username)
        .append(" Status : ").append(this.status).toString();
	}

}
