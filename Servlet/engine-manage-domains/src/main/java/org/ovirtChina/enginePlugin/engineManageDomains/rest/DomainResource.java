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
import org.ovirtChina.enginePlugin.engineManageDomains.model.DomainRequest;
import org.ovirtChina.enginePlugin.engineManageDomains.model.EditRequest;
import org.ovirtChina.enginePlugin.engineManageDomains.process.CommandExecuter;

@Path("/domains")
public class DomainResource {

  /**
  * Returns the a collection of JSON objects describing the domain linked to the engine.
  * Because the list command doesn't give us more information than the domain and the username,
  * we don't give more information.
  *
  * @return a Response containing a JSON collection of the domains' informations.
  */
  @GET
  @Path("/list")
  @Produces(MediaType.APPLICATION_JSON)
  public Response printDomain() {

    CommandExecuter cmdExec = new CommandExecuter();

    return cmdExec.list();
  }

  /**
  * Delete the domain indicate in the url.
  *
  * @param   the name of the domain to delete
  * @return  an HTTP Status Code accroding to the success or not of the action.
  */
  @DELETE
  @Path("/{domain}/delete")
  public Response removeDomain(@PathParam("domain") String domainName) {

    CommandExecuter cmdExec = new CommandExecuter();

    return cmdExec.delete(domainName);
  }

  /**
  * Add a domain according to the information given in the JSON object with the request.
  *
  * @param   all the information needed to add a domain.
  * @return  an HTTP Status Code accroding to the success or not of the action and a message.
  */
  @PUT
  @Path("/add")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response addDomain( DomainRequest domain) {

    CommandExecuter cmdExec = new CommandExecuter();

    return cmdExec.add(domain);
  }

  @PUT
  @Path("/{domain}/edit")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response editDomain(@PathParam("domain") String domainName, DomainRequest domain2edit) {

    CommandExecuter cmdExec = new CommandExecuter();

    return cmdExec.edit(domainName, domain2edit);


    // //Test purpose
    // String testName = "domain_test";
    //
    // if(domain.equals(testName)){
    //
    //   String output = editRequest.toString();;
    //
    //   return Response.status(200).entity(output).build();
    //
    // }else{
    //
    //   String output = "Impossible to edit the domain " + domain + ". This domain doesn't exist.";
    //
    //   return Response.status(404).entity(output).build();
    // }
  }
}
