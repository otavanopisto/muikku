package fi.otavanopisto.muikku.plugins.user.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeUnauthorizedException;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;

@Path("/userplugin")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class UserPluginRESTService extends PluginRESTService {

  private static final long serialVersionUID = -3009238121067011985L;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Path("/credentials")
  @GET
  @RESTPermitUnimplemented
  public Response getCredentials() {
    User user = userSchoolDataController.findUser(sessionController.getLoggedUserSchoolDataSource(), sessionController.getLoggedUserIdentifier());
      
    try {
      String username = userSchoolDataController.findUsername(user);
    
      if (username != null) {
        UserCredentials credentials = new UserCredentials(null, username, null);
        
        return Response.ok(credentials).build();
      } else
        return Response.noContent().build();
    } catch (SchoolDataBridgeUnauthorizedException e) {
      return Response.status(Status.FORBIDDEN).build();
    }
  }

  @Path("/credentials")
  @PUT
  @RESTPermitUnimplemented
  public Response updateCredentials(UserCredentials userCredentialChange) {
    User user = userSchoolDataController.findUser(sessionController.getLoggedUserSchoolDataSource(), sessionController.getLoggedUserIdentifier());

    try {
      userSchoolDataController.updateUserCredentials(user, userCredentialChange.getOldPassword(), 
          userCredentialChange.getUsername(), userCredentialChange.getNewPassword());
    
      return Response.noContent().build();
    } catch (SchoolDataBridgeUnauthorizedException e) {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
}
