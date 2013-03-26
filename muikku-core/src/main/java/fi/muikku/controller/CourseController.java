package fi.muikku.controller;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.base.EnvironmentDefaultsDAO;
import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.courses.CourseEntityDAO;
import fi.muikku.dao.courses.CourseSettingsDAO;
import fi.muikku.dao.courses.CourseSettingsTemplateDAO;
import fi.muikku.dao.courses.CourseUserDAO;
import fi.muikku.dao.wall.CourseWallDAO;
import fi.muikku.dao.wall.WallEntryDAO;
import fi.muikku.dao.wall.WallEntryTextItemDAO;
import fi.muikku.dao.wall.subscription.UserWallSubscriptionDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.base.EnvironmentDefaults;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.courses.CourseSettings;
import fi.muikku.model.courses.CourseSettingsTemplate;
import fi.muikku.model.courses.CourseUserRole;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.wall.CourseWall;
import fi.muikku.model.wall.WallEntry;
import fi.muikku.model.wall.WallEntryVisibility;
import fi.muikku.schooldata.CourseSchoolDataController;
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
  private CourseSchoolDataController courseSchoolDataController;

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
  private CourseWallDAO courseWallDAO;

  @Inject
  private WallEntryDAO wallEntryDAO;

  @Inject
  private WallEntryTextItemDAO wallEntryTextItemDAO;

  @Inject
  private UserWallSubscriptionDAO userWallLinkDAO;

  @LoggedIn
  @Permit(MuikkuPermissions.CREATE_COURSE)
  public void createCourse(@PermitContext Environment environment, String name) {
    UserEntity creator = sessionController.getUser();
    EnvironmentDefaults defaults = environmentDefaultsDAO.findByEnvironment(environment);

    // TODO
    CourseSettingsTemplate template = courseSettingsTemplateDAO.findById(1l);
    SchoolDataSource dataSource = schoolDataSourceDAO.findById(1l);

    CourseEntity courseEntity = courseEntityDAO.create(dataSource, false);

    Course course = courseSchoolDataController.createCourse(courseEntity, name, creator);
    courseSettingsDAO.create(courseEntity, template.getDefaultCourseUserRole());
    courseUserDAO.create(creator, courseEntity, defaults.getDefaultCourseCreatorRole());

    CourseWall courseWall = courseWallDAO.create(courseEntity);

    WallEntry wallEntry = wallEntryDAO.create(courseWall, WallEntryVisibility.PUBLIC, creator);

    wallEntryTextItemDAO.create(wallEntry, "Course " + course.getName() + " created " + new Date().toString(), creator);

    userWallLinkDAO.create(creator, courseWall);
  }

  @Permit(MuikkuPermissions.LIST_COURSES)
  public List<CourseEntity> listCourses(@PermitContext Environment environment) {
    return courseEntityDAO.listAll();
  }

  // TODO: Rights
  // @Permit (MuikkuPermissions.LIST_COURSES)
  public List<CourseEntity> findCoursesByEnvironmentAndUser(@PermitContext Environment environment, UserEntity userEntity) {
    return courseUserDAO.listByUser(userEntity);
  }

  public Course findCourse(CourseEntity courseEntity) {
    return courseSchoolDataController.findCourse(courseEntity);
  }

  public CourseEntity findCourseEntityById(Long id) {
    return courseEntityDAO.findById(id);
  }

  @LoggedIn
  @Permit(MuikkuPermissions.JOIN_COURSE)
  public void joinCourse(@PermitContext CourseEntity courseEntity) {
    UserEntity loggedUser = sessionController.getUser();

    CourseSettings courseSettings = courseSettingsDAO.findByCourse(courseEntity);
    CourseUserRole courseUserRole = courseSettings.getDefaultCourseUserRole();
    CourseWall courseWall = courseWallDAO.findByCourse(courseEntity);

    courseUserDAO.create(loggedUser, courseEntity, courseUserRole);
    userWallLinkDAO.create(loggedUser, courseWall);
  }

  public boolean isUserOnCourse(CourseEntity course) {
    return courseUserDAO.findByCourseAndUser(course, sessionController.getUser()) != null;
  }

}
