package fi.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.controller.ForumController;
import fi.muikku.controller.UserController;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.communicator.CommunicatorController;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
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

  @GET
  @Path ("/{USERID}/items")
  public Response listUserCommunicatorItems( 
      @PathParam ("USERID") Long userId) {
    UserEntity user = userController.findUserEntity(userId); 
    System.out.println(Thread.currentThread().getContextClassLoader().toString());
    List<CommunicatorMessage> receivedItems = communicatorController.listReceivedItems(user);

    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(CommunicatorMessage.class, tranquilityBuilder.createPropertyInjectInstruction("replyCount", new ReplyCountValueGetter()))
      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
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
      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
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

  @POST
  @Path ("/{USERID}/messages")
  public Response postMessage(
      @PathParam ("USERID") Long userId,
      @FormParam ("subject") String subject,
      @FormParam ("content") String content,
      @FormParam ("recipients") List<Long> recipientIds
   ) throws AuthorizationException {
    UserEntity user = userController.findUserEntity(userId); // session?
    
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : recipientIds) {
      UserEntity recipient = userController.findUserEntity(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId, user, recipients, subject, content);
      
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
      
    return Response.ok(
      tranquility.entity(message)
    ).build();
  }

  @POST
  @Path ("/{USERID}/messages/{COMMUNICATORMESSAGEID}")
  public Response postMessageReply(
      @PathParam ("USERID") Long userId,
      @PathParam ("COMMUNICATORMESSAGEID") Long communicatorMessageId,
      @FormParam ("subject") String subject,
      @FormParam ("content") String content,
      @FormParam ("recipients") List<Long> recipientIds
   ) throws AuthorizationException {
    UserEntity user = userController.findUserEntity(userId); // session?
    
    CommunicatorMessageId communicatorMessageId2 = communicatorController.findCommunicatorMessageId(communicatorMessageId);
    
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    for (Long recipientId : recipientIds) {
      UserEntity recipient = userController.findUserEntity(recipientId);

      if (recipient != null)
        recipients.add(recipient);
    }
    
    CommunicatorMessage message = communicatorController.createMessage(communicatorMessageId2, user, recipients, subject, content);
    
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
      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
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
      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      tranquility.entities(messageRecipients)
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

  private class ReplyCountValueGetter implements ValueGetter<Long> {
    @Override
    public Long getValue(TranquilizingContext context) {
      CommunicatorMessage msg = (CommunicatorMessage) context.getEntityValue();
      UserEntity user = sessionController.getUser();
      Long replyCount = communicatorController.countMessagesByRecipientAndMessageId(user, msg.getCommunicatorMessageId());
      return replyCount--;
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
