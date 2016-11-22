package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorFolderType;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
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

  private static final long serialVersionUID = 6680345677459264564L;

  @Inject
  @BaseUrl
  private String baseUrl;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private CommunicatorController communicatorController;

  @Inject
  private CommunicatorRESTModels restModels;
  
  @GET
  @Path ("/messages/{COMMUNICATORMESSAGEID}/labels")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listMessageIdLabels(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) throws AuthorizationException {
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    // Lists only labels of logged user so we can consider this safe
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    List<CommunicatorMessageIdLabel> labels = communicatorController.listMessageIdLabelsByUserEntity(userEntity, messageId);
    
    return Response.ok(
      restModels.restLabel(labels)
    ).build();
  }
  
  @POST
  @Path ("/messages/{COMMUNICATORMESSAGEID}/labels")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createMessageIdLabel(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
      CommunicatorMessageIdLabelRESTModel newLabel) throws AuthorizationException {
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    CommunicatorLabel label = communicatorController.findUserLabelById(newLabel.getLabelId());
    
    if ((label != null) && canAccessLabel(userEntity, label)) {
      CommunicatorMessageIdLabel userLabel = communicatorController.findMessageIdLabel(userEntity, messageId, label);
      
      if (userLabel == null) {
        userLabel = communicatorController.createMessageIdLabel(userEntity, messageId, label);
    
        return Response.ok(
          restModels.restLabel(userLabel)
        ).build();
      } else {
        return Response.status(Status.BAD_REQUEST).build();
      }
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }
  
  @GET
  @Path ("/messages/{COMMUNICATORMESSAGEID}/labels/{LABELID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getMessageIdLabel(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
      @PathParam ("LABELID") Long labelId
   ) throws AuthorizationException {
    CommunicatorMessageIdLabel label = communicatorController.findMessageIdLabelById(labelId);
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    if (!canAccessLabel(userEntity, label.getLabel())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    return Response.ok(
      restModels.restLabel(label)
    ).build();
  }

  @DELETE
  @Path ("/messages/{COMMUNICATORMESSAGEID}/labels/{LABELID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteUserLabel(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
      @PathParam ("LABELID") Long userLabelId) throws AuthorizationException {
    CommunicatorMessageIdLabel label = communicatorController.findMessageIdLabelById(userLabelId);
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    if (!canAccessLabel(userEntity, label.getLabel())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    communicatorController.delete(label);
    
    return Response.noContent().build();
  }

  @GET
  @Path ("/userLabels")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserLabels() throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    // Lists only labels of logged user so we can consider this safe
    List<CommunicatorUserLabel> userLabels = communicatorController.listUserLabelsByUserEntity(userEntity);
    
    return Response.ok(
      restModels.restUserLabel(userLabels)
    ).build();
  }
  
  @POST
  @Path ("/userLabels")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createUserLabel(CommunicatorUserLabelRESTModel newUserLabel) throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    // Creates only labels for logged user so we can consider this safe
    CommunicatorUserLabel userLabel = communicatorController.createUserLabel(newUserLabel.getName(), newUserLabel.getColor(), userEntity);

    return Response.ok(
      restModels.restUserLabel(userLabel)
    ).build();
  }
  
  @GET
  @Path ("/userLabels/{USERLABELID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserLabel(
      @PathParam ("USERLABELID") Long userLabelId
   ) throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    CommunicatorUserLabel userLabel = communicatorController.findUserLabelById(userLabelId);
    
    if ((userLabel != null) && canAccessLabel(userEntity, userLabel)) {
      return Response.ok(
        restModels.restUserLabel(userLabel)
      ).build();
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }

  @DELETE
  @Path ("/userLabels/{USERLABELID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteUserLabel(
      @PathParam ("USERLABELID") Long userLabelId
   ) throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    CommunicatorUserLabel userLabel = communicatorController.findUserLabelById(userLabelId);

    if ((userLabel != null) && canAccessLabel(userEntity, userLabel)) {
      communicatorController.delete(userLabel);
    
      return Response.noContent().build();
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }

  @PUT
  @Path ("/userLabels/{USERLABELID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response editUserLabel(
      @PathParam ("USERLABELID") Long userLabelId,
      CommunicatorUserLabelRESTModel updatedUserLabel
   ) throws AuthorizationException {
    if (!updatedUserLabel.getId().equals(userLabelId)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Id is immutable").build();
    }

    UserEntity userEntity = sessionController.getLoggedUserEntity();
    CommunicatorUserLabel userLabel = communicatorController.findUserLabelById(userLabelId);

    if ((userLabel != null) && canAccessLabel(userEntity, userLabel)) {
      CommunicatorUserLabel editedUserLabel = communicatorController.updateUserLabel(userLabel, updatedUserLabel.getName(), updatedUserLabel.getColor());

      return Response.ok(
        restModels.restUserLabel(editedUserLabel)
      ).build();
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }

  @GET
  @Path ("/userLabels/{USERLABELID}/messages/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserUnreadCommunicatorMessagesByMessageId( 
      @PathParam ("USERLABELID") Long userLabelId,
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    CommunicatorUserLabel userLabel = communicatorController.findUserLabelById(userLabelId);
    
    if ((userLabel != null) && canAccessLabel(userEntity, userLabel)) {
      CommunicatorMessageId threadId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
      
      List<CommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(userEntity, threadId, false);
  
      CommunicatorMessageId olderThread = communicatorController.findOlderThreadId(userEntity, threadId, CommunicatorFolderType.LABEL, userLabel);
      CommunicatorMessageId newerThread = communicatorController.findNewerThreadId(userEntity, threadId, CommunicatorFolderType.LABEL, userLabel);
      
      return Response.ok(
        restModels.restThreadViewModel(receivedItems, olderThread, newerThread)
      ).build();
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }
  
  private boolean canAccessLabel(UserEntity userEntity, CommunicatorLabel label) {
    if (label instanceof CommunicatorUserLabel) {
      // No access if not logged in
      if (userEntity == null)
        return false;
      
      CommunicatorUserLabel userLabel = (CommunicatorUserLabel) label;
      return userEntity.getId().equals(userLabel.getUserEntity());
    }
    
    return false;
  }
  
}
