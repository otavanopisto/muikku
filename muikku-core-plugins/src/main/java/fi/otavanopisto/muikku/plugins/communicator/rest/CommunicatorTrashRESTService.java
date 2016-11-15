package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorFolderType;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
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
  private CommunicatorRESTModels restModels;
  
  @GET
  @Path ("/trash")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserTrashItems(
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    List<CommunicatorMessage> trashItems = communicatorController.listTrashItems(user, firstResult, maxResults);

    List<CommunicatorThreadRESTModel> result = new ArrayList<CommunicatorThreadRESTModel>();
    
    for (CommunicatorMessage receivedItem : trashItems) {
      String categoryName = receivedItem.getCategory() != null ? receivedItem.getCategory().getName() : null;
      boolean hasUnreadMsgs = false;
      Date latestMessageDate = receivedItem.getCreated();
      
      List<CommunicatorMessageRecipient> recipients = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(
          user, receivedItem.getCommunicatorMessageId(), true);
      
      for (CommunicatorMessageRecipient recipient : recipients) {
        hasUnreadMsgs = hasUnreadMsgs || Boolean.FALSE.equals(recipient.getReadByReceiver()); 
        Date created = recipient.getCommunicatorMessage().getCreated();
        latestMessageDate = latestMessageDate == null || latestMessageDate.before(created) ? created : latestMessageDate;
      }
      
      UserBasicInfo senderBasicInfo = restModels.getSenderBasicInfo(receivedItem);
      Long messageCountInThread = communicatorController.countMessagesByUserAndMessageId(user, receivedItem.getCommunicatorMessageId(), true);

      List<CommunicatorMessageIdLabel> labels = communicatorController.listMessageIdLabelsByUserEntity(user, receivedItem.getCommunicatorMessageId());
      List<CommunicatorMessageIdLabelRESTModel> restLabels = restModels.restLabel(labels);
      
      result.add(new CommunicatorThreadRESTModel(receivedItem.getId(), receivedItem.getCommunicatorMessageId().getId(), 
          receivedItem.getSender(), senderBasicInfo, categoryName, receivedItem.getCaption(), receivedItem.getCreated(), 
          restModels.tagIdsToStr(receivedItem.getTags()), hasUnreadMsgs, latestMessageDate, messageCountInThread, restLabels));
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
    
    CommunicatorMessageId threadId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<CommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(user, threadId, true);

    CommunicatorMessageId olderThread = communicatorController.findOlderThreadId(user, threadId, CommunicatorFolderType.TRASH, null);
    CommunicatorMessageId newerThread = communicatorController.findNewerThreadId(user, threadId, CommunicatorFolderType.TRASH, null);
    
    return Response.ok(
      restModels.restThreadViewModel(receivedItems, olderThread, newerThread)
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
    
    return Response.noContent().build();
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
    
    return Response.noContent().build();
  }
  
}
