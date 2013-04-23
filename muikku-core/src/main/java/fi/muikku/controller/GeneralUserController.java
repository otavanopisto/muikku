package fi.muikku.controller;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.base.EnvironmentDefaultsDAO;
import fi.muikku.dao.security.UserPasswordDAO;
import fi.muikku.dao.users.EnvironmentUserDAO;
import fi.muikku.dao.users.EnvironmentUserRoleDAO;
import fi.muikku.dao.users.UserContactDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserPictureDAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.SessionController;

@RequestScoped
@Named("User")
public class GeneralUserController {

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
  
//  public List<UserContact> listUserContacts(UserEntity user) {
//    boolean hidden = false;
//    
//    return userContactDAO.listByUser(user, hidden);
//  }
//
//  @Permit (MuikkuPermissions.MANAGE_USERS) // TODO: ???
//  public List<EnvironmentUser> listEnvironmentUsers(@PermitContext Environment environment) {
//    return environmentUserDAO.listByEnvironment(environment);
//  }
  
}
