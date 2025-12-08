package fi.otavanopisto.muikku.rest;

import java.io.UnsupportedEncodingException;
import java.util.Base64;

import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/smowl")
@Produces("application/json")
public class SmowlRESTService extends AbstractRESTService {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private SystemSettingsController systemSettingsController; 

  // insert into SystemSetting (settingKey, settingValue) values ('smowl.entityName', ''), ('smowl.apiKey', '');

  @POST
  @Path("/alarms/{PATH: .*}")
  @RESTPermit(handling = Handling.INLINE)
  public Response alarmsProxy(@PathParam("PATH") String smowlPath,
      String entityBody) {
    
    // Staff-only endpoints
    if (!sessionController.hasAnyRole(EnvironmentRoleArchetype.STAFF_ROLES)) {
      return Response.status(Status.FORBIDDEN).entity("Management only available to staff members").build();
    }

    return proxyPost("/alarms/" + smowlPath, entityBody);
  }

  @POST
  @Path("/configs/{PATH: .*}")
  @RESTPermit(handling = Handling.INLINE)
  public Response configsProxy(@PathParam("PATH") String smowlPath,
      String entityBody) {
    
    // Staff-only endpoints
    if (!sessionController.hasAnyRole(EnvironmentRoleArchetype.STAFF_ROLES)) {
      return Response.status(Status.FORBIDDEN).entity("Management only available to staff members").build();
    }

    return proxyPost("/configs/" + smowlPath, entityBody);
  }

  private Response proxyPost(String smowlPath, String entityBody) {
    String smowlBaseUrl = "https://results-api.smowltech.net/index.php/v2";
    String smowlUrl = smowlBaseUrl + smowlPath;

    final String entityName = systemSettingsController.getSetting("smowl.entityName");
    final String apiKey = systemSettingsController.getSetting("smowl.apiKey");
    
    if (StringUtils.isAnyBlank(entityName, apiKey)) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Smowl credentials are not set.").build();
    }

    String authString;
    try {
      final String credentials = String.format("%s:%s", entityName, apiKey);
      authString = Base64.getEncoder().encodeToString(credentials.getBytes("UTF-8"));
    } catch (UnsupportedEncodingException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Failed to setup smowl credentials.").build();
    }
    
    Client client = ClientBuilder.newClient();
    
    Response smowlResponse = client.target(smowlUrl)
        .request(MediaType.APPLICATION_JSON_TYPE)
        .header(HttpHeaders.AUTHORIZATION, "Basic " + authString)
        .post(Entity.entity(entityBody, MediaType.APPLICATION_FORM_URLENCODED_TYPE));
    
    if (smowlResponse.hasEntity()) {
      return Response.status(smowlResponse.getStatus()).entity(smowlResponse.getEntity()).build();
    }
    else {
      return Response.status(smowlResponse.getStatus()).build();
    }
  }
}
