package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.otavanopisto.muikku.controller.TagController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.AuthorizationException;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/communicator")
@RequestScoped
@Stateful
@Produces ("application/json")
public class CommunicatorTrashRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8518983552343926644L;

  @Inject
  @BaseUrl
  private String baseUrl;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private TagController tagController;

  @GET
  @Path ("/trash")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserTrashItems(
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    List<CommunicatorMessage> trashItems = communicatorController.listTrashItems(user, firstResult, maxResults);

    List<CommunicatorMessageRESTModel> result = new ArrayList<CommunicatorMessageRESTModel>();
    
    for (CommunicatorMessage msg : trashItems) {
      String categoryName = msg.getCategory() != null ? msg.getCategory().getName() : null;
      
      result.add(new CommunicatorMessageRESTModel(
          msg.getId(), msg.getCommunicatorMessageId().getId(), msg.getSender(), categoryName, 
          msg.getCaption(), msg.getContent(), msg.getCreated(), tagIdsToStr(msg.getTags()), getMessageRecipientIdList(msg)));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/trash/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserCommunicatorMessagesByMessageId(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<CommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(user, messageId, true);

    List<CommunicatorMessageRESTModel> result = new ArrayList<CommunicatorMessageRESTModel>();
    
    for (CommunicatorMessage msg : receivedItems) {
      String categoryName = msg.getCategory() != null ? msg.getCategory().getName() : null;
      
      result.add(new CommunicatorMessageRESTModel(
          msg.getId(), msg.getCommunicatorMessageId().getId(), msg.getSender(), categoryName, 
          msg.getCaption(), msg.getContent(), msg.getCreated(), tagIdsToStr(msg.getTags()), getMessageRecipientIdList(msg)));
    }
    
    return Response.ok(
      result
    ).build();
  }

  @DELETE
  @Path ("/trash/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteTrashMessages(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    UserEntity user = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId threadId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    communicatorController.archiveTrashedMessages(user, threadId);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path ("/trash/{COMMUNICATORMESSAGEID}/messagecount")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getCommunicatorMessageMessageCount( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    Long result = communicatorController.countMessagesByUserAndMessageId(user, messageId, true);
    
    return Response.ok(
      result
    ).build();
  }

  @POST
  @Path ("/trash/{COMMUNICATORMESSAGEID}/markasread")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response markTrashAsRead( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    List<CommunicatorMessageRecipient> list = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(user, messageId, true);
    
    for (CommunicatorMessageRecipient r : list) {
      communicatorController.updateRead(r, true);
    }
    
    return Response.ok(
      
    ).build();
  }

  @POST
  @Path ("/trash/{COMMUNICATORMESSAGEID}/markasunread")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response markTrashAsUnRead( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
      @QueryParam("messageIds") List<Long> messageIds) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    List<CommunicatorMessageRecipient> list = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(user, messageId, false);
    
    for (CommunicatorMessageRecipient r : list) {
      if ((messageIds != null) && (r.getCommunicatorMessage() != null)) {
        if (!messageIds.isEmpty() && !messageIds.contains(r.getCommunicatorMessage().getId()))
          continue;
      }
      
      communicatorController.updateRead(r, false);
    }
    
    return Response.ok().build();
  }

  private List<Long> getMessageRecipientIdList(CommunicatorMessage msg) {
    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(msg);
    List<Long> recipients = new ArrayList<Long>();
    for (CommunicatorMessageRecipient messageRecipient : messageRecipients) {
      recipients.add(messageRecipient.getId());
    }

    return recipients;
  }
  
  private Set<String> tagIdsToStr(Set<Long> tagIds) {
    Set<String> tagsStr = new HashSet<String>();
    for (Long tagId : tagIds) {
      Tag tag = tagController.findTagById(tagId);
      if (tag != null)
        tagsStr.add(tag.getText());
    }
    return tagsStr;
  }

}
