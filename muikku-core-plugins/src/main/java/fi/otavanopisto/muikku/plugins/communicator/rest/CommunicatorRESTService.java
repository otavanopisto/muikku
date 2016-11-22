package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.TagController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.notifier.NotifierController;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorAttachmentController;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorFolderType;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorNewInboxMessageNotification;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorPermissionCollection;
import fi.otavanopisto.muikku.plugins.communicator.events.CommunicatorMessageSent;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageAttachment;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.AuthorizationException;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/communicator")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class CommunicatorRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5020674196438210604L;

  @Inject
  @BaseUrl
  private String baseUrl;
  
  @Inject
  private Logger logger;
 
  @Inject
  private SessionController sessionController;
  
  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private CommunicatorAttachmentController communicatorAttachmentController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserController userController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private TagController tagController;

  @Inject
  private CommunicatorNewInboxMessageNotification communicatorNewInboxMessageNotification;
  
  @Inject
  private NotifierController notifierController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private CommunicatorRESTModels restModels;
  
  @Inject
  private Event<CommunicatorMessageSent> communicatorMessageSentEvent;
  
  @GET
  @Path ("/items")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserInboxMessages(
      @QueryParam("labelId") Long labelId,
      @QueryParam("onlyUnread") @DefaultValue ("false") Boolean onlyUnread,
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    UserEntity user = sessionController.getLoggedUserEntity();
    CommunicatorLabel label;
    
    if (labelId != null) {
      label = communicatorController.findUserLabelById(labelId);
      if (label == null)
        return Response.status(Status.NOT_FOUND).build();
    }
    else
      label = null;
      
    List<CommunicatorMessage> receivedItems;
    if (label != null)
      receivedItems = communicatorController.listReceivedItems(user, label, onlyUnread, firstResult, maxResults);
    else
      receivedItems = communicatorController.listReceivedItems(user, onlyUnread, firstResult, maxResults);

    List<CommunicatorThreadRESTModel> result = new ArrayList<CommunicatorThreadRESTModel>();
    
    for (CommunicatorMessage receivedItem : receivedItems) {
      String categoryName = receivedItem.getCategory() != null ? receivedItem.getCategory().getName() : null;
      boolean hasUnreadMsgs = false;
      Date latestMessageDate = receivedItem.getCreated();
      
      List<CommunicatorMessageRecipient> recipients = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(
          user, receivedItem.getCommunicatorMessageId(), false);
      
      for (CommunicatorMessageRecipient recipient : recipients) {
        hasUnreadMsgs = hasUnreadMsgs || Boolean.FALSE.equals(recipient.getReadByReceiver()); 
        Date created = recipient.getCommunicatorMessage().getCreated();
        latestMessageDate = latestMessageDate == null || latestMessageDate.before(created) ? created : latestMessageDate;
      }
      
      UserBasicInfo senderBasicInfo = restModels.getSenderBasicInfo(receivedItem);
      Long messageCountInThread = communicatorController.countMessagesByUserAndMessageId(user, receivedItem.getCommunicatorMessageId(), false);

      List<CommunicatorMessageIdLabel> labels = communicatorController.listMessageIdLabelsByUserEntity(user, receivedItem.getCommunicatorMessageId());
      List<CommunicatorMessageIdLabelRESTModel> restLabels = restModels.restLabel(labels);
      
      result.add(new CommunicatorThreadRESTModel(
          receivedItem.getId(), receivedItem.getCommunicatorMessageId().getId(), receivedItem.getSender(), senderBasicInfo, categoryName, 
          receivedItem.getCaption(), receivedItem.getCreated(), tagIdsToStr(receivedItem.getTags()), hasUnreadMsgs, latestMessageDate, 
          messageCountInThread, restLabels));
    }

    return Response.ok(
      result
    ).build();
  }

  @DELETE
  @Path ("/items/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteReceivedMessages(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    UserEntity user = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    communicatorController.trashAllThreadMessages(user, messageId);
    
    return Response.noContent().build();
  }

  @GET
  @Path ("/sentitems")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserSentCommunicatorItems(
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    List<CommunicatorMessage> sentItems = communicatorController.listSentItems(user, firstResult, maxResults);

    List<CommunicatorThreadRESTModel> result = new ArrayList<CommunicatorThreadRESTModel>();
    
    for (CommunicatorMessage sentItem : sentItems) {
      String categoryName = sentItem.getCategory() != null ? sentItem.getCategory().getName() : null;
      boolean hasUnreadMsgs = false;
      Date latestMessageDate = sentItem.getCreated();
      
      List<CommunicatorMessageRecipient> recipients = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(
          user, sentItem.getCommunicatorMessageId(), false);
      
      for (CommunicatorMessageRecipient recipient : recipients) {
        hasUnreadMsgs = hasUnreadMsgs || Boolean.FALSE.equals(recipient.getReadByReceiver()); 
        Date created = recipient.getCommunicatorMessage().getCreated();
        latestMessageDate = latestMessageDate == null || latestMessageDate.before(created) ? created : latestMessageDate;
      }
      
      UserBasicInfo senderBasicInfo = restModels.getSenderBasicInfo(sentItem);
      Long messageCountInThread = communicatorController.countMessagesByUserAndMessageId(user, sentItem.getCommunicatorMessageId(), false);

      List<CommunicatorMessageIdLabel> labels = communicatorController.listMessageIdLabelsByUserEntity(user, sentItem.getCommunicatorMessageId());
      List<CommunicatorMessageIdLabelRESTModel> restLabels = restModels.restLabel(labels);
      
      List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(sentItem);
      List<CommunicatorMessageRecipientRESTModel> restRecipients = restModels.restRecipient(messageRecipients);
      Long recipientCount = (long) messageRecipients.size();
      
      result.add(new CommunicatorSentThreadRESTModel(
          sentItem.getId(), sentItem.getCommunicatorMessageId().getId(), sentItem.getSender(), senderBasicInfo, categoryName, 
          sentItem.getCaption(), sentItem.getCreated(), tagIdsToStr(sentItem.getTags()), hasUnreadMsgs, latestMessageDate, 
          messageCountInThread, restLabels, restRecipients, recipientCount));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/sentitems/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserSentCommunicatorMessagesByMessageId( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId threadId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<CommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(user, threadId, false);

    CommunicatorMessageId olderThread = communicatorController.findOlderThreadId(user, threadId, CommunicatorFolderType.SENT, null);
    CommunicatorMessageId newerThread = communicatorController.findNewerThreadId(user, threadId, CommunicatorFolderType.SENT, null);
    
    return Response.ok(
      restModels.restThreadViewModel(receivedItems, olderThread, newerThread)
    ).build();
  }
  
  @DELETE
  @Path ("/sentitems/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteSentMessages(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    UserEntity user = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    communicatorController.trashSentMessages(user, messageId);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path ("/unread/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserUnreadCommunicatorMessagesByMessageId( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId threadId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<CommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(user, threadId, false);

    CommunicatorMessageId olderThread = communicatorController.findOlderThreadId(user, threadId, CommunicatorFolderType.UNREAD, null);
    CommunicatorMessageId newerThread = communicatorController.findNewerThreadId(user, threadId, CommunicatorFolderType.UNREAD, null);
    
    return Response.ok(
      restModels.restThreadViewModel(receivedItems, olderThread, newerThread)
    ).build();
  }
  
  @GET
  @Path ("/receiveditemscount")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getReceivedItemsCount() {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    List<CommunicatorMessageRecipient> receivedItems = communicatorController.listReceivedItemsByUserAndRead(user, false, false);

    // TODO could be more elegant, i presume
    
    long count = 0;
    Set<Long> ids = new HashSet<Long>();
    
    for (CommunicatorMessageRecipient r : receivedItems) {
      Long id = r.getCommunicatorMessage().getCommunicatorMessageId().getId();
      
      if (!ids.contains(id)) {
        ids.add(id);
        count++;
      }
    }
    
    return Response.ok(
      count
    ).build();
  }
  
  @GET
  @Path ("/messages/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserCommunicatorMessagesByMessageId( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId threadId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<CommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(user, threadId, false);

    CommunicatorMessageId olderThread = communicatorController.findOlderThreadId(user, threadId, CommunicatorFolderType.INBOX, null);
    CommunicatorMessageId newerThread = communicatorController.findNewerThreadId(user, threadId, CommunicatorFolderType.INBOX, null);
    
    return Response.ok(
      restModels.restThreadViewModel(receivedItems, olderThread, newerThread)
    ).build();
  }

  @GET
  @Path ("/messages/{COMMUNICATORMESSAGEID}/messagecount")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getCommunicatorMessageMessageCount( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    Long result = communicatorController.countMessagesByUserAndMessageId(user, messageId, false);
    
    return Response.ok(
      result
    ).build();
  }

  @POST
  @Path ("/messages")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response postMessage(
      CommunicatorNewMessageRESTModel newMessage
   ) throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    Set<Tag> tagList = parseTags(newMessage.getTags());
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : newMessage.getRecipientIds()) {
      UserEntity recipient = userEntityController.findUserEntityById(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }

    List<UserGroupEntity> userGroupRecipients = null;
    List<WorkspaceEntity> workspaceStudentRecipients = null;
    List<WorkspaceEntity> workspaceTeacherRecipients = null;
    
    if (!CollectionUtils.isEmpty(newMessage.getRecipientGroupIds())) {
      if (sessionController.hasEnvironmentPermission(CommunicatorPermissionCollection.COMMUNICATOR_GROUP_MESSAGING)) {
        userGroupRecipients = new ArrayList<UserGroupEntity>();
        
        for (Long groupId : newMessage.getRecipientGroupIds()) {
          UserGroupEntity group = userGroupEntityController.findUserGroupEntityById(groupId);
          userGroupRecipients.add(group);
        }
      } else {
        // Trying to feed group ids when you don't have permission greets you with bad request
        return Response.status(Status.BAD_REQUEST).build();
      }
    }

    // Workspace members

    if (!CollectionUtils.isEmpty(newMessage.getRecipientStudentsWorkspaceIds())) {
      workspaceStudentRecipients = new ArrayList<WorkspaceEntity>();
      
      for (Long workspaceId : newMessage.getRecipientStudentsWorkspaceIds()) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
  
        if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity))
          workspaceStudentRecipients.add(workspaceEntity);
        else
          return Response.status(Status.BAD_REQUEST).build();
      }
    }

    if (!CollectionUtils.isEmpty(newMessage.getRecipientTeachersWorkspaceIds())) {
      workspaceTeacherRecipients = new ArrayList<WorkspaceEntity>();
      
      for (Long workspaceId : newMessage.getRecipientTeachersWorkspaceIds()) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
  
        if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity))
          workspaceTeacherRecipients.add(workspaceEntity);
        else
          return Response.status(Status.BAD_REQUEST).build();
      }
    }
    
    if (StringUtils.isBlank(newMessage.getCategoryName())) {
      return Response.status(Status.BAD_REQUEST).entity("CategoryName missing").build();
    }

    // TODO Category not existing at this point would technically indicate an invalid state
    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(newMessage.getCategoryName());
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId, userEntity, 
        recipients, userGroupRecipients, workspaceStudentRecipients, workspaceTeacherRecipients, categoryEntity, 
        newMessage.getCaption(), newMessage.getContent(), tagList);
    
    sendNewMessageNotifications(message);
    
    return Response.ok(
      restModels.restFullMessage(message)
    ).build();
  }

  private void sendNewMessageNotifications(CommunicatorMessage message) {
    List<CommunicatorMessageRecipient> recipients = communicatorController.listAllCommunicatorMessageRecipients(message);
    
    for (CommunicatorMessageRecipient recipient : recipients) {
      // Don't notify the sender in case he sent message to himself
      if (recipient.getRecipient() != message.getSender())
        communicatorMessageSentEvent.fire(new CommunicatorMessageSent(message.getId(), recipient.getRecipient()));
    }
  }

  @POST
  @Path ("/items/{COMMUNICATORMESSAGEID}/markasread")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response markInboxAsRead( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    List<CommunicatorMessageRecipient> list = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(user, messageId, false);
    
    for (CommunicatorMessageRecipient r : list) {
      communicatorController.updateRead(r, true);
    }
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/items/{COMMUNICATORMESSAGEID}/markasunread")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response markInboxAsUnRead( 
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

  private Set<String> tagIdsToStr(Set<Long> tagIds) {
    Set<String> tagsStr = new HashSet<String>();
    for (Long tagId : tagIds) {
      Tag tag = tagController.findTagById(tagId);
      if (tag != null)
        tagsStr.add(tag.getText());
    }
    return tagsStr;
  }

  private Set<Tag> parseTags(Set<String> tags) {
    Set<Tag> result = new HashSet<Tag>();
    
    for (String t : tags) {
      Tag tag = tagController.findTag(t);
      
      if (tag == null)
        tag = tagController.createTag(t);
      
      result.add(tag);
    }
    
    return result;
  }
  
  @POST
  @Path ("/messages/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response postMessageReply(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId, CommunicatorNewMessageRESTModel newMessage
   ) throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId communicatorMessageId2 = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    Set<Tag> tagList = parseTags(newMessage.getTags());
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : newMessage.getRecipientIds()) {
      UserEntity recipient = userEntityController.findUserEntityById(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    List<UserGroupEntity> userGroupRecipients = null;
    List<WorkspaceEntity> workspaceStudentRecipients = null;
    List<WorkspaceEntity> workspaceTeacherRecipients = null;
    
    if (!CollectionUtils.isEmpty(newMessage.getRecipientGroupIds())) {
      if (sessionController.hasEnvironmentPermission(CommunicatorPermissionCollection.COMMUNICATOR_GROUP_MESSAGING)) {
        userGroupRecipients = new ArrayList<UserGroupEntity>();
        
        for (Long groupId : newMessage.getRecipientGroupIds()) {
          UserGroupEntity group = userGroupEntityController.findUserGroupEntityById(groupId);
          userGroupRecipients.add(group);
        }
      } else {
        // Trying to feed group ids when you don't have permission greets you with bad request
        return Response.status(Status.BAD_REQUEST).build();
      }
    }

    // Workspace members

    if (!CollectionUtils.isEmpty(newMessage.getRecipientStudentsWorkspaceIds())) {
      workspaceStudentRecipients = new ArrayList<WorkspaceEntity>();
      
      for (Long workspaceId : newMessage.getRecipientStudentsWorkspaceIds()) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
  
        if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity))
          workspaceStudentRecipients.add(workspaceEntity);
        else
          return Response.status(Status.BAD_REQUEST).build();
      }
    }

    if (!CollectionUtils.isEmpty(newMessage.getRecipientTeachersWorkspaceIds())) {
      workspaceTeacherRecipients = new ArrayList<WorkspaceEntity>();
      
      for (Long workspaceId : newMessage.getRecipientTeachersWorkspaceIds()) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
  
        if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity))
          workspaceTeacherRecipients.add(workspaceEntity);
        else
          return Response.status(Status.BAD_REQUEST).build();
      }
    }
    
    // TODO Category not existing at this point would technically indicate an invalid state
    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(newMessage.getCategoryName());
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId2, userEntity, 
        recipients, userGroupRecipients, workspaceStudentRecipients, workspaceTeacherRecipients, categoryEntity, 
        newMessage.getCaption(), newMessage.getContent(), tagList);

    sendNewMessageNotifications(message);
    
    return Response.ok(
      restModels.restFullMessage(message)
    ).build();
  }

  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getCommunicatorMessage(@PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) throws AuthorizationException {
    CommunicatorMessage msg = communicatorController.findCommunicatorMessageById(communicatorMessageId);
    
    if (!hasCommunicatorMessageAccess(msg)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    return Response.ok(
      restModels.restFullMessage(msg)
    ).build();
  }
  
  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}/recipients")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listCommunicatorMessageRecipients(@PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) throws AuthorizationException {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    if (!hasCommunicatorMessageAccess(communicatorMessage)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(communicatorMessage);

    return Response.ok(
      restModels.restRecipient(messageRecipients)
    ).build();
  }

  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}/recipients/{RECIPIENTID}/info")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listCommunicatorMessageRecipients(@PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId, @PathParam ("RECIPIENTID") Long recipientId) throws AuthorizationException {

    CommunicatorMessageRecipient recipient = communicatorController.findCommunicatorMessageRecipient(recipientId);

    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    if (!hasCommunicatorMessageAccess(communicatorMessage)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserEntity userEntity = userEntityController.findUserEntityById(recipient.getRecipient());
      fi.otavanopisto.muikku.schooldata.entity.User user = userController.findUserByUserEntityDefaults(userEntity);
      Boolean hasPicture = false; // TODO: userController.hasPicture(userEntity);
      
      fi.otavanopisto.muikku.rest.model.UserBasicInfo result = new fi.otavanopisto.muikku.rest.model.UserBasicInfo(
          userEntity.getId(), 
          user.getFirstName(), 
          user.getLastName(), 
          user.getStudyProgrammeName(),
          hasPicture,
          user.hasEvaluationFees(),
          user.getCurriculumIdentifier());
      
      return Response.ok(
        result
      ).build();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}/sender")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getCommunicatorMessageSenderInfo(@PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {

    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);
    if (!hasCommunicatorMessageAccess(communicatorMessage)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    return Response.ok(
      restModels.getSenderBasicInfo(communicatorMessage)
    ).build();
  }

  @GET
  @Path ("/templates")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserMessageTemplates() throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    List<CommunicatorMessageTemplate> templates = communicatorController.listMessageTemplates(userEntity);
    
    List<CommunicatorMessageTemplateRESTModel> result = new ArrayList<CommunicatorMessageTemplateRESTModel>();
    
    for (CommunicatorMessageTemplate template : templates) {
      result.add(new CommunicatorMessageTemplateRESTModel(template.getId(), template.getName(), template.getContent()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/templates")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createUserMessageTemplate(CommunicatorMessageTemplateRESTModel template) throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageTemplate messageTemplate = communicatorController.createMessageTemplate(template.getName(), template.getContent(), userEntity);

    CommunicatorMessageTemplateRESTModel result = new CommunicatorMessageTemplateRESTModel(messageTemplate.getId(), messageTemplate.getName(), messageTemplate.getContent());
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/templates/{TEMPLATEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserMessageTemplate(@PathParam ("TEMPLATEID") Long templateId) throws AuthorizationException {
    CommunicatorMessageTemplate template = communicatorController.getMessageTemplate(templateId);
    
    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, template)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    CommunicatorMessageTemplateRESTModel result = new CommunicatorMessageTemplateRESTModel(template.getId(), template.getName(), template.getContent());
    
    return Response.ok(
      result
    ).build();
  }

  @DELETE
  @Path ("/templates/{TEMPLATEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteUserMessageTemplate(@PathParam ("TEMPLATEID") Long templateId) throws AuthorizationException {
    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, messageTemplate)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    communicatorController.deleteMessageTemplate(messageTemplate);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/templates/{TEMPLATEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response editUserMessageTemplate(@PathParam ("TEMPLATEID") Long templateId, CommunicatorMessageTemplateRESTModel template) throws AuthorizationException {
    if (!template.getId().equals(templateId)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Id is immutable").build();
    }

    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, messageTemplate)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    CommunicatorMessageTemplate editMessageTemplate = communicatorController.editMessageTemplate(messageTemplate, template.getName(), template.getContent());

    CommunicatorMessageTemplateRESTModel result = new CommunicatorMessageTemplateRESTModel(editMessageTemplate.getId(), editMessageTemplate.getName(), editMessageTemplate.getContent());
    
    return Response.ok(
      result
    ).build();
  }

  @GET
  @Path ("/signatures")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserMessageSignatures() throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    List<CommunicatorMessageSignature> signatures = communicatorController.listMessageSignatures(userEntity);
    List<CommunicatorMessageSignatureRESTModel> result = new ArrayList<CommunicatorMessageSignatureRESTModel>();
    
    for (CommunicatorMessageSignature signature : signatures) {
      result.add(new CommunicatorMessageSignatureRESTModel(signature.getId(), signature.getName(), signature.getSignature()));
    }
    
    return Response.ok(
      result
    ).build();
  }
  
  @POST
  @Path ("/signatures")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createUserMessageSignature(CommunicatorMessageSignatureRESTModel newSignature) throws AuthorizationException {
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    CommunicatorMessageSignature messageSignature = communicatorController.createMessageSignature(newSignature.getName(), newSignature.getSignature(), userEntity);

    CommunicatorMessageSignatureRESTModel result = new CommunicatorMessageSignatureRESTModel(messageSignature.getId(), messageSignature.getName(), messageSignature.getSignature()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/signatures/{SIGNATUREID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserMessageSignature(
      @PathParam ("SIGNATUREID") Long signatureId
   ) throws AuthorizationException {
    CommunicatorMessageSignature signature = communicatorController.getMessageSignature(signatureId);
    
    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, signature)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    CommunicatorMessageSignatureRESTModel result = new CommunicatorMessageSignatureRESTModel(signature.getId(), signature.getName(), signature.getSignature());
    
    return Response.ok(
      result
    ).build();
  }

  @DELETE
  @Path ("/signatures/{SIGNATUREID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteUserMessageSignature(
      @PathParam ("SIGNATUREID") Long signatureId
   ) throws AuthorizationException {
    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, messageSignature)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    communicatorController.deleteMessageSignature(messageSignature);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/signatures/{SIGNATUREID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response editUserMessageSignature(
      @PathParam ("SIGNATUREID") Long signatureId,
      CommunicatorMessageSignatureRESTModel signature
   ) throws AuthorizationException {
    if (!signature.getId().equals(signatureId)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Id is immutable").build();
    }

    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS, messageSignature)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    CommunicatorMessageSignature editMessageSignature = communicatorController.editMessageSignature(messageSignature, signature.getName(), signature.getSignature());

    CommunicatorMessageSignatureRESTModel result = new CommunicatorMessageSignatureRESTModel(editMessageSignature.getId(), editMessageSignature.getName(), editMessageSignature.getSignature());
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path("/attachment/{ATTACHMENTNAME}")
  @RESTPermit(handling = Handling.UNSECURED)
  public Response getMessageAttachment(@PathParam ("ATTACHMENTNAME") String attachmentName, @Context Request request) {
    if(StringUtils.isBlank(attachmentName)){
      return Response.status(Response.Status.BAD_REQUEST).build();
    }
    CommunicatorMessageAttachment communicatorMessageAttachment = communicatorAttachmentController.findByName(attachmentName);
    if(communicatorMessageAttachment == null){
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    EntityTag tag = new EntityTag(communicatorMessageAttachment.getName());
    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }

    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);
    
    return Response.ok(communicatorMessageAttachment.getContent())
        .cacheControl(cacheControl)
        .tag(tag)
        .type(communicatorMessageAttachment.getContentType())
        .build();
  }
  
  private boolean hasCommunicatorMessageAccess(CommunicatorMessage communicatorMessage) {
    Long userEntityId = sessionController.getLoggedUserEntity() == null ? null : sessionController.getLoggedUserEntity().getId();
    if (userEntityId != null) {
      if (communicatorMessage.getSender() != null && communicatorMessage.getSender().equals(userEntityId)) {
        return true;
      }
      else {
        CommunicatorMessageRecipient recipient = communicatorController.findCommunicatorMessageRecipientByMessageAndRecipient(communicatorMessage, sessionController.getLoggedUserEntity());

        return recipient != null;
      }
    }
    return false;
  }

  @Transactional (value = TxType.REQUIRES_NEW)
  public void onCommunicatorMessageSent(@Observes (during = TransactionPhase.AFTER_COMPLETION) CommunicatorMessageSent event) {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(event.getCommunicatorMessageId());
    UserEntity sender = userEntityController.findUserEntityById(communicatorMessage.getSender());
    UserEntity recipient = userEntityController.findUserEntityById(event.getRecipientUserEntityId());

    if ((communicatorMessage != null) && (sender != null) && (recipient != null)) {
      if (!Objects.equals(sender.getId(), recipient.getId())) {
        Map<String, Object> params = new HashMap<String, Object>();
        User senderUser = userController.findUserByUserEntityDefaults(sender);
        params.put("sender", String.format("%s %s", senderUser.getFirstName(), senderUser.getLastName()));
        params.put("subject", communicatorMessage.getCaption());
        params.put("content", communicatorMessage.getContent());
        params.put("url", String.format("%s/communicator", baseUrl));
        //TODO Hash paramters cannot be utilized in redirect URLs
        //params.put("url", String.format("%s/communicator#inbox/%d", baseUrl, message.getCommunicatorMessageId().getId()));
        
        notifierController.sendNotification(communicatorNewInboxMessageNotification, sender, recipient, params);
      }
    } else {
      logger.log(Level.SEVERE, String.format("Communicator couldn't send notifications as some entity was not found"));
    }
  }
  
}
