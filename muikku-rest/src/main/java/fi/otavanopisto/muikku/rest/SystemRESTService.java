package fi.otavanopisto.muikku.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.binary.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/system")
@Produces("application/json")
public class SystemRESTService extends AbstractRESTService {
  
  @Inject
  private SystemSettingsController systemSettingsController;

  @GET
  @Path("/ping")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response ping() {
    return Response.ok("pong").build();
  }
  
  @GET
  @Path("/status")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response status() {
    String setting = systemSettingsController.getSetting("defaultOrganization");
    if (!StringUtils.equals(setting, "PYRAMUS-1")) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    return Response.ok("ok").build();
  }
}
