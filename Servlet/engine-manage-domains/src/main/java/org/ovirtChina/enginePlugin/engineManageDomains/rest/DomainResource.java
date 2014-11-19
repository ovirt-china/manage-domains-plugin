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
  @Produces(MediaType.APPLICATION_JSON)
  public Response printDomain() {

    System.out.println("----- New Request -----");
    System.out.println("New Request: GET - /domains");

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
  @Path("/{domainName}")
  public Response removeDomain(@PathParam("domainName") String domainName) {

    System.out.println("----- New Request -----");
    System.out.println("New Request: DELETE - /domains/" + domainName);

    CommandExecuter cmdExec = new CommandExecuter();

    return cmdExec.delete(domainName);
  }

  /**
  * Delete the domain indicate in the url.
  *
  * @param   the name of the domain to delete
  * @return  an HTTP Status Code accroding to the success or not of the action.
  */
  @PUT
  @Path("/{domainName}/delete")
  public Response put2RemoveDomain(@PathParam("domainName") String domainName) {

    System.out.println("----- New Request -----");
    System.out.println("New Request: PUT - /domains/" + domainName + "/delete");

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
  @Path("/{domainName}")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response addDomain(@PathParam("domainName") String domainName, DomainRequest domain2add) {

    System.out.println("----- New Request -----");
    System.out.println("New Request: PUT - /domains/" + domainName + " - " + domain2add.toString());

    CommandExecuter cmdExec = new CommandExecuter();

    if (domainName.equals(domain2add.getDomain())){
      return cmdExec.add(domain2add);

    } else {
      return Response.status(400).entity("The domain in the url and the JSON object are not matching.").build();

    }
  }

  /**
  * Edit a domain according to the information given in the JSON object with the request and the path param
  *
  * @param   all the information needed to edit a domain.
  * @return  an HTTP Status Code accroding to the success or not of the action and a message.
  */
  @PUT
  @Path("/{domainName}/edit")
  @Consumes(MediaType.APPLICATION_JSON)
  public Response editDomain(@PathParam("domainName") String domainName, DomainRequest domain2edit) {

    System.out.println("----- New Request -----");
    System.out.println("New Request: PUT - /domains/" + domainName + "/edit - " + domain2edit.toString());

    CommandExecuter cmdExec = new CommandExecuter();

    if (domainName.equals(domain2edit.getDomain())){
      return cmdExec.edit(domain2edit);

    } else {
      return Response.status(400).entity("The domain in the url and the JSON object are not matching.").build();

    }
  }
}
