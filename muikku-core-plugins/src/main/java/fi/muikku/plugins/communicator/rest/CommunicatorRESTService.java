package fi.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import edu.emory.mathcs.backport.java.util.Collections;
import fi.muikku.controller.TagController;
import fi.muikku.controller.UserController;
import fi.muikku.model.base.Tag;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.communicator.CommunicatorController;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.muikku.plugins.forum.ForumController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.AuthorizationException;
import fi.muikku.session.SessionController;
import fi.tranquil.TranquilModelEntity;
import fi.tranquil.TranquilModelType;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;
import fi.tranquil.TranquilizingContext;
import fi.tranquil.instructions.PropertyInjectInstruction.ValueGetter;
import fi.tranquil.instructions.SuperClassInstructionSelector;

@Path("/communicator")
@RequestScoped
@Stateful
@Produces ("application/json")
public class CommunicatorRESTService extends PluginRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private CommunicatorController communicatorController;

  @Inject
  private ForumController forumController;

  @Inject
  private TagController tagController;

  @GET
  @Path ("/{USERID}/items")
  public Response listUserCommunicatorItems( 
      @PathParam ("USERID") Long userId) {
    UserEntity user = userController.findUserEntity(userId); 
    List<CommunicatorMessage> receivedItems = communicatorController.listReceivedItems(user);

    Collections.sort(receivedItems, new Comparator<CommunicatorMessage>() {
      @Override
      public int compare(CommunicatorMessage o1, CommunicatorMessage o2) {
        return o2.getCreated().compareTo(o1.getCreated());
      }
    });
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(CommunicatorMessage.class, tranquilityBuilder.createPropertyInjectInstruction("messageCount", new MessageCountValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("wallEntry", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("wallEntry.replies", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("thread", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(ForumThread.class, tranquilityBuilder.createPropertyInjectInstruction("replies", new ForumThreadReplyInjector()))
//      .addInstruction(Wall.class, tranquilityBuilder.createPropertyInjectInstruction("wallName", new WallEntityNameGetter()))
//      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    Collection<TranquilModelEntity> entities = tranquility.entities(receivedItems);
    
    return Response.ok(
      entities
    ).build();
  }

  @GET
  @Path ("/{USERID}/sentitems")
  public Response listUserSentCommunicatorItems( 
      @PathParam ("USERID") Long userId) {
    UserEntity user = userController.findUserEntity(userId); 
    List<CommunicatorMessage> receivedItems = communicatorController.listSentItems(user);

    Collections.sort(receivedItems, new Comparator<CommunicatorMessage>() {
      @Override
      public int compare(CommunicatorMessage o1, CommunicatorMessage o2) {
        return o2.getCreated().compareTo(o1.getCreated());
      }
    });
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(CommunicatorMessage.class, tranquilityBuilder.createPropertyInjectInstruction("messageCount", new MessageCountValueGetter()))
      .addInstruction(CommunicatorMessage.class, tranquilityBuilder.createPropertyInjectInstruction("recipients", new CommunicatorMessageRecipientsGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("wallEntry", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("wallEntry.replies", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("thread", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(ForumThread.class, tranquilityBuilder.createPropertyInjectInstruction("replies", new ForumThreadReplyInjector()))
//      .addInstruction(Wall.class, tranquilityBuilder.createPropertyInjectInstruction("wallName", new WallEntityNameGetter()))
//      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    Collection<TranquilModelEntity> entities = tranquility.entities(receivedItems);
    
    return Response.ok(
      entities
    ).build();
  }

  @GET
  @Path ("/{USERID}/messages/{COMMUNICATORMESSAGEID}")
  public Response listUserCommunicatorMessagesByMessageId( 
      @PathParam ("USERID") Long userId,
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId) {
    UserEntity user = userController.findUserEntity(userId); 
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<CommunicatorMessage> receivedItems = communicatorController.listInboxMessagesByMessageId(user, messageId);

    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(CommunicatorMessageItem.class, tranquilityBuilder.createPropertyInjectInstruction("type", new CommunicatorItemTypeGetter()))
      .addInstruction(CommunicatorMessage.class, tranquilityBuilder.createPropertyInjectInstruction("recipients", new CommunicatorMessageRecipientsGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("wallEntry", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("wallEntry.replies", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("thread", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(ForumThread.class, tranquilityBuilder.createPropertyInjectInstruction("replies", new ForumThreadReplyInjector()))
//      .addInstruction(Wall.class, tranquilityBuilder.createPropertyInjectInstruction("wallName", new WallEntityNameGetter()))
//      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    Collection<TranquilModelEntity> entities = tranquility.entities(receivedItems);
    
    return Response.ok(
      entities
    ).build();
  }

  @DELETE
  @Path ("/{USERID}/messages/{COMMUNICATORMESSAGEID}")
  public Response deleteMessage(
      @PathParam ("USERID") Long userId,
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    UserEntity user = sessionController.getUser();
    
    CommunicatorMessageId messageId = communicatorController.findCommunicatorMessageId(communicatorMessageId);

    communicatorController.archiveMessage(user, messageId);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/{USERID}/messages")
  public Response postMessage(
      @PathParam ("USERID") Long userId,
      @FormParam ("subject") String subject,
      @FormParam ("content") String content,
      @FormParam ("recipients") List<Long> recipientIds,
      @FormParam ("tags") String tags
   ) throws AuthorizationException {
    UserEntity user = userController.findUserEntity(userId); // session?
    
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    Set<Tag> tagList = parseTags(tags);
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : recipientIds) {
      UserEntity recipient = userController.findUserEntity(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId, user, recipients, subject, content, tagList);
      
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
      
    return Response.ok(
      tranquility.entity(message)
    ).build();
  }

  private Set<Tag> parseTags(String tags) {
    List<String> tagStrs = Arrays.asList(tags.split("\\s*,\\s*"));
    Set<Tag> result = new HashSet<Tag>();
    
    for (String t : tagStrs) {
      Tag tag = tagController.findTag(t);
      
      if (tag == null)
        tag = tagController.createTag(t);
      
      result.add(tag);
    }
    
    return result;
  }

  @POST
  @Path ("/{USERID}/messages/{COMMUNICATORMESSAGEID}")
  public Response postMessageReply(
      @PathParam ("USERID") Long userId,
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
      @FormParam ("subject") String subject,
      @FormParam ("content") String content,
      @FormParam ("recipients") List<Long> recipientIds,
      @FormParam ("tags") String tags
   ) throws AuthorizationException {
    UserEntity user = userController.findUserEntity(userId); // session?
    
    CommunicatorMessageId communicatorMessageId2 = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    Set<Tag> tagList = parseTags(tags);
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : recipientIds) {
      UserEntity recipient = userController.findUserEntity(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId2, user, recipients, subject, content, tagList);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entity(message)
    ).build();
  }

  @GET
  @Path ("/{USERID}/communicatormessages/{COMMUNICATORMESSAGEID}")
  public Response getCommunicatorMessage(
      @PathParam ("USERID") Long userId,
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      tranquility.entity(communicatorMessage)
    ).build();
  }
  
  @GET
  @Path ("/{USERID}/communicatormessages/{COMMUNICATORMESSAGEID}/recipients")
  public Response listCommunicatorMessageRecipients(
      @PathParam ("USERID") Long userId,
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId
   ) throws AuthorizationException {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(communicatorMessageId);

    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(communicatorMessage);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      tranquility.entities(messageRecipients)
    ).build();
  }

  @GET
  @Path ("/userinfo/{USERID}")
  public Response getUserInfo(
      @PathParam ("USERID") Long userId
   ) throws AuthorizationException {
    UserEntity user = userController.findUserEntity(userId);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      tranquility.entity(user)
    ).build();
  }

  @GET
  @Path ("/{USERID}/templates")
  public Response listUserMessageTemplates(
      @PathParam ("USERID") Long userId
   ) throws AuthorizationException {
    UserEntity userEntity = userController.findUserEntity(userId);
    
    List<CommunicatorMessageTemplate> messageTemplates = communicatorController.listMessageTemplates(userEntity);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entities(messageTemplates)
    ).build();
  }
  
  @POST
  @Path ("/{USERID}/templates")
  public Response createUserMessageTemplate(
      @PathParam ("USERID") Long userId,
      @FormParam ("name") String name,
      @FormParam ("content") String content
   ) throws AuthorizationException {
    UserEntity userEntity = userController.findUserEntity(userId);
    
    CommunicatorMessageTemplate messageTemplate = communicatorController.createMessageTemplate(name, content, userEntity);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entity(messageTemplate)
    ).build();
  }
  
  @GET
  @Path ("/{USERID}/templates/{TEMPLATEID}")
  public Response getUserMessageTemplate(
      @PathParam ("USERID") Long userId,
      @PathParam ("TEMPLATEID") Long templateId
   ) throws AuthorizationException {
    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entity(messageTemplate)
    ).build();
  }

  @DELETE
  @Path ("/{USERID}/templates/{TEMPLATEID}")
  public Response deleteUserMessageTemplate(
      @PathParam ("USERID") Long userId,
      @PathParam ("TEMPLATEID") Long templateId
   ) throws AuthorizationException {
    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);
    communicatorController.deleteMessageTemplate(messageTemplate);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/{USERID}/templates/{TEMPLATEID}")
  public Response editUserMessageTemplate(
      @PathParam ("USERID") Long userId,
      @PathParam ("TEMPLATEID") Long templateId,
      @FormParam ("name") String name,
      @FormParam ("content") String content
   ) throws AuthorizationException {
    CommunicatorMessageTemplate messageTemplate = communicatorController.getMessageTemplate(templateId);

    CommunicatorMessageTemplate editMessageTemplate = communicatorController.editMessageTemplate(messageTemplate, name, content);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entity(editMessageTemplate)
    ).build();
  }

  @GET
  @Path ("/{USERID}/signatures")
  public Response listUserMessageSignatures(
      @PathParam ("USERID") Long userId
   ) throws AuthorizationException {
    UserEntity userEntity = userController.findUserEntity(userId);
    
    List<CommunicatorMessageSignature> messageSignatures = communicatorController.listMessageSignatures(userEntity);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entities(messageSignatures)
    ).build();
  }
  
  @POST
  @Path ("/{USERID}/signatures")
  public Response createUserMessageSignature(
      @PathParam ("USERID") Long userId,
      @FormParam ("name") String name,
      @FormParam ("signature") String signature
   ) throws AuthorizationException {
    UserEntity userEntity = userController.findUserEntity(userId);

    CommunicatorMessageSignature messageSignature = communicatorController.createMessageSignature(name, signature, userEntity);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entity(messageSignature)
    ).build();
  }
  
  @GET
  @Path ("/{USERID}/signatures/{SIGNATUREID}")
  public Response getUserMessageSignature(
      @PathParam ("USERID") Long userId,
      @PathParam ("SIGNATUREID") Long signatureId
   ) throws AuthorizationException {
    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entity(messageSignature)
    ).build();
  }

  @DELETE
  @Path ("/{USERID}/signatures/{SIGNATUREID}")
  public Response deleteUserMessageSignature(
      @PathParam ("USERID") Long userId,
      @PathParam ("SIGNATUREID") Long signatureId
   ) throws AuthorizationException {
    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);
    communicatorController.deleteMessageSignature(messageSignature);
    
    return Response.noContent().build();
  }

  @POST
  @Path ("/{USERID}/signatures/{SIGNATUREID}")
  public Response editUserMessageSignature(
      @PathParam ("USERID") Long userId,
      @PathParam ("SIGNATUREID") Long signatureId,
      @FormParam ("name") String name,
      @FormParam ("signature") String signature
   ) throws AuthorizationException {
    CommunicatorMessageSignature messageSignature = communicatorController.getMessageSignature(signatureId);
    
    CommunicatorMessageSignature editMessageSignature = communicatorController.editMessageSignature(messageSignature, name, signature);

    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entity(editMessageSignature)
    ).build();
  }

  private class UserEntityHasPictureValueGetter implements ValueGetter<Boolean> {
    @Override
    public Boolean getValue(TranquilizingContext context) {
      UserEntity user = (UserEntity) context.getEntityValue();
      return userController.getUserHasPicture(user);
    }
  }

  private class UserNameValueGetter implements ValueGetter<String> {
    @Override
    public String getValue(TranquilizingContext context) {
      UserEntity userEntity = (UserEntity) context.getEntityValue();
      User user = userController.findUser(userEntity);
      return user.getFirstName() + " " + user.getLastName();
    }
  }

  private class MessageCountValueGetter implements ValueGetter<Long> {
    @Override
    public Long getValue(TranquilizingContext context) {
      CommunicatorMessage msg = (CommunicatorMessage) context.getEntityValue();
      UserEntity user = sessionController.getUser();
      return communicatorController.countMessagesByRecipientAndMessageId(user, msg.getCommunicatorMessageId());
    }
  }

  private class CommunicatorMessageRecipientsGetter implements ValueGetter<Collection<TranquilModelEntity>> {
    @Override
    public Collection<TranquilModelEntity> getValue(TranquilizingContext context) {
      CommunicatorMessage msg = (CommunicatorMessage) context.getEntityValue();

      List<CommunicatorMessageRecipient> msgRecipients = communicatorController.listCommunicatorMessageRecipients(msg);
      List<UserEntity> recipients = new ArrayList<UserEntity>();
      
      for (CommunicatorMessageRecipient rcp : msgRecipients) {
        UserEntity userEntity = userController.findUserEntity(rcp.getRecipient());
        recipients.add(userEntity);
      }

      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
      Tranquility tranquility = tranquilityBuilder.createTranquility()
          .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
          .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
          .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
      
      return tranquility.entities(recipients);
    }
  }

}
