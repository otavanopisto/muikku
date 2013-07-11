package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.Arrays;
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

import fi.muikku.dao.DAO;
import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;

@Dependent
@Stateful
class UserSchoolDataController { 
	
	// TODO: Caching 
	// TODO: Events
	
	@Inject
	private Logger logger;
	
	@Inject
	@Any
	private Instance<UserSchoolDataBridge> userBridges;
	
	@Inject
	@DAO
	private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

	@Inject
	@DAO
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	@DAO
	private UserEntityDAO userEntityDAO;
	
	/* User */

	public User findUser(SchoolDataSource schoolDataSource, UserEntity userEntity) {
		User user = null;
		
		UserSchoolDataBridge userBridge = getUserBridge(schoolDataSource);
		if (userBridge != null) {
  		UserSchoolDataIdentifier schoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndUserEntity(schoolDataSource, userEntity);
	  	if (schoolDataIdentifier != null) {
	  		user = findUserByIdentifier(userBridge, schoolDataIdentifier.getIdentifier());
		  }
		}
		
		if (user != null) {
  		// TODO: This is probably not the best place for this
  		ensureUserEntities(Arrays.asList(user));
  		return user;
		}
		
		return null;
	}
	
	public User findUser(SchoolDataSource schoolDataSource, String userIdentifier) {
		UserSchoolDataBridge schoolDataBridge = getUserBridge(schoolDataSource);
		if (schoolDataBridge != null) {
			try {
				User user = schoolDataBridge.findUser(userIdentifier);
				if (user != null) {
					ensureUserEntities(Arrays.asList(user));					
				}
				return user;
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
		
		// TODO: This is probably not the best place for this
		ensureUserEntities(result);
		
		return result;
	}
	
	public List<User> listUsersByEntity(UserEntity userEntity) {
		List<User> result = new ArrayList<>();
		
		List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierDAO.listByUserEntity(userEntity);
		for (UserSchoolDataIdentifier identifier : identifiers) {
			User user = findUser(identifier.getDataSource(), userEntity);
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
				User user = userBridge.findUserByEmail(email);
				if (user != null) {
				  result.add(user);
				}
			} catch (SchoolDataBridgeRequestException e) {
				logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing users by email", e);
			} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "SchoolDataBridge reported an error while listing users by email", e);
			}
		}
		
		// TODO: This is propably not the best place for this
		ensureUserEntities(result);
		
		return result;
	}
	
	/* User Entity */
	
	public UserEntity findUserEntity(User user) {
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
		UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, user.getIdentifier());
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
	
	/* Roles*/

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
	
	private void ensureUserEntities(List<User> users) {
		for (User user : users) {
			SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
			UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, user.getIdentifier());
			if (userSchoolDataIdentifier == null) {
				UserEntity userEntity = userEntityDAO.create(Boolean.FALSE);
				userSchoolDataIdentifierDAO.create(dataSource, user.getIdentifier(), userEntity);
			}
		}
	}
}
