package fi.muikku.controller;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.base.EnvironmentDefaultsDAO;
import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.courses.CourseEntityDAO;
import fi.muikku.dao.courses.CourseSettingsDAO;
import fi.muikku.dao.courses.CourseSettingsTemplateDAO;
import fi.muikku.dao.courses.CourseUserDAO;
import fi.muikku.dao.courses.CourseUserRoleDAO;
import fi.muikku.events.Archived;
import fi.muikku.events.CourseEntityEvent;
import fi.muikku.events.CourseUserEvent;
import fi.muikku.events.Created;
import fi.muikku.events.Modified;
import fi.muikku.model.base.EnvironmentDefaults;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.courses.CourseSettings;
import fi.muikku.model.courses.CourseSettingsTemplate;
import fi.muikku.model.courses.CourseUser;
import fi.muikku.model.courses.CourseUserRole;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.entity.Course;
import fi.muikku.security.LoggedIn;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.session.SessionController;

@RequestScoped
@Stateful
@Named("Course")
public class CourseController {

  @Inject
  private SessionController sessionController;

  @Inject
  private CourseEntityDAO courseEntityDAO;

  @Inject
  private EnvironmentDefaultsDAO environmentDefaultsDAO;

  @Inject
  private CourseSettingsTemplateDAO courseSettingsTemplateDAO;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private CourseSettingsDAO courseSettingsDAO;

  @Inject
  private CourseUserDAO courseUserDAO;

  @Inject
  private CourseUserRoleDAO courseUserRoleDAO;

  @Inject
  @Created
  private Event<CourseEntityEvent> courseCreationEvent;

  @Inject
  @Modified
  private Event<CourseEntityEvent> courseModifiedEvent;

  @Inject
  @Archived
  private Event<CourseEntityEvent> courseArchivedEvent;

  @Inject
  @Created
  private Event<CourseUserEvent> courseUserCreationEvent;

  public void TEST_COURSES() {
    createCourse("Ukkosen testikurz #" + ((int) (Math.random() * 100)));
  }
  
  @LoggedIn
  @Permit(MuikkuPermissions.CREATE_COURSE)
  public void createCourse(String name) {
    UserEntity creator = sessionController.getUser();
    EnvironmentDefaults defaults = environmentDefaultsDAO.find();

    // TODO
    CourseSettingsTemplate template = courseSettingsTemplateDAO.findById(1l);
    SchoolDataSource dataSource = schoolDataSourceDAO.findById(1l);

    CourseEntity courseEntity = courseEntityDAO.create(dataSource, false);

//    courseSchoolDataController.createCourse(courseEntity, name, creator);
    courseSettingsDAO.create(courseEntity, template.getDefaultCourseUserRole());
    courseUserDAO.create(creator, courseEntity, defaults.getDefaultCourseCreatorRole());

    fireCourseCreatedEvent(courseEntity);
  }

  @Permit(MuikkuPermissions.LIST_COURSES)
  public List<CourseEntity> listCourses() {
    return courseEntityDAO.listAll();
  }

  // TODO: Rights
  // @Permit (MuikkuPermissions.LIST_COURSES)
  public List<CourseEntity> findCoursesByUser(UserEntity userEntity) {
    return courseUserDAO.listCoursesByUser(userEntity);
  }

  public Course findCourse(CourseEntity courseEntity) {
//    return courseSchoolDataController.findCourse(courseEntity);
  	return null;
  }

  public CourseEntity findCourseEntityById(Long id) {
    return courseEntityDAO.findById(id);
  }

  public CourseUser findCourseUserById(Long id) {
    return courseUserDAO.findById(id);
  }
  
  @LoggedIn
  @Permit(MuikkuPermissions.JOIN_COURSE)
  public CourseUser joinCourse(@PermitContext CourseEntity courseEntity) {
    UserEntity loggedUser = sessionController.getUser();

    CourseSettings courseSettings = courseSettingsDAO.findByCourse(courseEntity);
    CourseUserRole courseUserRole = courseSettings.getDefaultCourseUserRole();
    
    CourseUser courseUser = courseUserDAO.create(loggedUser, courseEntity, courseUserRole);
    
    fireCourseUserCreatedEvent(courseUser);
    
    return courseUser;
  }

  public boolean isUserOnCourse(CourseEntity course) {
    return courseUserDAO.findByCourseAndUser(course, sessionController.getUser()) != null;
  }

  private void fireCourseCreatedEvent(CourseEntity courseEntity) {
    CourseEntityEvent courseEvent = new CourseEntityEvent();
    courseEvent.setCourseEntityId(courseEntity.getId());
    courseCreationEvent.fire(courseEvent);
  }
  
  private void fireCourseUserCreatedEvent(CourseUser courseUser) {
    CourseUserEvent courseUserEvent = new CourseUserEvent();
    courseUserEvent.setCourseUserId(courseUser.getId());
    courseUserCreationEvent.fire(courseUserEvent);
  }

  public List<CourseUser> listCourseTeachers(CourseEntity courseEntity) {
    // TODO
    CourseUserRole teacherRole = courseUserRoleDAO.findById(5l);

    return courseUserDAO.listByCourseAndRole(courseEntity, teacherRole);
  }
  
}
