package fi.otavanopisto.muikku.rest;

import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
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

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/smowl")
@Produces("application/json")
public class SmowlRESTService extends AbstractRESTService {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private SystemSettingsController systemSettingsController; 

  /*
  insert into SystemSetting (settingKey, settingValue) values ('smowl.entityName', ''), ('smowl.apiKey', ''), 
    ('smowl.audience', ''), ('smowl.licenseKey', ''), ('smowl.jwtSecret', ''), ('smowl.entityName', '');
  */
  
  @POST
  @Path("/signjwt")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  @Consumes(MediaType.APPLICATION_JSON)
  public Response signJWT(Map<String, String> payload) {
    // Student-only endpoint
    if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.FORBIDDEN).entity("Caller is not a student").build();
    }

    final String issuer = "smowl_custom_integration";
    final String audience = systemSettingsController.getSetting("smowl.audience");
    final String licenseKey = systemSettingsController.getSetting("smowl.licenseKey");
    final String jwtSecret = systemSettingsController.getSetting("smowl.jwtSecret");
    final String entityName = systemSettingsController.getSetting("smowl.entityName");
    
    if (StringUtils.isAnyBlank(issuer, audience, licenseKey, jwtSecret, entityName)) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Smowl credentials are not set.").build();
    }
    
    Instant now = Instant.now();

    Set<String> allowedClaims = Set.of("activityType", "activityId", "activityContainerId", "isMonitoring");

    Map<String, String> claims = new HashMap<>();
    if (payload != null) {
      for (Entry<String, String> entry : payload.entrySet()) {
        if (allowedClaims.contains(entry.getKey())) {
          claims.put(entry.getKey(), entry.getValue());
        }
        else {
          return Response.status(Status.BAD_REQUEST).entity(String.format("Claim not allowed: %s", entry.getKey())).build();
        }
      }
    }    
    claims.put("entityKey", licenseKey);
    claims.put("userId", sessionController.getLoggedUserEntity().getId().toString());
    
    try {
      JWTClaimsSet.Builder claimBuilder = new JWTClaimsSet.Builder()
          .issuer(issuer)
          .audience(audience)
          .issueTime(Date.from(now))
          .expirationTime(Date.from(now.plus(12, ChronoUnit.HOURS)));
      
      // Add Claims to the JWT - Smowl wants variables related to it under 'data'
      claimBuilder.claim("data", claims);

      // Sign the JWT
      SignedJWT signedJWT = new SignedJWT(
          new JWSHeader(JWSAlgorithm.HS256),
          claimBuilder.build()
      );
      signedJWT.sign(new MACSigner(jwtSecret.getBytes()));
      String token = signedJWT.serialize();

      // Return object
      Map<String, Object> ret = new HashMap<>();
      ret.put("entityName", entityName);
      ret.put("token", token);
      
      return Response.ok().entity(ret).build();
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to sign JWT.", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Smowl credentials are not set.").build();
    }
  }
  
  @POST
  @Path("/alarms/{PATH: .*}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
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
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
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
