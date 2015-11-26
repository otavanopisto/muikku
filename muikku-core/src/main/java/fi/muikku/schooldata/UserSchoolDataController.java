package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.entity.UserGroup;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.schooldata.entity.GroupUser;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;

@Dependent
@Stateful
public class UserSchoolDataController {

  // TODO: Caching
  // TODO: Events

  @Inject
  private Logger logger;

  @Inject
  @Any
  private Instance<UserSchoolDataBridge> userBridges;

  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  /* User */

  public User createUser(SchoolDataSource schoolDataSource, String firstName, String lastName) {
    UserSchoolDataBridge userBridge = getUserBridge(schoolDataSource);
    if (userBridge != null) {
      try {
        return userBridge.createUser(firstName, lastName);
      } catch (SchoolDataBridgeRequestException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while creating an user", e);
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while creating an user", e);
      }
    }

    return null;
  }

  public User findUser(SchoolDataSource schoolDataSource, String userIdentifier) {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.findUser(userIdentifier);
      } catch (SchoolDataBridgeRequestException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while find a user", e);
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while find a user", e);
      }
    }

    return null;
  }

  public User findUser(String schoolDataSource, String userIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource != null) {
      return findUser(dataSource, userIdentifier);
    }

    return null;
  }

  public User findActiveUser(SchoolDataSource schoolDataSource, String identifier) {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.findActiveUser(identifier);
      } catch (SchoolDataBridgeRequestException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while find an active user", e);
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while find an active user", e);
      }
    }

    return null;
  }

  public List<User> listUsers() {
    // TODO: This method WILL cause performance problems, replace with something more sensible

    List<User> result = new ArrayList<User>();

    for (UserSchoolDataBridge userBridge : getUserBridges()) {
      try {
        result.addAll(userBridge.listUsers());
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing users", e);
      }
    }

    return result;
  }

  public List<User> listUsersByEntity(UserEntity userEntity) {
    List<User> result = new ArrayList<>();

    List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierDAO.listByUserEntityAndArchived(userEntity, Boolean.FALSE);
    for (UserSchoolDataIdentifier identifier : identifiers) {
      UserSchoolDataBridge userBridge = getUserBridge(identifier.getDataSource());
      User user = findUserByIdentifier(userBridge, identifier.getIdentifier());
      if (user != null) {
        result.add(user);
      }
    }

    return result;
  }

  public List<User> listUsersByEmail(String email) {
    List<User> result = new ArrayList<User>();

    for (UserSchoolDataBridge userBridge : getUserBridges()) {
      try {
        result.addAll(userBridge.listUsersByEmail(email));
      } catch (SchoolDataBridgeRequestException e) {
        logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing users by email", e);
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing users by email", e);
      }
    }

    return result;
  }

  public List<User> listUsersByEmails(List<String> emails) {
    List<User> result = new ArrayList<>();

    for (String email : emails) {
      List<User> users = listUsersByEmail(email);
      for (User user : users) {
        if (!userListContains(result, user)) {
          result.add(user);
        }
      }
    }

    return result;
  }

  private boolean userListContains(List<User> listUsers, User user) {
    for (User listUser : listUsers) {
      if (listUser.getSchoolDataSource().equals(user.getSchoolDataSource()) && listUser.getIdentifier().equals(user.getIdentifier())) {
        return true;
      }
    }

    return false;
  }

  /* User Entity */

  public UserEntity findUserEntity(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifierAndArchived(schoolDataSource, user.getIdentifier(), Boolean.FALSE);
    if (userSchoolDataIdentifier != null) {
      return userSchoolDataIdentifier.getUserEntity();
    }

    return null;
  }

  public UserEntity findUserEntityByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifierAndArchived(dataSource, identifier, Boolean.FALSE);
    if (userSchoolDataIdentifier != null) {
      return userSchoolDataIdentifier.getUserEntity();
    }

    return null;
  }

  /* User Emails */

  public List<UserEmail> listUserEmails(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        try {
          return schoolDataBridge.listUserEmailsByUserIdentifier(user.getIdentifier());
        } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
          logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing user emails", e);
        }
      }
    }

    return null;
  }

  public UserEmail findUserEmail(SchoolDataSource schoolDataSource, String identifier) {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.findUserEmail(identifier);
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing user emails", e);
      }
    }

    return null;
  }

  /* Roles */

  public Role findRole(SchoolDataSource schoolDataSource, String identifier) {
    UserSchoolDataBridge userBridge = getUserBridge(schoolDataSource);
    if (userBridge != null) {
      try {
        return userBridge.findRole(identifier);
      } catch (SchoolDataBridgeRequestException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding a role", e);
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding a role", e);
      }
    } else {
      logger.severe("Could not find userBridge for school data source " + schoolDataSource.getIdentifier());
    }

    return null;
  }

  public List<Role> listRoles() {
    List<Role> result = new ArrayList<>();

    for (UserSchoolDataBridge userBridge : getUserBridges()) {
      try {
        result.addAll(userBridge.listRoles());
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing users", e);
      }
    }

    return result;
  }

  public Role findUserEnvironmentRole(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        try {
          return schoolDataBridge.findUserEnvironmentRole(user.getIdentifier());
        } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
          logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing user emails", e);
        }
      }
    }

    return null;
  }

  /* UserGroups */

  public UserGroup findUserGroup(SchoolDataSource schoolDataSource, String identifier) {
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        try {
          return schoolDataBridge.findUserGroup(identifier);
        } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
          logger.log(Level.SEVERE, "SchoolDataBridge reported an error while finding user group", e);
        }
      }
    }
    return null;
  }

  public List<UserGroup> listUserGroups(SchoolDataSource schoolDataSource) {
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        try {
          return schoolDataBridge.listUserGroups();
        } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
          logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing user groups", e);
        }
      }
    }
    return null;
  }

  /* Group users */

  public GroupUser findGroupUser(SchoolDataSource schoolDataSource, String groupIdentifier, String identifier) {
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        try {
          return schoolDataBridge.findGroupUser(groupIdentifier, identifier);
        } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
          logger.log(Level.SEVERE, "SchoolDataBridge reported an error while finding group user", e);
        }
      }
    }
    return null;
  }
  
  public List<GroupUser> listGroupUsersByGroup(UserGroup userGroup){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userGroup.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        try {
          return schoolDataBridge.listGroupUsersByGroup(userGroup.getIdentifier());
        } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
          logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing group users", e);
        }
      }
    }
    return null;
  }

  private UserSchoolDataBridge getUserBridge(SchoolDataSource schoolDataSource) {
    Iterator<UserSchoolDataBridge> iterator = userBridges.iterator();
    while (iterator.hasNext()) {
      UserSchoolDataBridge userSchoolDataBridge = iterator.next();
      if (userSchoolDataBridge.getSchoolDataSource().equals(schoolDataSource.getIdentifier())) {
        return userSchoolDataBridge;
      }
    }

    return null;
  }

  private User findUserByIdentifier(UserSchoolDataBridge userBridge, String identifier) {
    try {
      return userBridge.findUser(identifier);
    } catch (SchoolDataBridgeRequestException e) {
      logger.log(Level.SEVERE, "SchoolDataBridge reported an error while finding user", e);
    } catch (UnexpectedSchoolDataBridgeException e) {
      logger.log(Level.SEVERE, "SchoolDataBridge reported an error while finding user", e);
    }

    return null;
  }

  private List<UserSchoolDataBridge> getUserBridges() {
    List<UserSchoolDataBridge> result = new ArrayList<UserSchoolDataBridge>();

    Iterator<UserSchoolDataBridge> iterator = userBridges.iterator();
    while (iterator.hasNext()) {
      result.add(iterator.next());
    }

    return Collections.unmodifiableList(result);
  }

  public String findUsername(User user) throws SchoolDataBridgeUnauthorizedException {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        try {
          return schoolDataBridge.findUsername(user.getIdentifier());
        } catch (SchoolDataBridgeUnauthorizedException surr) {
          logger.log(Level.WARNING, "Unauthorized error while updateUserCredentials", surr);
          throw surr;
        } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
          logger.log(Level.SEVERE, "SchoolDataBridge reported an error while findUsername", e);
        }
      }
    }
    
    return null;
	}
	
	public void updateUserCredentials(User user, String oldPassword, String newUsername, String newPassword) throws SchoolDataBridgeUnauthorizedException {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        try {
          schoolDataBridge.updateUserCredentials(user.getIdentifier(), oldPassword, newUsername, newPassword);
        } catch (SchoolDataBridgeUnauthorizedException surr) {
          logger.log(Level.WARNING, "Unauthorized error while updateUserCredentials", surr);
          throw surr;
        } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
          logger.log(Level.SEVERE, "SchoolDataBridge reported an error while updateUserCredentials", e);
        } 
      }
    }
	}
	
  public String requestPasswordResetByEmail(SchoolDataSource schoolDataSource, String email) throws SchoolDataBridgeUnauthorizedException {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.requestPasswordResetByEmail(email);
      } catch (SchoolDataBridgeUnauthorizedException surr) {
        logger.log(Level.WARNING, "Unauthorized error while requestPasswordResetByEmail", surr);
        throw surr;
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "SchoolDataBridge reported an error while requestPasswordResetByEmail", e);
      }
    }
    
    return null;
  }

  public boolean confirmResetPassword(SchoolDataSource schoolDataSource, String resetCode, String newPassword) throws SchoolDataBridgeUnauthorizedException {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      try {
        return schoolDataBridge.confirmResetPassword(resetCode, newPassword);
      } catch (SchoolDataBridgeUnauthorizedException surr) {
        logger.log(Level.WARNING, "Unauthorized error while confirmResetPassword", surr);
        throw surr;
      } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "SchoolDataBridge reported an error while confirmResetPassword", e);
      }
    }
    
    return false;
  }

}
