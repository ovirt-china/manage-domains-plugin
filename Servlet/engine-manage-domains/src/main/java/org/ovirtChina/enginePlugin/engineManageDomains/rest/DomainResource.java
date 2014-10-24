package org.ovirtChina.enginePlugin.engineManageDomains.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


import org.ovirtChina.enginePlugin.engineManageDomains.model.Domain;

@Path("/domains")
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

  @POST
  @Path("/add")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response consumeJSON ( Domain domain ) {

    String output = domain.toString();

    return Response.status(200).entity(output).build();
  }



}
