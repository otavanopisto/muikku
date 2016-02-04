package fi.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
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
import javax.ws.rs.core.Response.Status;

import fi.muikku.controller.TagController;
import fi.muikku.model.base.Tag;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupUserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.notifier.NotifierController;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.communicator.CommunicatorController;
import fi.muikku.plugins.communicator.CommunicatorNewInboxMessageNotification;
import fi.muikku.plugins.communicator.CommunicatorPermissionCollection;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.muikku.plugins.communicator.model.InboxCommunicatorMessage;
import fi.muikku.plugins.websocket.WebSocketMessenger;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupEntityController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.AuthorizationException;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/communicator")
@RequestScoped
@Stateful
@Produces ("application/json")
public class CommunicatorRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8910816437728659987L;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private CommunicatorController communicatorController;
  
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
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;

  @GET
  @Path ("/items")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserCommunicatorItems(
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    List<InboxCommunicatorMessage> receivedItems = communicatorController.listReceivedItems(user);

    List<CommunicatorMessageItemRESTModel> result = new ArrayList<CommunicatorMessageItemRESTModel>();
    
    for (InboxCommunicatorMessage msg : receivedItems) {
      String categoryName = msg.getCategory() != null ? msg.getCategory().getName() : null;
      boolean hasUnreadMsgs = false;
      Date latestMessageDate = msg.getCreated();
      
      List<CommunicatorMessageRecipient> recipients = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(
          user, msg.getCommunicatorMessageId());
      
      for (CommunicatorMessageRecipient r : recipients) {
        if (Boolean.FALSE.equals(r.getReadByReceiver())) {
          hasUnreadMsgs = true;
          break;
        }
        
        Date created = r.getCommunicatorMessage().getCreated();
        
        if ((latestMessageDate == null) || (latestMessageDate.before(created)))
          latestMessageDate = created;
      }
      
      result.add(new CommunicatorMessageItemRESTModel(
          msg.getId(), msg.getCommunicatorMessageId().getId(), msg.getSender(), categoryName, 
          msg.getCaption(), msg.getContent(), msg.getCreated(), tagIdsToStr(msg.getTags()), 
          getMessageRecipientIdList(msg), hasUnreadMsgs, latestMessageDate));
    }
    
    Collections.sort(result, new Comparator<CommunicatorMessageItemRESTModel>() {
      @Override
      public int compare(CommunicatorMessageItemRESTModel o1, CommunicatorMessageItemRESTModel o2) {
        return o2.getThreadLatestMessageDate().compareTo(o1.getThreadLatestMessageDate());
      }
    });
    
    result = result.subList(firstResult, Math.min(firstResult + maxResults, result.size()));
    
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

    communicatorController.archiveReceivedMessages(user, messageId);
    
    return Response.noContent().build();
  }

  @GET
  @Path ("/sentitems")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserSentCommunicatorItems(
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    List<InboxCommunicatorMessage> sentItems = communicatorController.listSentItems(user, firstResult, maxResults);

    List<CommunicatorMessageRESTModel> result = new ArrayList<CommunicatorMessageRESTModel>();
    
    for (InboxCommunicatorMessage msg : sentItems) {
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
  @Path ("/sentitems/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteSentMessages(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    UserEntity user = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    communicatorController.archiveSentMessages(user, messageId);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path ("/receiveditemscount")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getReceivedItemsCount() {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    List<CommunicatorMessageRecipient> receivedItems = communicatorController.listReceivedItemsByUserAndRead(user, false);

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
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<InboxCommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(user, messageId);

    List<CommunicatorMessageRESTModel> result = new ArrayList<CommunicatorMessageRESTModel>();
    
    for (InboxCommunicatorMessage msg : receivedItems) {
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
  @Path ("/messages/{COMMUNICATORMESSAGEID}/messagecount")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getCommunicatorMessageMessageCount( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    Long result = communicatorController.countMessagesByRecipientAndMessageId(user, messageId);
    
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
    UserEntity user = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    Set<Tag> tagList = parseTags(newMessage.getTags());
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : newMessage.getRecipientIds()) {
      UserEntity recipient = userEntityController.findUserEntityById(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    // TODO: Duplicates
    
    if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_GROUP_MESSAGING, null)) {
      for (Long groupId : newMessage.getRecipientGroupIds()) {
        UserGroupEntity group = userGroupEntityController.findUserGroupEntityById(groupId);
        List<UserGroupUserEntity> groupUsers = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(group);
        
        for (UserGroupUserEntity groupUser : groupUsers) {
          UserSchoolDataIdentifier userSchoolDataIdentifier = groupUser.getUserSchoolDataIdentifier();
          UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(userSchoolDataIdentifier.getDataSource(), userSchoolDataIdentifier.getIdentifier());
          
          recipients.add(userEntity);
        }
      }
    } else {
      // Trying to feed group ids when you don't have permission greets you with bad request
      if (!newMessage.getRecipientGroupIds().isEmpty())
        return Response.status(Status.BAD_REQUEST).build();
    }

    // Workspace members

    for (Long workspaceId : newMessage.getRecipientStudentsWorkspaceIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);

      if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity)) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(
            workspaceEntity, WorkspaceRoleArchetype.STUDENT);
        
        for (WorkspaceUserEntity wosu : workspaceUsers) {
          recipients.add(wosu.getUserSchoolDataIdentifier().getUserEntity());
        }
      } else
        return Response.status(Status.BAD_REQUEST).build();
    }      

    for (Long workspaceId : newMessage.getRecipientTeachersWorkspaceIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);

      if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity)) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(
            workspaceEntity, WorkspaceRoleArchetype.TEACHER);
        
        for (WorkspaceUserEntity wosu : workspaceUsers) {
          recipients.add(wosu.getUserSchoolDataIdentifier().getUserEntity());
        }
      } else
        return Response.status(Status.BAD_REQUEST).build();
    }      
    
    // TODO Category not existing at this point would technically indicate an invalid state
    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(newMessage.getCategoryName());
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId, user, recipients, categoryEntity, 
        newMessage.getCaption(), newMessage.getContent(), tagList);
      
    notifierController.sendNotification(communicatorNewInboxMessageNotification, user, recipients);
    webSocketMessenger.sendMessage2("Communicator:newmessagereceived", null, recipients);
    
    CommunicatorMessageRESTModel result = new CommunicatorMessageRESTModel(message.getId(), message.getCommunicatorMessageId().getId(), 
        message.getSender(), message.getCategory().getName(), message.getCaption(), message.getContent(), message.getCreated(), 
        tagIdsToStr(message.getTags()), getMessageRecipientIdList(message));
    
    return Response.ok(
      result
    ).build();
  }

  @POST
  @Path ("/messages/{COMMUNICATORMESSAGEID}/markasread")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response markAsRead( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getLoggedUserEntity(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    List<CommunicatorMessageRecipient> list = communicatorController.listCommunicatorMessageRecipientsByUserAndMessage(user, messageId);
    
    for (CommunicatorMessageRecipient r : list) {
      communicatorController.updateRead(r, true);
    }
    
    return Response.ok(
      
    ).build();
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
  
//  private Set<Tag> parseTags(String tags) {
//    Set<Tag> result = new HashSet<Tag>();
//    
//    if (tags != null) {
//      List<String> tagStrs = Arrays.asList(tags.split("\\s*,\\s*"));
//      for (String t : tagStrs) {
//        Tag tag = tagController.findTag(t);
//        
//        if (tag == null)
//          tag = tagController.createTag(t);
//        
//        result.add(tag);
//      }
//    }
//    
//    return result;
//  }

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
    UserEntity user = sessionController.getLoggedUserEntity();
    
    CommunicatorMessageId communicatorMessageId2 = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    Set<Tag> tagList = parseTags(newMessage.getTags());
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : newMessage.getRecipientIds()) {
      UserEntity recipient = userEntityController.findUserEntityById(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_GROUP_MESSAGING, null)) {
      for (Long groupId : newMessage.getRecipientGroupIds()) {
        UserGroupEntity group = userGroupEntityController.findUserGroupEntityById(groupId);
        List<UserGroupUserEntity> groupUsers = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(group);
        
        for (UserGroupUserEntity groupUser : groupUsers) {
          UserSchoolDataIdentifier userSchoolDataIdentifier = groupUser.getUserSchoolDataIdentifier();
          UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(userSchoolDataIdentifier.getDataSource(), userSchoolDataIdentifier.getIdentifier());
          
          recipients.add(userEntity);
        }
      }
    } else {
      // Trying to feed group ids when you don't have permission greets you with bad request
      if (!newMessage.getRecipientGroupIds().isEmpty())
        return Response.status(Status.BAD_REQUEST).build();
    }
      
    // Workspace members

    for (Long workspaceId : newMessage.getRecipientStudentsWorkspaceIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);

      if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity)) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(
            workspaceEntity, WorkspaceRoleArchetype.STUDENT);
        
        for (WorkspaceUserEntity wosu : workspaceUsers) {
          recipients.add(wosu.getUserSchoolDataIdentifier().getUserEntity());
        }
      } else
        return Response.status(Status.BAD_REQUEST).build();
    }      

    for (Long workspaceId : newMessage.getRecipientTeachersWorkspaceIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);

      if (sessionController.hasPermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity)) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(
            workspaceEntity, WorkspaceRoleArchetype.TEACHER);
        
        for (WorkspaceUserEntity wosu : workspaceUsers) {
          recipients.add(wosu.getUserSchoolDataIdentifier().getUserEntity());
        }
      } else
        return Response.status(Status.BAD_REQUEST).build();
    }      
    
    // TODO Category not existing at this point would technically indicate an invalid state
    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(newMessage.getCategoryName());
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId2, user, 
        recipients, categoryEntity, newMessage.getCaption(), newMessage.getContent(), tagList);

    notifierController.sendNotification(communicatorNewInboxMessageNotification, user, recipients);
    webSocketMessenger.sendMessage2("Communicator:newmessagereceived", null, recipients);
    
    CommunicatorMessageRESTModel result = new CommunicatorMessageRESTModel(message.getId(), message.getCommunicatorMessageId().getId(), 
        message.getSender(), message.getCategory().getName(), message.getCaption(), message.getContent(), message.getCreated(), 
        tagIdsToStr(message.getTags()), getMessageRecipientIdList(message));
    
    return Response.ok(
      result
    ).build();
  }

  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getCommunicatorMessage(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    CommunicatorMessage msg = communicatorController.findCommunicatorMessageById(communicatorMessageId);
    
    if (!sessionController.hasPermission(CommunicatorPermissionCollection.READ_MESSAGE, msg)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    String categoryName = msg.getCategory() != null ? msg.getCategory().getName() : null;
    
    CommunicatorMessageRESTModel result = new CommunicatorMessageRESTModel(
        msg.getId(), msg.getCommunicatorMessageId().getId(), msg.getSender(), categoryName, 
        msg.getCaption(), msg.getContent(), msg.getCreated(), tagIdsToStr(msg.getTags()), getMessageRecipientIdList(msg));
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}/recipients")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listCommunicatorMessageRecipients(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.READ_MESSAGE, communicatorMessage)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(communicatorMessage);
    
    List<CommunicatorMessageRecipientRESTModel> result = new ArrayList<CommunicatorMessageRecipientRESTModel>();
    
    for (CommunicatorMessageRecipient recipient : messageRecipients) {
      result.add(new CommunicatorMessageRecipientRESTModel(recipient.getId(), recipient.getCommunicatorMessage().getId(), recipient.getRecipient()));
    }
    
    return Response.ok(
      result
    ).build();
  }

  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}/recipients/{RECIPIENTID}/info")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listCommunicatorMessageRecipients(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
      @PathParam ("RECIPIENTID") Long recipientId
   ) throws AuthorizationException {
    CommunicatorMessageRecipient recipient = communicatorController.findCommunicatorMessageRecipient(recipientId);

    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.READ_MESSAGE, communicatorMessage)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserEntity userEntity = userEntityController.findUserEntityById(recipient.getRecipient());
      fi.muikku.schooldata.entity.User user = userController.findUserByUserEntityDefaults(userEntity);
      Boolean hasPicture = false; // TODO: userController.hasPicture(userEntity);
      
      fi.muikku.rest.model.UserBasicInfo result = new fi.muikku.rest.model.UserBasicInfo(
          userEntity.getId(), 
          user.getFirstName(), 
          user.getLastName(), 
          user.getStudyProgrammeName(),
          hasPicture,
          user.hasEvaluationFees());
      
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
  public Response getCommunicatorMessageSenderInfo(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    if (!sessionController.hasPermission(CommunicatorPermissionCollection.READ_MESSAGE, communicatorMessage)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserEntity userEntity = userEntityController.findUserEntityById(communicatorMessage.getSender());
      fi.muikku.schooldata.entity.User user = userController.findUserByUserEntityDefaults(userEntity);
      Boolean hasPicture = false; // TODO: userController.hasPicture(userEntity);
      
      fi.muikku.rest.model.UserBasicInfo result = new fi.muikku.rest.model.UserBasicInfo(
          userEntity.getId(), 
          user.getFirstName(), 
          user.getLastName(), 
          user.getStudyProgrammeName(),
          hasPicture,
          user.hasEvaluationFees());
    
      return Response.ok(
        result
      ).build();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
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
  public Response getUserMessageTemplate(
      @PathParam ("TEMPLATEID") Long templateId
   ) throws AuthorizationException {
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
  public Response deleteUserMessageTemplate(
      @PathParam ("TEMPLATEID") Long templateId
   ) throws AuthorizationException {
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
  public Response editUserMessageTemplate(
      @PathParam ("TEMPLATEID") Long templateId,
      CommunicatorMessageTemplateRESTModel template
   ) throws AuthorizationException {
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

}
