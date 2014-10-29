package fi.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

import fi.muikku.controller.TagController;
import fi.muikku.model.base.Tag;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroup;
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.notifier.NotifierController;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.communicator.CommunicatorController;
import fi.muikku.plugins.communicator.CommunicatorNewInboxMessageNotification;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.muikku.plugins.communicator.model.InboxCommunicatorMessage;
import fi.muikku.schooldata.UserController;
import fi.muikku.security.AuthorizationException;
import fi.muikku.session.SessionController;

@Path("/communicator")
@RequestScoped
@Stateful
@Produces ("application/json")
public class CommunicatorRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8910816437728659987L;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private CommunicatorController communicatorController;

//  @Inject
//  private ForumController forumController;

  @Inject
  private TagController tagController;

  @Inject
  private CommunicatorNewInboxMessageNotification communicatorNewInboxMessageNotification;
  
  @Inject
  private NotifierController notifierController;
  
  @GET
  @Path ("/items")
  public Response listUserCommunicatorItems() {
    UserEntity user = sessionController.getUser(); 
    List<InboxCommunicatorMessage> receivedItems = communicatorController.listReceivedItems(user);

    Collections.sort(receivedItems, new Comparator<CommunicatorMessage>() {
      @Override
      public int compare(CommunicatorMessage o1, CommunicatorMessage o2) {
        return o2.getCreated().compareTo(o1.getCreated());
      }
    });
    
    List<CommunicatorMessageRESTModel> result = new ArrayList<CommunicatorMessageRESTModel>();
    
    for (InboxCommunicatorMessage msg : receivedItems) {
      String categoryName = msg.getCategory() != null ? msg.getCategory().getName() : null;

      result.add(new CommunicatorMessageRESTModel(
          msg.getId(), msg.getCommunicatorMessageId().getId(), msg.getSender(), categoryName, 
          msg.getCaption(), msg.getContent(), msg.getCreated(), tagIdsToStr(msg.getTags())));
    }
    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(CommunicatorMessage.class), tranquilityBuilder.createPropertyInjectInstruction("messageCount", new MessageCountValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      result
    ).build();
  }

  @GET
  @Path ("/sentitems")
  public Response listUserSentCommunicatorItems() {
    UserEntity user = sessionController.getUser(); 
    List<InboxCommunicatorMessage> sentItems = communicatorController.listSentItems(user);

    Collections.sort(sentItems, new Comparator<CommunicatorMessage>() {
      @Override
      public int compare(CommunicatorMessage o1, CommunicatorMessage o2) {
        return o2.getCreated().compareTo(o1.getCreated());
      }
    });

    List<CommunicatorMessageRESTModel> result = new ArrayList<CommunicatorMessageRESTModel>();
    
    for (InboxCommunicatorMessage msg : sentItems) {
      String categoryName = msg.getCategory() != null ? msg.getCategory().getName() : null;
      
      result.add(new CommunicatorMessageRESTModel(
          msg.getId(), msg.getCommunicatorMessageId().getId(), msg.getSender(), categoryName, 
          msg.getCaption(), msg.getContent(), msg.getCreated(), tagIdsToStr(msg.getTags())));
    }
    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(CommunicatorMessage.class), tranquilityBuilder.createPropertyInjectInstruction("messageCount", new MessageCountValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(CommunicatorMessage.class), tranquilityBuilder.createPropertyInjectInstruction("recipients", new CommunicatorMessageRecipientsGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      result
    ).build();
  }

  @GET
  @Path ("/messages/{COMMUNICATORMESSAGEID}")
  public Response listUserCommunicatorMessagesByMessageId( 
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = sessionController.getUser(); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<InboxCommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(user, messageId);

    List<CommunicatorMessageRESTModel> result = new ArrayList<CommunicatorMessageRESTModel>();
    
    for (InboxCommunicatorMessage msg : receivedItems) {
      String categoryName = msg.getCategory() != null ? msg.getCategory().getName() : null;
      
      result.add(new CommunicatorMessageRESTModel(
          msg.getId(), msg.getCommunicatorMessageId().getId(), msg.getSender(), categoryName, 
          msg.getCaption(), msg.getContent(), msg.getCreated(), tagIdsToStr(msg.getTags())));
    }
    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction(CommunicatorMessageItem.class, tranquilityBuilder.createPropertyInjectInstruction("type", new CommunicatorItemTypeGetter()))
//      .addInstruction(new SuperClassInstructionSelector(CommunicatorMessage.class), tranquilityBuilder.createPropertyInjectInstruction("recipients", new CommunicatorMessageRecipientsGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      result
    ).build();
  }

  @DELETE
  @Path ("/messages/{COMMUNICATORMESSAGEID}")
  public Response deleteMessage(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    UserEntity user = sessionController.getUser();
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    communicatorController.archiveMessage(user, messageId);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/messages")
  public Response postMessage(
      CommunicatorMessageRESTModel newMessage,
      List<Long> recipientIds,
      List<Long> recipientGroupIds
   ) throws AuthorizationException {
    UserEntity user = sessionController.getUser();
    
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    Set<Tag> tagList = parseTags(newMessage.getTags());
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : recipientIds) {
      UserEntity recipient = userController.findUserEntityById(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    for (Long groupId : recipientGroupIds) {
      UserGroup group = userController.findUserGroup(groupId);
      List<UserGroupUser> groupUsers = userController.listUserGroupUsers(group);
      
      for (UserGroupUser gusr : groupUsers) {
        recipients.add(gusr.getUser());
      }
    }
    
    // TODO Category not existing at this point would technically indicate an invalid state
    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(newMessage.getCategoryName());

    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId, user, recipients, categoryEntity, 
        newMessage.getCaption(), newMessage.getContent(), tagList);
      
    notifierController.sendNotification(communicatorNewInboxMessageNotification, user, recipients);
    
    CommunicatorMessageRESTModel result = new CommunicatorMessageRESTModel(message.getId(), message.getCommunicatorMessageId().getId(), 
        message.getSender(), message.getCategory().getName(), message.getCaption(), message.getContent(), message.getCreated(), tagIdsToStr(message.getTags()));
    
    return Response.ok(
      result
    ).build();
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
  public Response postMessageReply(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
      CommunicatorMessageRESTModel newMessage,
      List<Long> recipientIds,
      List<Long> recipientGroupIds
//      @FormParam ("category") String category,
//      @FormParam ("subject") String subject,
//      @FormParam ("content") String content,
//      @FormParam ("recipients") List<Long> recipientIds,
//      @FormParam ("recipientGroups") List<Long> recipientGroupIds,
//      @FormParam ("tags") String tags
   ) throws AuthorizationException {
    UserEntity user = sessionController.getUser();
    
    CommunicatorMessageId communicatorMessageId2 = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    Set<Tag> tagList = parseTags(newMessage.getTags());
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : recipientIds) {
      UserEntity recipient = userController.findUserEntityById(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    for (Long groupId : recipientGroupIds) {
      UserGroup group = userController.findUserGroup(groupId);
      List<UserGroupUser> groupUsers = userController.listUserGroupUsers(group);
      
      for (UserGroupUser gusr : groupUsers) {
        recipients.add(gusr.getUser());
      }
    }

    // TODO Category not existing at this point would technically indicate an invalid state
    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(newMessage.getCategoryName());
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId2, user, 
        recipients, categoryEntity, newMessage.getCaption(), newMessage.getContent(), tagList);

    notifierController.sendNotification(communicatorNewInboxMessageNotification, user, recipients);
    
    CommunicatorMessageRESTModel result = new CommunicatorMessageRESTModel(message.getId(), message.getCommunicatorMessageId().getId(), 
        message.getSender(), message.getCategory().getName(), message.getCaption(), message.getContent(), message.getCreated(), 
        tagIdsToStr(message.getTags()));
    
    return Response.ok(
      result
    ).build();
  }

  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}")
  public Response getCommunicatorMessage(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    CommunicatorMessage msg = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    String categoryName = msg.getCategory() != null ? msg.getCategory().getName() : null;
    
    CommunicatorMessageRESTModel result = new CommunicatorMessageRESTModel(
        msg.getId(), msg.getCommunicatorMessageId().getId(), msg.getSender(), categoryName, 
        msg.getCaption(), msg.getContent(), msg.getCreated(), tagIdsToStr(msg.getTags()));
    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/communicatormessages/{COMMUNICATORMESSAGEID}/recipients")
  public Response listCommunicatorMessageRecipients(
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(communicatorMessage);
    
    List<CommunicatorMessageRecipientRESTModel> result = new ArrayList<CommunicatorMessageRecipientRESTModel>();
    
    for (CommunicatorMessageRecipient recipient : messageRecipients) {
      result.add(new CommunicatorMessageRecipientRESTModel(recipient.getId(), recipient.getCommunicatorMessage().getId(), recipient.getRecipient()));
    }
    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      result
    ).build();
  }

//  @GET
//  @Path ("/userinfo/{USERID}")
//  public Response getUserInfo(
//      @PathParam ("USERID") Long userId
//   ) throws AuthorizationException {
//    UserEntity user = userController.findUserEntityById(userId);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
//    return Response.ok(
//      tranquility.entity(user)
//    ).build();
//  }

  @GET
  @Path ("/templates")
  public Response listUserMessageTemplates() throws AuthorizationException {
    UserEntity userEntity = sessionController.getUser();
    
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
  public Response createUserMessageTemplate(CommunicatorMessageTemplateRESTModel template) throws AuthorizationException {
    UserEntity userEntity = sessionController.getUser();
    
    CommunicatorMessageTemplate messageTemplate = communicatorController.createMessageTemplate(template.getName(), template.getContent(), userEntity);

    CommunicatorMessageTemplateRESTModel result = new CommunicatorMessageTemplateRESTModel(messageTemplate.getId(), messageTemplate.getName(), messageTemplate.getContent());
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/templates/{TEMPLATEID}")
  public Response getUserMessageTemplate(
      @PathParam ("TEMPLATEID") Long templateId
   ) throws AuthorizationException {
    CommunicatorMessageTemplate template = communicatorController.getMessageTemplate(templateId);
    
    CommunicatorMessageTemplateRESTModel result = new CommunicatorMessageTemplateRESTModel(template.getId(), template.getName(), template.getContent());
    
    return Response.ok(
      result
    ).build();
  }

  @DELETE
  @Path ("/templates/{TEMPLATEID}")
  public Response deleteUserMessageTemplate(
      @PathParam ("TEMPLATEID") Long templateId
   ) throws AuthorizationException {
    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);
    communicatorController.deleteMessageTemplate(messageTemplate);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/templates/{TEMPLATEID}")
  public Response editUserMessageTemplate(
      @PathParam ("TEMPLATEID") Long templateId,
      CommunicatorMessageTemplateRESTModel template
   ) throws AuthorizationException {
    if (!template.getId().equals(templateId)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Id is immutable").build();
    }

    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);

    CommunicatorMessageTemplate editMessageTemplate = communicatorController.editMessageTemplate(messageTemplate, template.getName(), template.getContent());

    CommunicatorMessageTemplateRESTModel result = new CommunicatorMessageTemplateRESTModel(editMessageTemplate.getId(), editMessageTemplate.getName(), editMessageTemplate.getContent());
    
    return Response.ok(
      result
    ).build();
  }

  @GET
  @Path ("/signatures")
  public Response listUserMessageSignatures() throws AuthorizationException {
    UserEntity userEntity = sessionController.getUser();
    
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
  public Response createUserMessageSignature(CommunicatorMessageSignatureRESTModel newSignature) throws AuthorizationException {
    UserEntity userEntity = sessionController.getUser();

    CommunicatorMessageSignature messageSignature = communicatorController.createMessageSignature(newSignature.getName(), newSignature.getSignature(), userEntity);

    CommunicatorMessageSignatureRESTModel result = new CommunicatorMessageSignatureRESTModel(messageSignature.getId(), messageSignature.getName(), messageSignature.getSignature()); 
    
    return Response.ok(
      result
    ).build();
  }
  
  @GET
  @Path ("/signatures/{SIGNATUREID}")
  public Response getUserMessageSignature(
      @PathParam ("SIGNATUREID") Long signatureId
   ) throws AuthorizationException {
    CommunicatorMessageSignature signature = communicatorController.getMessageSignature(signatureId);
    
    CommunicatorMessageSignatureRESTModel result = new CommunicatorMessageSignatureRESTModel(signature.getId(), signature.getName(), signature.getSignature());
    
    return Response.ok(
      result
    ).build();
  }

  @DELETE
  @Path ("/signatures/{SIGNATUREID}")
  public Response deleteUserMessageSignature(
      @PathParam ("SIGNATUREID") Long signatureId
   ) throws AuthorizationException {
    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);
    communicatorController.deleteMessageSignature(messageSignature);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/signatures/{SIGNATUREID}")
  public Response editUserMessageSignature(
      @PathParam ("SIGNATUREID") Long signatureId,
      CommunicatorMessageSignatureRESTModel signature
   ) throws AuthorizationException {
    if (!signature.getId().equals(signatureId)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Id is immutable").build();
    }

    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);
    
    CommunicatorMessageSignature editMessageSignature = communicatorController.editMessageSignature(messageSignature, signature.getName(), signature.getSignature());

    CommunicatorMessageSignatureRESTModel result = new CommunicatorMessageSignatureRESTModel(editMessageSignature.getId(), editMessageSignature.getName(), editMessageSignature.getSignature());
    
    return Response.ok(
      result
    ).build();
  }

//  private class UserEntityHasPictureValueGetter implements ValueGetter<Boolean> {
//    @Override
//    public Boolean getValue(TranquilizingContext context) {
//      UserEntity user = (UserEntity) context.getEntityValue();
//      return userController.hasPicture(user);
//    }
//  }
//
//  private class UserNameValueGetter implements ValueGetter<String> {
//    @Override
//    public String getValue(TranquilizingContext context) {
//      UserEntity userEntity = (UserEntity) context.getEntityValue();
//      User user = userController.findUser(userEntity);
//      return user.getFirstName() + " " + user.getLastName();
//    }
//  }
//
//  private class MessageCountValueGetter implements ValueGetter<Long> {
//    @Override
//    public Long getValue(TranquilizingContext context) {
//      CommunicatorMessage msg = (CommunicatorMessage) context.getEntityValue();
//      UserEntity user = sessionController.getUser();
//      return communicatorController.countMessagesByRecipientAndMessageId(user, msg.getCommunicatorMessageId());
//    }
//  }
//
//  private class CommunicatorMessageRecipientsGetter implements ValueGetter<Collection<TranquilModelEntity>> {
//    @Override
//    public Collection<TranquilModelEntity> getValue(TranquilizingContext context) {
//      CommunicatorMessage msg = (CommunicatorMessage) context.getEntityValue();
//
//      List<CommunicatorMessageRecipient> msgRecipients = communicatorController.listCommunicatorMessageRecipients(msg);
//      List<UserEntity> recipients = new ArrayList<UserEntity>();
//      
//      for (CommunicatorMessageRecipient rcp : msgRecipients) {
//        UserEntity userEntity = userController.findUserEntityById(rcp.getRecipient());
//        recipients.add(userEntity);
//      }
//
//      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//      Tranquility tranquility = tranquilityBuilder.createTranquility()
//          .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//          .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//          .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//      
//      return tranquility.entities(recipients);
//    }
//  }

}
