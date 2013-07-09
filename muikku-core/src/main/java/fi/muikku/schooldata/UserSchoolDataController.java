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
import fi.muikku.schooldata.entity.User;

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
	@DAO
	private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

	@Inject
	@DAO
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	@DAO
	private UserEntityDAO userEntityDAO;
	
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

	public List<User> listUsersByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<User> result = new ArrayList<User>();
		
		for (UserSchoolDataBridge userBridge : getUserBridges()) {
			User user = userBridge.findUserByEmail(email);
			if (user != null) {
			  result.add(user);
			}
		}
		
		// TODO: This is propably not the best place for this
		ensureUserEntities(result);
		
		return result;
	}
	
	public User findUser(SchoolDataSource schoolDataSource, UserEntity userEntity) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		User user = null;
		
		UserSchoolDataBridge userBridge = getUserBridge(schoolDataSource);
		if (userBridge != null) {
  		UserSchoolDataIdentifier schoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndUserEntity(schoolDataSource, userEntity);
	  	if (schoolDataIdentifier != null) {
	  		user = userBridge.findUser(schoolDataIdentifier.getIdentifier());
		  }
		}
		
		// TODO: This is propably not the best place for this
		ensureUserEntities(Arrays.asList(user));
		
		return user;
	}

	public User findUser(UserEntity userEntity) {
		// TODO: Support multiple source entity merging...
		
		List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierDAO.listByUserEntity(userEntity);
		for (UserSchoolDataIdentifier identifier : identifiers) {
			User user;
			try {
				user = findUser(identifier.getDataSource(), userEntity);
				if (user != null) {
					return user;
				}
			} catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "SchoolDataBridge reported error while finding user", e);
			}
		}

		return null;
	}
	
	public UserEntity findUserEntity(User user) {
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
		UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, user.getIdentifier());
		if (userSchoolDataIdentifier != null) {
			return userSchoolDataIdentifier.getUserEntity();
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
