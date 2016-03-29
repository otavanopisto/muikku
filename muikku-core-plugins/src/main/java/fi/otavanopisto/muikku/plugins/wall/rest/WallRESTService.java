package fi.otavanopisto.muikku.plugins.wall.rest;

import javax.ejb.Stateless;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import fi.otavanopisto.muikku.plugin.PluginRESTService;

@Path("/wall")
@Stateless
@Produces ("application/json")
public class WallRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1517911682419646845L;

  /**
   * Commented until redesign
   */
  
//  @Inject
//  private SessionController sessionController;
//
//  @Inject
//  private WallController wallController;
//  
//  /* Wall */
//  
//  @GET
//  @Path ("/walls/{WALLID}")
//  public Response findWallEntry(@PathParam ("WALLID") Long wallId) {
//    Wall wall = wallController.findWallById(wallId); 
//    if (wall == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//
//    return Response.ok(createRestModel(wall)).build();
//  }
//  
//  /* Feed */
//  
//  @GET
//  @Path ("/walls/{WALLID}/feed/")
//  public Response listWallEntries(@PathParam ("WALLID") Long wallId) {
//    Wall wall = wallController.findWallById(wallId); 
//    if (wall == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
//    List<WallFeedItem> entries = wallController.listWallFeed(wall);
//    if (entries.isEmpty()) {
//      return Response.noContent().build();
//    }
//
//    return Response.ok(createRestModel(entries.toArray(new WallFeedItem[0]))).build();
//  }
//  
//  /* Entries */
//  
//  @POST
//  @Path ("/walls/{WALLID}/wallEntries/") 
//  @LoggedIn
//  public Response craeteWallEntry(@PathParam ("WALLID") Long wallId, fi.otavanopisto.muikku.plugins.wall.rest.model.WallEntry entity){
//    UserEntity user = sessionController.getLoggedUserEntity();
//
//    if (entity.getVisibility() == null) {
//      return Response.status(Status.BAD_REQUEST).build();
//    }
//
//    if (StringUtils.isEmpty(entity.getText())) {
//      return Response.status(Status.BAD_REQUEST).build();
//    }
//  
//    Wall wall = wallController.findWallById(wallId);
//    if (wall == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
//    WallEntry entry = wallController.createWallEntry(wall, entity.getText(), entity.getVisibility(), user);
//    
//    return Response.ok(createRestModel(entry)).build();
//  }
//  
//  @GET
//  @Path ("/walls/{WALLID}/wallEntries/{ENTRYID}") 
//  @LoggedIn
//  public Response createWallEntry(@PathParam ("WALLID") Long wallId, @PathParam ("ENTRYID") Long entryId){
//    Wall wall = wallController.findWallById(wallId);
//    if (wall == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
//    WallEntry entry = wallController.findWallEntryById(entryId);
//    if (entry == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
////    if (!entry.getWall().getId().equals(wall.getId())) {
////      return Response.status(Status.NOT_FOUND).build();
////    }
//    
//    return Response.ok(createRestModel(entry)).build();
//  }
//  
//  /* Replies */
//  
//  @POST
//  @Path ("/walls/{WALLID}/wallEntries/{ENTRYID}/replies/") 
//  @LoggedIn
//  public Response createWallEntryReply(@PathParam ("WALLID") Long wallId, @PathParam ("ENTRYID") Long entryId, fi.otavanopisto.muikku.plugins.wall.rest.model.WallEntryReply reply) {
//    if (StringUtils.isEmpty(reply.getText())) {
//      return Response.status(Status.BAD_REQUEST).build();
//    }
//    
//    Wall wall = wallController.findWallById(wallId);
//    if (wall == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
//    WallEntry entry = wallController.findWallEntryById(entryId);
//    if (entry == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
////    if (!entry.getWall().getId().equals(wall.getId())) {
////      return Response.status(Status.NOT_FOUND).build();
////    }
//    
//    WallEntryReply entryReply = wallController.createWallEntryReply(wall, entry, reply.getText(), sessionController.getLoggedUserEntity());
//    
//    return Response.ok(createRestModel(entryReply)).build();
//  }
//  
//  @GET
//  @Path ("/walls/{WALLID}/wallEntries/{ENTRYID}/replies/") 
//  @LoggedIn
//  public Response listWallEntryReplies(@PathParam ("WALLID") Long wallId, @PathParam ("ENTRYID") Long entryId) {
//    Wall wall = wallController.findWallById(wallId);
//    if (wall == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
//    WallEntry entry = wallController.findWallEntryById(entryId);
//    if (entry == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
////    if (!entry.getWall().getId().equals(wall.getId())) {
////      return Response.status(Status.NOT_FOUND).build();
////    }
//    
//    List<WallEntryReply> replies = wallController.listWallEntryComments(entry);
//    if (replies.isEmpty()) {
//      return Response.status(Status.NO_CONTENT).build(); 
//    }
//    
//    return Response.ok(createRestModel(replies.toArray(new WallEntryReply[0]))).build();
//  }
//  
//  private fi.otavanopisto.muikku.plugins.wall.rest.model.Wall createRestModel(Wall entity) {
//    return new fi.otavanopisto.muikku.plugins.wall.rest.model.Wall(entity.getId(), entity.getWallType(), entity.getTypeId());
//  }
//
//  private List<fi.otavanopisto.muikku.plugins.wall.rest.model.WallFeedItem> createRestModel(WallFeedItem... entries) {
//    List<fi.otavanopisto.muikku.plugins.wall.rest.model.WallFeedItem> result = new ArrayList<>();
//    
//    for (WallFeedItem entry : entries) {
//      result.add(createRestModel(entry));
//    }
//    
//    return result;
//  }
//
//  private List<fi.otavanopisto.muikku.plugins.wall.rest.model.WallEntryReply> createRestModel(WallEntryReply... entries) {
//    List<fi.otavanopisto.muikku.plugins.wall.rest.model.WallEntryReply> result = new ArrayList<>();
//    
//    for (WallEntryReply entry : entries) {
//      result.add(createRestModel(entry));
//    }
//    
//    return result;
//  }
//  
//  private fi.otavanopisto.muikku.plugins.wall.rest.model.WallFeedItem createRestModel(WallFeedItem entity) {
//    return new fi.otavanopisto.muikku.plugins.wall.rest.model.WallFeedItem(entity.getType(), entity.getIdentifier(), entity.getDate());
//  }
//
//  private fi.otavanopisto.muikku.plugins.wall.rest.model.WallEntry createRestModel(WallEntry entity) {
//    Long wallId = entity.getWall() != null ? entity.getWall().getId() : null;
//    Long creatorId = entity.getCreator();
//    Long lastModifierId = entity.getLastModifier();
//    return new fi.otavanopisto.muikku.plugins.wall.rest.model.WallEntry(entity.getId(), wallId, entity.getText(), entity.getArchived(), creatorId, entity.getCreated(), lastModifierId, entity.getLastModified(), entity.getVisibility());
//  }
//
//  private fi.otavanopisto.muikku.plugins.wall.rest.model.WallEntryReply createRestModel(WallEntryReply entity) {
//    Long wallId = entity.getWall() != null ? entity.getWall().getId() : null;
//    Long creatorId = entity.getCreator();
//    Long lastModifierId = entity.getLastModifier();
//    Long wallEntryId = entity.getWallEntry() != null ? entity.getWallEntry().getId() : null;
//    
//    return new fi.otavanopisto.muikku.plugins.wall.rest.model.WallEntryReply(entity.getId(), wallId, entity.getText(), entity.getArchived(), creatorId, entity.getCreated(), lastModifierId, entity.getLastModified(), wallEntryId);
//  }
  
//FIXME: Re-enable this service
//
//  @Inject 
//  private TranquilityBuilderFactory tranquilityBuilderFactory;
//
//  @Inject
//  private UserController userController;
//  
//
//  @Inject
//  private ForumController forumController;
//  
////  @GET
////  @Path ("/listUserFeedItems")
////  public Response listUserFeedItems( 
////      @QueryParam("userId") Long userId) {
////    UserEntity user = userController.findUserEntityById(userId); 
////    
////    List<UserFeedItem> userFeedItems = wallController.listUserFeedItems(user);
////
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
////    
////    Collection<TranquilModelEntity> entities = tranquility.entities(userFeedItems);
////    
////    return Response.ok(
////      entities
////    ).build();
////  }
//  

//

//
//  @POST
//  @Path ("/{WALLID}/addWallEntryComment") 
//  @LoggedIn
//  public Response addWallEntryComment(
//      @PathParam ("WALLID") Long wallId,
//      @FormParam ("wallEntryId") Long wallEntryId,
//      @FormParam ("text") String text
//   ) throws AuthorizationException {
//    UserEntity user = sessionController.getUser();
//
//    Wall wall = wallController.findWallById(wallId);
//
//    // TODO: oikeudet entryyn
//    
//    if (!wallController.canPostEntry(wall))
//      throw new AuthorizationException("Not authorized");
//
//    WallEntry wallEntry = wallController.findWallEntryById(wallEntryId);
//    
//    WallEntryReply reply = wallController.createWallEntryReply(wall, wallEntry, text, user);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()));
//
//    return Response.ok(
//      tranquility.entity(reply)
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
//  private class WallEntityNameGetter implements ValueGetter<String> {
//    @Override
//    public String getValue(TranquilizingContext context) {
//      Wall wall = (Wall) context.getEntityValue();
//      return wallController.getWallName(wall);
//    }
//  }
//
//  private class WallEntityTypeGetter implements ValueGetter<String> {
//    @Override
//    public String getValue(TranquilizingContext context) {
//      Wall wall = (Wall) context.getEntityValue();
//      
//      if (wall instanceof WorkspaceWall)
//        return "WORKSPACE";
//      
//      if (wall instanceof UserWall)
//        return "USER";
//      
//      if (wall instanceof EnvironmentWall)
//        return "ENVIRONMENT";
//      
//      return "";
//    }
//  }
//  
//  private class ForumThreadReplyInjector implements ValueGetter<Collection<TranquilModelEntity>> {
//    @Override
//    public Collection<TranquilModelEntity> getValue(TranquilizingContext context) {
//      ForumThread forumThread = (ForumThread) context.getEntityValue();
//      
//      List<ForumThreadReply> replies = forumController.listForumThreadReplies(forumThread);
//      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//      Tranquility tranquility = tranquilityBuilder.createTranquility()
//          .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//          .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//          .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//      
//      return tranquility.entities(replies);
//    }
//  }
}
