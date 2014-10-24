package org.ovirtChina.enginePlugin.engineManageDomains.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ovirtChina.enginePlugin.engineManageDomains.model.Domain;

@Path("/domain")
public class DomainResource {

  @GET
  @Path("/list")
  @Produces(MediaType.APPLICATION_JSON)
  public List<Domain> printDomain() {
    List<Domain> domainList = new ArrayList<Domain>();
    String[] names = {"AD_DOMAIN","auth-server"};
    String username = "admin";
    for(String name:names){
      domainList.add(new Domain(name,username));
    }
    return domainList;
  }

}
