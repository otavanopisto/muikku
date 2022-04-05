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
import javax.ws.rs.PUT;
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
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientUserGroup;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientWorkspaceGroup;
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
      
      CommunicatorUserBasicInfo senderBasicInfo = restModels.getCommunicatorUserBasicInfo(receivedItem.getSender());
      Long messageCountInThread = communicatorController.countMessagesByUserAndMessageId(user, receivedItem.getCommunicatorMessageId(), true);
      List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(receivedItem);
      List<CommunicatorMessageRecipientUserGroup> userGroupRecipients = communicatorController.listCommunicatorMessageUserGroupRecipients(receivedItem);
      List<CommunicatorMessageRecipientWorkspaceGroup> workspaceGroupRecipients = communicatorController.listCommunicatorMessageWorkspaceGroupRecipients(receivedItem);

      List<CommunicatorMessageIdLabel> labels = communicatorController.listMessageIdLabelsByUserEntity(user, receivedItem.getCommunicatorMessageId());
      List<CommunicatorMessageIdLabelRESTModel> restLabels = restModels.restLabel(labels);
      List<CommunicatorUserBasicInfo> restRecipients = restModels.restRecipient2(messageRecipients);
      List<fi.otavanopisto.muikku.rest.model.UserGroup> restUserGroupRecipients = restModels.restUserGroupRecipients(userGroupRecipients);
      List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> restWorkspaceRecipients = restModels.restWorkspaceGroupRecipients(workspaceGroupRecipients);

      Long recipientCount = (long) messageRecipients.size() + userGroupRecipients.size() + workspaceGroupRecipients.size();
      
      result.add(new CommunicatorSentThreadRESTModel(receivedItem.getId(), receivedItem.getCommunicatorMessageId().getId(), 
          receivedItem.getSender(), senderBasicInfo, categoryName, receivedItem.getCaption(), receivedItem.getCreated(), 
          restModels.tagIdsToStr(receivedItem.getTags()), hasUnreadMsgs, latestMessageDate, messageCountInThread, restLabels,
          restRecipients, restUserGroupRecipients, restWorkspaceRecipients, recipientCount));
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

    List<CommunicatorMessageIdLabel> labels = communicatorController.listMessageIdLabelsByUserEntity(user, threadId);
    List<CommunicatorMessageIdLabelRESTModel> restLabels = restModels.restLabel(labels);

    CommunicatorMessageId olderThread = communicatorController.findOlderThreadId(user, threadId, CommunicatorFolderType.TRASH, null);
    CommunicatorMessageId newerThread = communicatorController.findNewerThreadId(user, threadId, CommunicatorFolderType.TRASH, null);
    
    return Response.ok(
      restModels.restThreadViewModel(receivedItems, olderThread, newerThread, restLabels)
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
  
  @PUT
  @Path ("/trash/{COMMUNICATORMESSAGEID}/restore")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteReceivedMessages(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    UserEntity user = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    communicatorController.unTrashAllThreadMessages(user, messageId);
    
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
      if (!Boolean.TRUE.equals(r.getReadByReceiver())) {
        communicatorController.updateReadByReceiver(r, true);
      }
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
      
      communicatorController.updateReadByReceiver(r, false);
    }
    
    return Response.noContent().build();
  }
  
}
