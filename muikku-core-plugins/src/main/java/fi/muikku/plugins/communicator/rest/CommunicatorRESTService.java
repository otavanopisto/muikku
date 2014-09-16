package fi.muikku.plugins.communicator.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import fi.muikku.plugin.PluginRESTService;

@Path("/communicator")
@RequestScoped
@Stateful
@Produces ("application/json")
public class CommunicatorRESTService extends PluginRESTService {
// FIXME: Re-enable this service
//
//  @Inject 
//  private TranquilityBuilderFactory tranquilityBuilderFactory;
//
//  @Inject
//  private SessionController sessionController;
//  
//  @Inject
//  private UserController userController;
//  
//  @Inject
//  private CommunicatorController communicatorController;
//
//  @Inject
//  private ForumController forumController;
//
//  @Inject
//  private TagController tagController;
//
//  @Inject
//  private CommunicatorNewInboxMessageNotification communicatorNewInboxMessageNotification;
//  
//  @Inject
//  private NotifierController notifierController;
//  
//  @GET
//  @Path ("/{USERID}/items")
//  public Response listUserCommunicatorItems( 
//      @PathParam ("USERID") Long userId) {
//    UserEntity user = userController.findUserEntityById(userId); 
//    List<InboxCommunicatorMessage> receivedItems = communicatorController.listReceivedItems(user);
//
//    Collections.sort(receivedItems, new Comparator<CommunicatorMessage>() {
//      @Override
//      public int compare(CommunicatorMessage o1, CommunicatorMessage o2) {
//        return o2.getCreated().compareTo(o1.getCreated());
//      }
//    });
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(CommunicatorMessage.class), tranquilityBuilder.createPropertyInjectInstruction("messageCount", new MessageCountValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
////    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
////    Tranquility tranquility = tranquilityBuilder.createTranquility()
////      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("wallEntry", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("wallEntry.replies", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("thread", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction(ForumThread.class, tranquilityBuilder.createPropertyInjectInstruction("replies", new ForumThreadReplyInjector()))
////      .addInstruction(Wall.class, tranquilityBuilder.createPropertyInjectInstruction("wallName", new WallEntityNameGetter()))
////      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
////      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
//    Collection<TranquilModelEntity> entities = tranquility.entities(receivedItems);
//    
//    return Response.ok(
//      entities
//    ).build();
//  }
//
//  @GET
//  @Path ("/{USERID}/sentitems")
//  public Response listUserSentCommunicatorItems( 
//      @PathParam ("USERID") Long userId) {
//    UserEntity user = userController.findUserEntityById(userId); 
//    List<InboxCommunicatorMessage> sentItems = communicatorController.listSentItems(user);
//
//    Collections.sort(sentItems, new Comparator<CommunicatorMessage>() {
//      @Override
//      public int compare(CommunicatorMessage o1, CommunicatorMessage o2) {
//        return o2.getCreated().compareTo(o1.getCreated());
//      }
//    });
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(CommunicatorMessage.class), tranquilityBuilder.createPropertyInjectInstruction("messageCount", new MessageCountValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(CommunicatorMessage.class), tranquilityBuilder.createPropertyInjectInstruction("recipients", new CommunicatorMessageRecipientsGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
////    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
////    Tranquility tranquility = tranquilityBuilder.createTranquility()
////      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("wallEntry", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("wallEntry.replies", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("thread", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction(ForumThread.class, tranquilityBuilder.createPropertyInjectInstruction("replies", new ForumThreadReplyInjector()))
////      .addInstruction(Wall.class, tranquilityBuilder.createPropertyInjectInstruction("wallName", new WallEntityNameGetter()))
////      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
////      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
//    Collection<TranquilModelEntity> entities = tranquility.entities(sentItems);
//    
//    return Response.ok(
//      entities
//    ).build();
//  }
//
//  @GET
//  @Path ("/{USERID}/messages/{COMMUNICATORMESSAGEID}")
//  public Response listUserCommunicatorMessagesByMessageId( 
//      @PathParam ("USERID") Long userId,
//      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
//    UserEntity user = userController.findUserEntityById(userId); 
//    
//    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
//    
//    List<InboxCommunicatorMessage> receivedItems = communicatorController.listMessagesByMessageId(user, messageId);
//
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction(CommunicatorMessageItem.class, tranquilityBuilder.createPropertyInjectInstruction("type", new CommunicatorItemTypeGetter()))
//      .addInstruction(new SuperClassInstructionSelector(CommunicatorMessage.class), tranquilityBuilder.createPropertyInjectInstruction("recipients", new CommunicatorMessageRecipientsGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
////    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
////    Tranquility tranquility = tranquilityBuilder.createTranquility()
////      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("wallEntry", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("wallEntry.replies", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction("thread", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction(ForumThread.class, tranquilityBuilder.createPropertyInjectInstruction("replies", new ForumThreadReplyInjector()))
////      .addInstruction(Wall.class, tranquilityBuilder.createPropertyInjectInstruction("wallName", new WallEntityNameGetter()))
////      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
////      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
//    Collection<TranquilModelEntity> entities = tranquility.entities(receivedItems);
//    
//    return Response.ok(
//      entities
//    ).build();
//  }
//
//  @DELETE
//  @Path ("/{USERID}/messages/{COMMUNICATORMESSAGEID}")
//  public Response deleteMessage(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
//   ) throws AuthorizationException {
//    UserEntity user = sessionController.getUser();
//    
//    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
//
//    communicatorController.archiveMessage(user, messageId);
//    
//    return Response.noContent().build();
//  }
//
//  @POST
//  @Path ("/{USERID}/messages")
//  public Response postMessage(
//      @PathParam ("USERID") Long userId,
//      @FormParam ("category") String category,
//      @FormParam ("subject") String subject,
//      @FormParam ("content") String content,
//      @FormParam ("recipients") List<Long> recipientIds,
//      @FormParam ("recipientGroups") List<Long> recipientGroupIds,
//      @FormParam ("tags") String tags
//   ) throws AuthorizationException {
//    UserEntity user = userController.findUserEntityById(userId); // session?
//    
//    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
//    
//    Set<Tag> tagList = parseTags(tags);
//    List<UserEntity> recipients = new ArrayList<UserEntity>();
//    
//    for (Long recipientId : recipientIds) {
//      UserEntity recipient = userController.findUserEntityById(recipientId);
//
//      if (recipient != null)
//        recipients.add(recipient);
//    }
//    
//    for (Long groupId : recipientGroupIds) {
//      UserGroup group = userController.findUserGroup(groupId);
//      List<UserGroupUser> groupUsers = userController.listUserGroupUsers(group);
//      
//      for (UserGroupUser gusr : groupUsers) {
//        recipients.add(gusr.getUser());
//      }
//    }
//    
//    // TODO Category not existing at this point would technically indicate an invalid state
//    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(category);
//
//    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId, user, recipients, categoryEntity, subject, content, tagList);
//      
//    notifierController.sendNotification(communicatorNewInboxMessageNotification, user, recipients);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//      
//    return Response.ok(
//      tranquility.entity(message)
//    ).build();
//  }
//
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
//
//  @POST
//  @Path ("/{USERID}/messages/{COMMUNICATORMESSAGEID}")
//  public Response postMessageReply(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
//      @FormParam ("category") String category,
//      @FormParam ("subject") String subject,
//      @FormParam ("content") String content,
//      @FormParam ("recipients") List<Long> recipientIds,
//      @FormParam ("recipientGroups") List<Long> recipientGroupIds,
//      @FormParam ("tags") String tags
//   ) throws AuthorizationException {
//    UserEntity user = userController.findUserEntityById(userId); // session?
//    
//    CommunicatorMessageId communicatorMessageId2 = communicatorController.findCommunicatorMessageId(communicatorMessageId);
//    
//    Set<Tag> tagList = parseTags(tags);
//    List<UserEntity> recipients = new ArrayList<UserEntity>();
//    
//    for (Long recipientId : recipientIds) {
//      UserEntity recipient = userController.findUserEntityById(recipientId);
//
//      if (recipient != null)
//        recipients.add(recipient);
//    }
//    
//    for (Long groupId : recipientGroupIds) {
//      UserGroup group = userController.findUserGroup(groupId);
//      List<UserGroupUser> groupUsers = userController.listUserGroupUsers(group);
//      
//      for (UserGroupUser gusr : groupUsers) {
//        recipients.add(gusr.getUser());
//      }
//    }
//
//    // TODO Category not existing at this point would technically indicate an invalid state
//    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(category);
//    
//    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId2, user, recipients, categoryEntity, subject, content, tagList);
//
//    notifierController.sendNotification(communicatorNewInboxMessageNotification, user, recipients);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entity(message)
//    ).build();
//  }
//
//  @GET
//  @Path ("/{USERID}/communicatormessages/{COMMUNICATORMESSAGEID}")
//  public Response getCommunicatorMessage(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
//   ) throws AuthorizationException {
//    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);
//
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
//    return Response.ok(
//      tranquility.entity(communicatorMessage)
//    ).build();
//  }
//  
//  @GET
//  @Path ("/{USERID}/communicatormessages/{COMMUNICATORMESSAGEID}/recipients")
//  public Response listCommunicatorMessageRecipients(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
//   ) throws AuthorizationException {
//    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);
//
//    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(communicatorMessage);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
//    return Response.ok(
//      tranquility.entities(messageRecipients)
//    ).build();
//  }
//
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
//
//  @GET
//  @Path ("/{USERID}/templates")
//  public Response listUserMessageTemplates(
//      @PathParam ("USERID") Long userId
//   ) throws AuthorizationException {
//    UserEntity userEntity = userController.findUserEntityById(userId);
//    
//    List<CommunicatorMessageTemplate> messageTemplates = communicatorController.listMessageTemplates(userEntity);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entities(messageTemplates)
//    ).build();
//  }
//  
//  @POST
//  @Path ("/{USERID}/templates")
//  public Response createUserMessageTemplate(
//      @PathParam ("USERID") Long userId,
//      @FormParam ("name") String name,
//      @FormParam ("content") String content
//   ) throws AuthorizationException {
//    UserEntity userEntity = userController.findUserEntityById(userId);
//    
//    CommunicatorMessageTemplate messageTemplate = communicatorController.createMessageTemplate(name, content, userEntity);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entity(messageTemplate)
//    ).build();
//  }
//  
//  @GET
//  @Path ("/{USERID}/templates/{TEMPLATEID}")
//  public Response getUserMessageTemplate(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("TEMPLATEID") Long templateId
//   ) throws AuthorizationException {
//    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entity(messageTemplate)
//    ).build();
//  }
//
//  @DELETE
//  @Path ("/{USERID}/templates/{TEMPLATEID}")
//  public Response deleteUserMessageTemplate(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("TEMPLATEID") Long templateId
//   ) throws AuthorizationException {
//    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);
//    communicatorController.deleteMessageTemplate(messageTemplate);
//    
//    return Response.noContent().build();
//  }
//
//  @POST
//  @Path ("/{USERID}/templates/{TEMPLATEID}")
//  public Response editUserMessageTemplate(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("TEMPLATEID") Long templateId,
//      @FormParam ("name") String name,
//      @FormParam ("content") String content
//   ) throws AuthorizationException {
//    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);
//
//    CommunicatorMessageTemplate editMessageTemplate = communicatorController.editMessageTemplate(messageTemplate, name, content);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entity(editMessageTemplate)
//    ).build();
//  }
//
//  @GET
//  @Path ("/{USERID}/signatures")
//  public Response listUserMessageSignatures(
//      @PathParam ("USERID") Long userId
//   ) throws AuthorizationException {
//    UserEntity userEntity = userController.findUserEntityById(userId);
//    
//    List<CommunicatorMessageSignature> messageSignatures = communicatorController.listMessageSignatures(userEntity);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entities(messageSignatures)
//    ).build();
//  }
//  
//  @POST
//  @Path ("/{USERID}/signatures")
//  public Response createUserMessageSignature(
//      @PathParam ("USERID") Long userId,
//      @FormParam ("name") String name,
//      @FormParam ("signature") String signature
//   ) throws AuthorizationException {
//    UserEntity userEntity = userController.findUserEntityById(userId);
//
//    CommunicatorMessageSignature messageSignature = communicatorController.createMessageSignature(name, signature, userEntity);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entity(messageSignature)
//    ).build();
//  }
//  
//  @GET
//  @Path ("/{USERID}/signatures/{SIGNATUREID}")
//  public Response getUserMessageSignature(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("SIGNATUREID") Long signatureId
//   ) throws AuthorizationException {
//    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entity(messageSignature)
//    ).build();
//  }
//
//  @DELETE
//  @Path ("/{USERID}/signatures/{SIGNATUREID}")
//  public Response deleteUserMessageSignature(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("SIGNATUREID") Long signatureId
//   ) throws AuthorizationException {
//    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);
//    communicatorController.deleteMessageSignature(messageSignature);
//    
//    return Response.noContent().build();
//  }
//
//  @POST
//  @Path ("/{USERID}/signatures/{SIGNATUREID}")
//  public Response editUserMessageSignature(
//      @PathParam ("USERID") Long userId,
//      @PathParam ("SIGNATUREID") Long signatureId,
//      @FormParam ("name") String name,
//      @FormParam ("signature") String signature
//   ) throws AuthorizationException {
//    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);
//    
//    CommunicatorMessageSignature editMessageSignature = communicatorController.editMessageSignature(messageSignature, name, signature);
//
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entity(editMessageSignature)
//    ).build();
//  }
//
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
