package fi.muikku.rest.course;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.controller.CourseController;
import fi.muikku.controller.UserController;
import fi.muikku.model.courses.CourseUser;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.schooldata.entity.Course;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.AuthorizationException;
import fi.muikku.security.LoggedIn;
import fi.muikku.session.SessionController;
import fi.tranquil.TranquilModelEntity;
import fi.tranquil.TranquilModelType;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;
import fi.tranquil.TranquilizingContext;
import fi.tranquil.instructions.PropertyInjectInstruction.ValueGetter;
import fi.tranquil.instructions.SuperClassInstructionSelector;

@Path("/course")
@Stateless
@Produces ("application/json")
public class CourseRESTService extends AbstractRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;
  
//  @Inject
//  private WallController wallController;
//
//  @Inject
//  private ForumController forumController;
//  
  @Inject
  private CourseController courseController;
  
  @GET
  @Path ("/listAllCourses")
  public Response listAllCourses(@QueryParam("environmentId") Long environmentId) {
    List<CourseEntity> courses = courseController.listCourses(sessionController.getEnvironment());
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("name", new CourseNameInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("description", new CourseDescriptionInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("rating", new CourseRatingInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("ratingCount", new CourseRatingCountInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("isMember", new CourseIsMemberInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("teachers", new CourseTeachersGetter()));
//      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("course", new CourseSchoolDataInjector()));
    
    Collection<TranquilModelEntity> entities = tranquility.entities(courses);
    
    return Response.ok(
      entities
    ).build();
  }

  @GET
  @Path ("/listUserCourses")
  public Response listUserCourses(@QueryParam("environmentId") Long environmentId, @QueryParam("userId") Long userId) {
    UserEntity userEntity = userController.findUserEntity(userId);
    List<CourseEntity> courses = courseController.findCoursesByEnvironmentAndUser(sessionController.getEnvironment(), userEntity);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("name", new CourseNameInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("description", new CourseDescriptionInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("rating", new CourseRatingInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("ratingCount", new CourseRatingCountInjector()))
      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("teachers", new CourseTeachersGetter()));
//      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("course", new CourseSchoolDataInjector()));
    
    Collection<TranquilModelEntity> entities = tranquility.entities(courses);
    
    return Response.ok(
      entities
    ).build();
  }

  @POST
  @Path ("/{COURSEID}/joinCourse") 
  @LoggedIn
  public Response joinCourse(
      @PathParam ("COURSEID") Long courseId
   ) throws AuthorizationException {
    CourseEntity courseEntity = courseController.findCourseEntityById(courseId);
    
    CourseUser courseUser = courseController.joinCourse(courseEntity);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
      
    return Response.ok(
      tranquility.entity(courseUser)
    ).build();
  }
  
  
//  @GET
//  @Path ("/{WALLID}/listWallEntries")
//  public Response listWallEntries( 
//      @PathParam ("WALLID") Long wallId) {
//    
//    Wall wall = wallController.findWallById(wallId); 
//
//    List<WallEntry> entries = wallController.listWallEntries(wall);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction("replies", tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()));
//    
//    Collection<TranquilModelEntity> entities = tranquility.entities(entries);
//    
//    return Response.ok(
//      entities
//    ).build();
//  }
//
//  @POST
//  @Path ("/{WALLID}/addTextEntry") 
//  @LoggedIn
//  public Response addTextEntry(
//      @PathParam ("WALLID") Long wallId,
//      @FormParam ("text") String text,
//      @FormParam ("visibility") String visibility
//   ) throws AuthorizationException {
//    UserEntity user = sessionController.getUser();
//
//    Wall wall = wallController.findWallById(wallId);
//
//    if (!wallController.canPostEntry(wall))
//      throw new AuthorizationException("Not authorized");
//
//    try {
//      WallEntry entry = wallController.createWallEntry(wall, WallEntryVisibility.valueOf(visibility), user);
//
//      wallController.createWallEntryTextItem(entry, text, user);
//      
//      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//      Tranquility tranquility = tranquilityBuilder.createTranquility()
//        .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//        .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()));
//      
//      return Response.ok(
//        tranquility.entity(entry)
//      ).build();
//    } catch (ConstraintViolationException violationException) {
//      return getConstraintViolations(violationException);
//    }
//  }
//
//  @POST
//  @Path ("/{WALLID}/addGuidanceRequest") 
//  @LoggedIn
//  public Response addGuidanceRequest(
//      @PathParam ("WALLID") Long wallId,
//      @FormParam ("text") String text,
//      @FormParam ("visibility") String visibility
//   ) throws AuthorizationException {
//    UserEntity user = sessionController.getUser();
//
//    Wall wall = wallController.findWallById(wallId);
//
//    if (!wallController.canPostEntry(wall))
//      throw new AuthorizationException("Not authorized");
//
//    try {
//      WallEntry entry = wallController.createWallEntry(wall, WallEntryVisibility.valueOf(visibility), user);
//      
//      wallController.createWallEntryGuidanceRequestItem(entry, text, user);
//      
//      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//      Tranquility tranquility = tranquilityBuilder.createTranquility()
//        .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//        .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()));
//
//      return Response.ok(
//        tranquility.entity(entry)
//      ).build();
//    } catch (ConstraintViolationException violationException) {
//      return getConstraintViolations(violationException);
//    }
//  }
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
//    try {
//      WallEntryReply reply = wallController.createWallEntryReply(wall, wallEntry, user);
//      wallController.createWallEntryTextItem(reply, text, user);
//      
//      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//      Tranquility tranquility = tranquilityBuilder.createTranquility()
//        .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//        .addInstruction(UserEntity.class, tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()));
//
//      return Response.ok(
//          tranquility.entity(reply)
//        ).build();
//      
//    } catch (ConstraintViolationException violationException) {
//      return getConstraintViolations(violationException);
//    }
//  }
//  
//  private class UserEntityHasPictureValueGetter implements ValueGetter<Boolean> {
//    @Override
//    public Boolean getValue(TranquilizingContext context) {
//      UserEntity user = (UserEntity) context.getEntityValue();
//      return userController.getUserHasPicture(user);
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
  
//  private class CourseSchoolDataInjector implements ValueGetter<TranquilModelEntity> {
//    @Override
//    public TranquilModelEntity getValue(TranquilizingContext context) {
//      CourseEntity courseEntity = (CourseEntity) context.getEntityValue();
//
//      Course course = courseController.findCourse(courseEntity);
//      
//      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//      Tranquility tranquility = tranquilityBuilder.createTranquility()
//          .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//      
//      return tranquility.entity(course);
//    }
//  }

  private class CourseNameInjector implements ValueGetter<String> {
    @Override
    public String getValue(TranquilizingContext context) {
      CourseEntity courseEntity = (CourseEntity) context.getEntityValue();

      Course course = courseController.findCourse(courseEntity);
      
      return course.getName();
    }
  }

  private class CourseDescriptionInjector implements ValueGetter<String> {
    @Override
    public String getValue(TranquilizingContext context) {
      CourseEntity courseEntity = (CourseEntity) context.getEntityValue();

      Course course = courseController.findCourse(courseEntity);
      
      return course.getDescription() != null ? course.getDescription() : "";
    }
  }

  private class CourseRatingInjector implements ValueGetter<Long> {
    @Override
    public Long getValue(TranquilizingContext context) {
      return new Long(8);
    }
  }

  private class CourseRatingCountInjector implements ValueGetter<Long> {
    @Override
    public Long getValue(TranquilizingContext context) {
      return new Long(45);
    }
  }

  private class CourseIsMemberInjector implements ValueGetter<Boolean> {
    @Override
    public Boolean getValue(TranquilizingContext context) {
      CourseEntity courseEntity = (CourseEntity) context.getEntityValue();
      
      if (sessionController.isLoggedIn())
        return courseController.isUserOnCourse(courseEntity);
      else
        return false;
    }
  }
  
  private class CourseTeachersGetter implements ValueGetter<Collection<TranquilModelEntity>> {
    @Override
    public Collection<TranquilModelEntity> getValue(TranquilizingContext context) {
      CourseEntity courseEntity = (CourseEntity) context.getEntityValue();
      
      List<CourseUser> teachers = courseController.listCourseTeachers(courseEntity);
      List<UserEntity> teacherUserEntities = new ArrayList<UserEntity>();
      
      for (CourseUser cu : teachers)
        teacherUserEntities.add(cu.getUser());
      
      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
      Tranquility tranquility = tranquilityBuilder.createTranquility()
          .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
          .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
          .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
      
      return tranquility.entities(teacherUserEntities);
    }
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

  
}
