package fi.muikku.rest.course;

import javax.ejb.Stateless;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import fi.muikku.rest.AbstractRESTService;

@Path("/course")
@Stateless
@Produces ("application/json")
public class CourseRESTService extends AbstractRESTService {
  
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
//  private RoleController roleController;
//  
//  @Inject
//  private WorkspaceController workspaceController;
//  
//  @Inject
//  private LocaleController localeController;
//
//  @Inject
//  private CourseMetaController courseMetaController;
//  
//  @Inject
//  @Any
//  private Instance<MessagingWidget> messagingWidgets;
//  
//  @GET
//  @Path ("/")
//  public Response listAllCourses() {
//    List<WorkspaceEntity> workspaces = workspaceController.listWorkspaceEntities();
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("name", new CourseNameInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("description", new CourseDescriptionInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("rating", new CourseRatingInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("ratingCount", new CourseRatingCountInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("isMember", new CourseIsMemberInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("teachers", new CourseTeachersGetter()));
////      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("course", new CourseSchoolDataInjector()));
//      ;    
//    Collection<TranquilModelEntity> entities = tranquility.entities(workspaces);
//    
//    return Response.ok(
//      entities
//    ).build();
//  }
//
//  @GET
//  @Path ("/listUserCourses")
//  public Response listUserCourses(@QueryParam("userId") Long userId) {
//    UserEntity userEntity = userController.findUserEntityById(userId);
//    List<WorkspaceUserEntity> courses = workspaceController.listWorkspaceEntitiesByUser(userEntity);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("name", new CourseNameInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("description", new CourseDescriptionInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("rating", new CourseRatingInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("ratingCount", new CourseRatingCountInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("isMember", new CourseIsMemberInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("teachers", new CourseTeachersGetter()))
////      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("course", new CourseSchoolDataInjector()));
//    ;
//    Collection<TranquilModelEntity> entities = tranquility.entities(courses);
//    
//    return Response.ok(
//      entities
//    ).build();
//  }
//
//  @POST
//  @Path ("/{WORKSPACEID}/joinWorkspace") 
//  @LoggedIn
//  public Response joinCourse(
//      @PathParam ("WORKSPACEID") Long workspaceId
//   ) throws AuthorizationException {
//    
//    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
//    UserEntity userEntity = sessionController.getUser();
//    WorkspaceUserEntity workspaceUserEntity = workspaceController.findWorkspaceUserEntityByWorkspaceAndUser(workspaceEntity, userEntity);
//        
//    if (workspaceUserEntity == null) {
//      WorkspaceSettings workspaceSettings = workspaceController.findWorkspaceSettings(workspaceEntity);
//      WorkspaceRoleEntity defaultWorkspaceUserRole = workspaceSettings.getDefaultWorkspaceUserRole();
//      WorkspaceUser workspaceUser = workspaceController.createWorkspaceUser(workspaceEntity, userEntity, defaultWorkspaceUserRole);
//      workspaceUserEntity = workspaceController.findWorkspaceUserEntity(workspaceUser);
//
//      // TODO: should this work based on permission? Permission -> Roles -> Recipients
//      WorkspaceRoleEntity role = roleController.ROLE_WORKSPACE_TEACHER();
//      List<WorkspaceUserEntity> workspaceTeachers = workspaceController.listWorkspaceUserEntitiesByRole(workspaceEntity, role);
//      List<UserEntity> teachers = new ArrayList<UserEntity>();
//      
//      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
//      String workspaceName = workspace.getName();
//      
//      User user = userController.findUser(userEntity);
//      String userName = user.getFirstName() + " " + user.getLastName();
//      
//      for (WorkspaceUserEntity cu : workspaceTeachers)
//        teachers.add(cu.getUser());
//      
//      for (MessagingWidget messagingWidget : messagingWidgets) {
//        String caption = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.caption");
//        String content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.content");
//        caption = MessageFormat.format(caption, workspaceName);
//        content = MessageFormat.format(content, userName, workspaceName);
//        messagingWidget.postMessage(userEntity, null, caption, content, teachers);
//      }
//    }
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//      
//    return Response.ok(
//      tranquility.entity(workspaceUserEntity)
//    ).build();
//  }
//
//  @GET
//  @Path ("/searchCourses")
//  public Response searchCourses(@QueryParam("searchString") String searchString, @QueryParam("subjects") List<String> subjects) {
//    List<Workspace> listWorkspaceEntities = workspaceController.listWorkspaces();
//    List<WorkspaceEntity> courses = new ArrayList<WorkspaceEntity>();
//    
//    if (searchString != null)
//      searchString = searchString.toLowerCase();
//
//    for (Workspace workspace : listWorkspaceEntities) {
//      WorkspaceEntity e = workspaceController.findWorkspaceEntity(workspace);
//      
//      boolean accepted = true;
//      
//      if (!StringUtils.isEmpty(searchString))
//        accepted = ((workspace.getName().toLowerCase().contains(searchString)) || (workspace.getDescription().toLowerCase().contains(searchString))); 
//
//      if (!subjects.isEmpty()) {
//        if (workspace.getCourseIdentifierIdentifier() != null) {
//          CourseIdentifier courseIdentifier = courseMetaController.findCourseIdentifier(workspace.getSchoolDataSource(), workspace.getCourseIdentifierIdentifier());
//          Subject subject = courseMetaController.findSubject(workspace.getSchoolDataSource(), courseIdentifier.getSubjectIdentifier());
//  
//          accepted = accepted && subjects.contains(subject.getIdentifier());
//        } else
//          accepted = false;
//      }
//      
//      // TODO remove
//      if (accepted)
//        courses.add(e);
//    }
//
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("name", new CourseNameInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("description", new CourseDescriptionInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("rating", new CourseRatingInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("ratingCount", new CourseRatingCountInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("isMember", new CourseIsMemberInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("teachers", new CourseTeachersGetter()));
////      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("course", new CourseSchoolDataInjector()));
//      ;    
//    Collection<TranquilModelEntity> entities = tranquility.entities(courses);
//    
//    return Response.ok(
//      entities
//    ).build();
//  }
//
//  @GET
//  @Path ("/searchUserCourses")
//  public Response searchUserCourses(@QueryParam("userId") Long userId, @QueryParam("searchString") String searchString, @QueryParam("subjects") List<String> subjects) {
//    UserEntity userEntity = userController.findUserEntityById(userId);
//    List<WorkspaceUserEntity> courses = workspaceController.listWorkspaceEntitiesByUser(userEntity);
//
//    List<WorkspaceUserEntity> filteredCourses = new ArrayList<WorkspaceUserEntity>();
//    
//    if (searchString != null)
//      searchString = searchString.toLowerCase();
//
//    for (WorkspaceUserEntity workspaceUserEntity : courses) {
//      WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
//      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
//      
//      boolean accepted = true;
//      
//      if (!StringUtils.isEmpty(searchString))
//        accepted = ((workspace.getName().toLowerCase().contains(searchString)) || (workspace.getDescription().toLowerCase().contains(searchString))); 
//
//      if (!subjects.isEmpty()) {
//        if (workspace.getCourseIdentifierIdentifier() != null) {
//          CourseIdentifier courseIdentifier = courseMetaController.findCourseIdentifier(workspace.getSchoolDataSource(), workspace.getCourseIdentifierIdentifier());
//          Subject subject = courseMetaController.findSubject(workspace.getSchoolDataSource(), courseIdentifier.getSubjectIdentifier());
//  
//          accepted = accepted && subjects.contains(subject.getIdentifier());
//        } else
//          accepted = false;
//      }
//      
//      // TODO remove
//      if (accepted)
//        filteredCourses.add(workspaceUserEntity);
//    }
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("name", new CourseNameInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("description", new CourseDescriptionInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("rating", new CourseRatingInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("ratingCount", new CourseRatingCountInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("isMember", new CourseIsMemberInjector()))
//      .addInstruction(WorkspaceEntity.class, tranquilityBuilder.createPropertyInjectInstruction("teachers", new CourseTeachersGetter()))
////      .addInstruction(CourseEntity.class, tranquilityBuilder.createPropertyInjectInstruction("course", new CourseSchoolDataInjector()));
//    ;
//    Collection<TranquilModelEntity> entities = tranquility.entities(filteredCourses);
//    
//    return Response.ok(
//      entities
//    ).build();
//  }
//
//  private class CourseNameInjector implements ValueGetter<String> {
//    @Override
//    public String getValue(TranquilizingContext context) {
//      WorkspaceEntity workspaceEntity = (WorkspaceEntity) context.getEntityValue();
//
//      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
//      
//      return workspace.getName();
//    }
//  }
//
//  private class CourseDescriptionInjector implements ValueGetter<String> {
//    @Override
//    public String getValue(TranquilizingContext context) {
//      WorkspaceEntity workspaceEntity = (WorkspaceEntity) context.getEntityValue();
//
//      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
//      
//      return workspace.getDescription() != null ? workspace.getDescription() : "";
//    }
//  }
//
//  private class CourseRatingInjector implements ValueGetter<Long> {
//    @Override
//    public Long getValue(TranquilizingContext context) {
//      return new Long(8);
//    }
//  }
//
//  private class CourseRatingCountInjector implements ValueGetter<Long> {
//    @Override
//    public Long getValue(TranquilizingContext context) {
//      return new Long(45);
//    }
//  }
//
//  private class CourseIsMemberInjector implements ValueGetter<Boolean> {
//    @Override
//    public Boolean getValue(TranquilizingContext context) {
//      WorkspaceEntity courseEntity = (WorkspaceEntity) context.getEntityValue();
//      
//      if (sessionController.isLoggedIn()) {
//        UserEntity user = sessionController.getUser();
//        
//        return workspaceController.findWorkspaceUserEntityByWorkspaceAndUser(courseEntity, user) != null;
//      }
//      else
//        return false;
//    }
//  }
//  
//  private class CourseTeachersGetter implements ValueGetter<Collection<TranquilModelEntity>> {
//    @Override
//    public Collection<TranquilModelEntity> getValue(TranquilizingContext context) {
//      WorkspaceEntity courseEntity = (WorkspaceEntity) context.getEntityValue();
//      
//      List<WorkspaceUserEntity> teachers = workspaceController.listWorkspaceUserEntitiesByRole(courseEntity, roleController.ROLE_WORKSPACE_TEACHER());
//      List<UserEntity> teacherUserEntities = new ArrayList<UserEntity>();
//      
//      for (WorkspaceUserEntity cu : teachers)
//        teacherUserEntities.add(cu.getUser());
//      
//      TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//      Tranquility tranquility = tranquilityBuilder.createTranquility()
//          .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//          .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//          .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//      
//      return tranquility.entities(teacherUserEntities);
//    }
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

  
}
