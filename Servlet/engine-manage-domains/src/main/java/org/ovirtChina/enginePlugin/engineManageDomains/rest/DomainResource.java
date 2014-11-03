package org.ovirtChina.enginePlugin.engineManageDomains.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


import org.ovirtChina.enginePlugin.engineManageDomains.model.Domain;
import org.ovirtChina.enginePlugin.engineManageDomains.model.EditRequest;
import org.ovirtChina.enginePlugin.engineManageDomains.process.CommandExecuter;

@Path("/domains")
public class DomainResource {

  @GET
  @Path("/list")
  @Produces(MediaType.APPLICATION_JSON)
  public Response printDomain() {

    CommandExecuter cmdExec = new CommandExecuter();

    return cmdExec.list();
  }

  @DELETE
  @Path("/{domain}/delete")
  public Response removeDomain(@PathParam("domain") String domainName) {

    CommandExecuter cmdExec = new CommandExecuter();

    return cmdExec.delete(domainName);
  }

  @PUT
  @Path("/add")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response addDomain( Domain domain ) {

    String output = domain.toString();

    return Response.status(200).entity(output).build();
  }

  @PUT
  @Path("/{domain}/edit")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response editDomain(@PathParam("domain") String domain, EditRequest editRequest) {

    //Test purpose
    String testName = "domain_test";

    if(domain.equals(testName)){

      String output = editRequest.toString();;

      return Response.status(200).entity(output).build();

    }else{

      String output = "Impossible to edit the domain " + domain + ". This domain doesn't exist.";

      return Response.status(404).entity(output).build();
    }
  }
}
