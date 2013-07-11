package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserGroupDAO;
import fi.muikku.dao.users.UserGroupUserDAO;
import fi.muikku.dao.users.UserPictureDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroup;
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
	private UserGroupDAO userGroupDAO;

	@Inject
	private UserGroupUserDAO userGroupUserDAO;
	
	@Inject
	private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private UserPictureDAO userPictureDAO;
  
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
	
	/* UserGroup */
	
  public Long getUserGroupMemberCount(UserGroup userGroup) {
    return userGroupUserDAO.countByUserGroup(userGroup);
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
}
