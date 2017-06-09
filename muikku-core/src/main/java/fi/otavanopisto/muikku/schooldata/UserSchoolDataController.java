package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;

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
      return userBridge.createUser(firstName, lastName);
    }

    return null;
  }

  public User findUser(SchoolDataSource schoolDataSource, String userIdentifier) {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findUser(userIdentifier);
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
      return schoolDataBridge.findActiveUser(identifier);
    }

    return null;
  }

  public List<User> listUsers() {
    // TODO: This method WILL cause performance problems, replace with something more sensible

    List<User> result = new ArrayList<User>();

    for (UserSchoolDataBridge userBridge : getUserBridges()) {
      try {
        result.addAll(userBridge.listUsers());
      } catch (SchoolDataBridgeInternalException e) {
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
      result.addAll(userBridge.listUsersByEmail(email));
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
        return schoolDataBridge.listUserEmailsByUserIdentifier(user.getIdentifier());
      }
    }

    return null;
  }

  public List<UserEmail> listUserEmails(SchoolDataIdentifier userIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userIdentifier.getDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listUserEmailsByUserIdentifier(userIdentifier.getIdentifier());
      }
    }

    return null;
  }

  public UserEmail findUserEmail(SchoolDataSource schoolDataSource, String identifier) {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findUserEmail(identifier);
    }

    return null;
  }
  
  /* User properties */

  public List<UserProperty> listUserProperties(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listUserPropertiesByUser(user.getIdentifier());
      }
    }
    return null;
  }
  
  public UserProperty getUserProperty(User user, String key) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.getUserProperty(user.getIdentifier(), key);
      }
    }
    return null;
  }

  public UserProperty setUserProperty(User user, String key, String value) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.setUserProperty(user.getIdentifier(), key, value);
      }
    }
    return null;
  }

  /* Roles */

  public Role findRole(SchoolDataSource schoolDataSource, String identifier) {
    UserSchoolDataBridge userBridge = getUserBridge(schoolDataSource);
    if (userBridge != null) {
      return userBridge.findRole(identifier);
    } else {
      logger.severe("Could not find userBridge for school data source " + schoolDataSource.getIdentifier());
    }

    return null;
  }

  public List<Role> listRoles() {
    List<Role> result = new ArrayList<>();

    for (UserSchoolDataBridge userBridge : getUserBridges()) {
      result.addAll(userBridge.listRoles());
    }

    return result;
  }

  public Role findUserEnvironmentRole(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.findUserEnvironmentRole(user.getIdentifier());
      }
    }

    return null;
  }

  /* UserGroups */

  public UserGroup findUserGroup(SchoolDataSource schoolDataSource, String identifier) {
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.findUserGroup(identifier);
      }
    }
    return null;
  }

  public List<UserGroup> listUserGroups(SchoolDataSource schoolDataSource) {
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listUserGroups();
      }
    }
    return null;
  }

  /* Group users */

  public GroupUser findGroupUser(SchoolDataSource schoolDataSource, String groupIdentifier, String identifier) {
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.findGroupUser(groupIdentifier, identifier);
      }
    }
    return null;
  }
  
  public List<GroupUser> listGroupUsersByGroup(UserGroup userGroup){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userGroup.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listGroupUsersByGroup(userGroup.getIdentifier());
      }
    }
    return null;
  }

  public List<GroupUser> listGroupUsersByGroupAndType(UserGroup userGroup, GroupUserType type){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userGroup.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listGroupUsersByGroupAndType(userGroup.getIdentifier(), type);
      }
    }
    return null;
  }
  
  public List<UserAddress> listUserAddressses(SchoolDataIdentifier userIdentifier){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userIdentifier.getDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listUserAddresses(userIdentifier);
      }
    }
    
    return null;
  }
  
  public void updateUser(User user) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        schoolDataBridge.updateUser(user);
      }
    }
  }
	
	public void updateUserAddress(
      SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier addressIdentifier,
      String street,
      String postalCode,
      String city,
      String country
  ) throws SchoolDataBridgeUnauthorizedException {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(addressIdentifier.getDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        schoolDataBridge.updateUserAddress(
            studentIdentifier,
            addressIdentifier,
            street,
            postalCode,
            city,
            country);
      }
    }
	}
  
  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier){
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(userIdentifier.getDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listUserPhoneNumbers(userIdentifier);
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
    return userBridge.findUser(identifier);
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
        return schoolDataBridge.findUsername(user.getIdentifier());
      }
    }
    
    return null;
	}
	
	public void updateUserCredentials(User user, String oldPassword, String newUsername, String newPassword) throws SchoolDataBridgeUnauthorizedException {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
    if (schoolDataSource != null) {
      UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        schoolDataBridge.updateUserCredentials(user.getIdentifier(), oldPassword, newUsername, newPassword);
      }
    }
	}
	
  public String requestPasswordResetByEmail(SchoolDataSource schoolDataSource, String email) throws SchoolDataBridgeUnauthorizedException {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.requestPasswordResetByEmail(email);
    }
    
    return null;
  }

  public boolean confirmResetPassword(SchoolDataSource schoolDataSource, String resetCode, String newPassword) throws SchoolDataBridgeUnauthorizedException {
    UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.confirmResetPassword(resetCode, newPassword);
    }
    
    return false;
  }

}
