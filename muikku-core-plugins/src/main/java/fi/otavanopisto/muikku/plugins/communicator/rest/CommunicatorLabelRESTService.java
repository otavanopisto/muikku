package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorPermissionCollection;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.AuthorizationException;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/communicator")
@RequestScoped
@Stateful
@Produces ("application/json")
public class CommunicatorLabelRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5020674196438210604L;

  @Inject
  @BaseUrl
  private String baseUrl;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private CommunicatorController communicatorController;
  
  @GET
  @Path ("/userLabels")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserLabels() throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    List<CommunicatorUserLabel> userLabels = communicatorController.listUserLabelsByUserEntity(userEntity);
    List<CommunicatorUserLabelRESTModel> result = new ArrayList<CommunicatorUserLabelRESTModel>();
    
    for (CommunicatorUserLabel userLabel : userLabels) {
      result.add(toRESTModel(userLabel));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/userLabels")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createUserLabel(CommunicatorUserLabelRESTModel newUserLabel) throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    CommunicatorUserLabel userLabel = communicatorController.createUserLabel(newUserLabel.getName(), newUserLabel.getColor(), userEntity);

    return Response.ok(
      toRESTModel(userLabel)
    ).build();
  }
  
  @GET
  @Path ("/userLabels/{USERLABELID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserLabel(
      @PathParam ("USERLABELID") Long userLabelId
   ) throws AuthorizationException {
    CommunicatorUserLabel userLabel = communicatorController.findUserLabelById(userLabelId);
    
    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, userLabel)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    return Response.ok(
      toRESTModel(userLabel)
    ).build();
  }

  @DELETE
  @Path ("/userLabels/{USERLABELID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteUserLabel(
      @PathParam ("USERLABELID") Long userLabelId
   ) throws AuthorizationException {
    CommunicatorUserLabel userLabel = communicatorController.findUserLabelById(userLabelId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, userLabel)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    communicatorController.delete(userLabel);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/userLabels/{USERLABELID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response editUserLabel(
      @PathParam ("USERLABELID") Long userLabelId,
      CommunicatorUserLabelRESTModel updatedUserLabel
   ) throws AuthorizationException {
    if (!updatedUserLabel.getId().equals(userLabelId)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Id is immutable").build();
    }

    CommunicatorUserLabel userLabel = communicatorController.findUserLabelById(userLabelId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, userLabel)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    CommunicatorUserLabel editedUserLabel = communicatorController.updateUserLabel(userLabel, updatedUserLabel.getName(), updatedUserLabel.getColor());

    return Response.ok(
      toRESTModel(editedUserLabel)
    ).build();
  }
  
  private CommunicatorUserLabelRESTModel toRESTModel(CommunicatorUserLabel editedUserLabel) {
    return new CommunicatorUserLabelRESTModel(editedUserLabel.getId(), editedUserLabel.getName(), editedUserLabel.getColor());    
  }
}
