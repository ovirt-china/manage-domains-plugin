package org.ovirtChina.enginePlugin.engineManageDomains.rest;

import java.util.HashSet;
import java.util.Set;

import javax.naming.NamingException;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import org.ovirtChina.enginePlugin.engineManageDomains.rest.DomainResource;

@ApplicationPath("/")
public class BackendApplication extends Application {
    public final static String ApplicationJson = "application/json";

    private final Set<Object> singletons = new HashSet<Object>();

    @Override
    public Set<Object> getSingletons () {
        return singletons;
    }

    public BackendApplication() {
        singletons.add(new DomainResource());
    }

}
