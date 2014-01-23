package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.EnvironmentUserDAO;
import fi.muikku.dao.users.UserContactDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserGroupDAO;
import fi.muikku.dao.users.UserGroupUserDAO;
import fi.muikku.dao.users.UserPictureDAO;
import fi.muikku.events.Archived;
import fi.muikku.events.Created;
import fi.muikku.events.Modified;
import fi.muikku.events.UserEntityEvent;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserContact;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroup;
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;

@Dependent
@Stateless
public class UserController {

	@Inject
	private Logger logger;
	
	@Inject
	private UserSchoolDataController userSchoolDataController;

	@Inject
	private UserEntityDAO userEntityDAO;

  @Inject
  private EnvironmentUserDAO environmentUserDAO;
	
	@Inject
	private UserGroupDAO userGroupDAO;

	@Inject
	private UserGroupUserDAO userGroupUserDAO;
	
	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private UserPictureDAO userPictureDAO;
  
  @Inject
  private UserContactDAO userContactDAO;
  
  @Inject
  @Created
  private Event<UserEntityEvent> userCreatedEvent;
  
  @Inject
  @Modified
  private Event<UserEntityEvent> userModifiedEvent;

  @Inject
  @Archived
  private Event<UserEntityEvent> userRemovedEvent;
  
	/* UserEntity */

	public UserEntity findUserEntityById(Long id) {
		return userEntityDAO.findById(id);
	}

	public UserEntity findUserEntity(User user) {
		return userSchoolDataController.findUserEntity(user);
	}

	public Boolean hasPicture(UserEntity user) {
    return userPictureDAO.findUserHasPicture(user);
	}
	
	public List<UserEntity> listUserEntities() {
		return userEntityDAO.listAll();
	}
	
	public void updateLastLogin(UserEntity userEntity) {
	  userEntityDAO.updateLastLogin(userEntity);
	}
	
	/* User */

	public User findUser(SchoolDataSource schoolDataSource, UserEntity userEntity) {
		return userSchoolDataController.findUser(schoolDataSource, userEntity);
	}

	public User findUser(String schoolDataSource, String userIdentifier) {
		return userSchoolDataController.findUser(schoolDataSource, userIdentifier);
	}
	
	public User findUser(UserEntity userEntity) {
		// TODO: Support merging from several sources
		
		List<User> users = userSchoolDataController.listUsersByEntity(userEntity);
		if (users.size() > 0) {
			return users.get(0);
		}
		
		return null;
	}
	
	public List<User> listUsers() {
		return userSchoolDataController.listUsers();
	}

	public List<User> listUsersByEmail(String email) {
		return userSchoolDataController.listUsersByEmail(email);
	}
	
	/* Emails */

	public List<UserEmail> listUserEmails(User user) {
		return userSchoolDataController.listUserEmails(user);
	}
	
	public List<UserContact> listUserContacts(UserEntity userEntity) {
	  return userContactDAO.listAllByUser(userEntity);
	}
	
	/* UserGroup */
	
  public Long getUserGroupMemberCount(UserGroup userGroup) {
    return userGroupUserDAO.countByUserGroup(userGroup);
  }
  
  public List<EnvironmentUser> listEnvironmentUsers() {
    return environmentUserDAO.listAll();
  }
  
  public List<EnvironmentUser> searchUsers(String searchTerm) {
    List<EnvironmentUser> grps = environmentUserDAO.listAll();
    List<EnvironmentUser> filtered = new ArrayList<EnvironmentUser>();
    
    for (EnvironmentUser grp : grps) {
      User user = findUser(grp.getUser());
      
      if (!StringUtils.isEmpty(user.getFirstName()) && !StringUtils.isEmpty(user.getLastName())) {
        if ((user.getFirstName().toLowerCase().contains(searchTerm.toLowerCase())) ||
            (user.getLastName().toLowerCase().contains(searchTerm.toLowerCase())))
          filtered.add(grp);
      }
    }
    
    return filtered;
  }
  
  public List<UserGroup> searchUserGroups(String searchTerm) {
    List<UserGroup> grps = userGroupDAO.listAll();
    List<UserGroup> filtered = new ArrayList<UserGroup>();
    
    for (UserGroup grp : grps) {
      if (grp.getName().toLowerCase().contains(searchTerm.toLowerCase()))
        filtered.add(grp);
    }
    
    return filtered;
  }

  public UserGroup findUserGroup(Long userGroupId) {
    return userGroupDAO.findById(userGroupId);
  }
  
  public List<UserGroupUser> listUserGroupUsers(UserGroup userGroup) {
    return userGroupUserDAO.listByUserGroup(userGroup);
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

  public EnvironmentUser findEnvironmentUserByUserEntity(UserEntity userEntity) {
    return environmentUserDAO.findByUserEntity(userEntity);
  }

}
