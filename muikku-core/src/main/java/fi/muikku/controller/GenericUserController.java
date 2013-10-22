package fi.muikku.controller;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserContact;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroup;
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;

@RequestScoped
@Named ("User")
public class GenericUserController {

  @Inject
  private UserController userController;
  
	/* UserEntity */

	public UserEntity findUserEntityById(Long id) {
		return userController.findUserEntityById(id);
	}

	public UserEntity findUserEntity(User user) {
		return userController.findUserEntity(user);
	}

	public Boolean hasPicture(UserEntity user) {
    return userController.hasPicture(user);
	}
	
	public List<UserEntity> listUserEntities() {
		return userController.listUserEntities();
	}
	
	/* User */

  public User findUser(SchoolDataSource schoolDataSource, UserEntity userEntity) {
		return userController.findUser(schoolDataSource, userEntity);
	}

	public User findUser(String schoolDataSource, String userIdentifier) {
		return userController.findUser(schoolDataSource, userIdentifier);
	}
	
	public User findUser(UserEntity userEntity) {
		return userController.findUser(userEntity);
	}
	
	public List<User> listUsers() {
		return userController.listUsers();
	}

	public List<User> listUsersByEmail(String email) {
		return userController.listUsersByEmail(email);
	}
	
	/* Emails */

	public List<UserEmail> listUserEmails(User user) {
		return userController.listUserEmails(user);
	}
	
	public List<UserContact> listUserContacts(UserEntity userEntity) {
    return userController.listUserContacts(userEntity);
  }
	
	/* UserGroup */
	
  public Long getUserGroupMemberCount(UserGroup userGroup) {
    return userController.getUserGroupMemberCount(userGroup);
  }
  
  public List<EnvironmentUser> listEnvironmentUsers() {
    return userController.listEnvironmentUsers();
  }
  
  public List<EnvironmentUser> searchUsers(String searchTerm) {
    return userController.searchUsers(searchTerm);
  }
  
  public List<UserGroup> searchUserGroups(String searchTerm) {
    return userController.searchUserGroups(searchTerm);
  }

  public UserGroup findUserGroup(Long userGroupId) {
    return userController.findUserGroup(userGroupId);
  }
  
  public List<UserGroupUser> listUserGroupUsers(UserGroup userGroup) {
    return userController.listUserGroupUsers(userGroup);
  }
  
}
