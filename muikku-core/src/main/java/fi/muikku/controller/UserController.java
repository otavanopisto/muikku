package fi.muikku.controller;

import java.util.List;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.muikku.dao.base.EnvironmentDefaultsDAO;
import fi.muikku.dao.security.UserPasswordDAO;
import fi.muikku.dao.users.EnvironmentUserDAO;
import fi.muikku.dao.users.EnvironmentUserRoleDAO;
import fi.muikku.dao.users.UserContactDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserPictureDAO;
import fi.muikku.events.Created;
import fi.muikku.events.Modified;
import fi.muikku.events.Archived;
import fi.muikku.events.UserEntityEvent;
import fi.muikku.model.base.Environment;
import fi.muikku.model.base.EnvironmentDefaults;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.EnvironmentUserRole;
import fi.muikku.model.users.UserContact;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.session.SessionController;
import fi.muikku.utils.RequestUtils;

@Dependent
public class UserController {

  @Inject
  private UserPasswordDAO userPasswordDAO;
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;
  
  @Inject
  private EnvironmentUserRoleDAO environmentUserRoleDAO;
  
  @Inject
  private SessionController sessionController;
  
  @Inject 
  private EnvironmentDefaultsDAO environmentDefaultsDAO;

  @Inject
  private UserPictureDAO userPictureDAO;
  
  @Inject
  private UserContactDAO userContactDAO;
  
  @Inject
  private UserSchoolDataController userController;
  
  @Inject
  private UserEntityDAO userEntityDAO;

  @Inject
  @Created
  private Event<UserEntityEvent> userCreatedEvent;
  
  @Inject
  @Modified
  private Event<UserEntityEvent> userModifiedEvent;

  @Inject
  @Archived
  private Event<UserEntityEvent> userRemovedEvent;

  public User getUser(Long userId) {
    UserEntity userEntity = userEntityDAO.findById(userId);
    return userController.findUser(userEntity);
  }
  
  public User findUser(UserEntity userEntity) {
    return userController.findUser(userEntity);
  }

  public UserEntity findUserEntity(Long userEntityId) {
    return userEntityDAO.findById(userEntityId);
  }

  public boolean getUserHasPicture(UserEntity user) {
    return userPictureDAO.findUserHasPicture(user);
  }
  
  public List<UserContact> listUserContacts(UserEntity user) {
    boolean hidden = false;
    
    return userContactDAO.listByUser(user, hidden);
  }
  
  // TODO: Move to createUser and registration widget bean
  public void registerUser(SchoolDataSource dataSource, String firstName, String lastName, String email, String passwordHash) {
    Environment environment = sessionController.getEnvironment();

    UserEntity userEntity = userEntityDAO.create(dataSource, false);
    
    /**
     * Create User    
     */
    userController.createUser(userEntity, firstName, lastName, email);
    userPasswordDAO.create(userEntity, RequestUtils.md5EncodeString(passwordHash));
    
    /**
     * Give User Student Role
     */
    // TODO
    EnvironmentDefaults defaults = environmentDefaultsDAO.findByEnvironment(sessionController.getEnvironment());

    EnvironmentUserRole userRole = defaults.getDefaultUserRole();
    environmentUserDAO.create(userEntity, environment, userRole);

    fireUserCreatedEvent(userEntity);
  }

  @Permit (MuikkuPermissions.MANAGE_USERS) // TODO: ???
  public List<EnvironmentUser> listEnvironmentUsers(@PermitContext Environment environment) {
    return environmentUserDAO.listByEnvironment(environment);
  }

  private void fireUserCreatedEvent(UserEntity userEntity) {
    UserEntityEvent userEvent = new UserEntityEvent();
    userEvent.setUserEntityId(userEntity.getId());
    userCreatedEvent.fire(userEvent);
  }

  private void fireUserModifiedEvent(UserEntity userEntity) {
    UserEntityEvent userEvent = new UserEntityEvent();
    userEvent.setUserEntityId(userEntity.getId());
    userModifiedEvent.fire(userEvent);
  }

  private void fireUserRemovedEvent(UserEntity userEntity) {
    UserEntityEvent userEvent = new UserEntityEvent();
    userEvent.setUserEntityId(userEntity.getId());
    userRemovedEvent.fire(userEvent);
  }
}
