package fi.muikku.plugins.internallogin;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.internallogin.dao.InternalAuthDAO;
import fi.muikku.plugins.internallogin.model.InternalAuth;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;

@Dependent
@Stateful
public class InternalLoginController {
	
	@Inject
	private Logger logger;
	
	@Inject
	private InternalAuthDAO internalAuthDAO;
	
	@Inject
  private UserController userController;
	
	public UserEntity findUserByEmailAndPassword(String email, String password) {
		try {
			UserEntity userEntity = findUserEntityByEmail(email);
			if (userEntity != null) {
	    	String passwordHash = DigestUtils.md5Hex(password);
	    	InternalAuth internalAuth = internalAuthDAO.findByUserIdAndPassword(userEntity.getId(), passwordHash);
	    	if (internalAuth != null) {
	    		return userEntity;
	    	}
	  	}
		} catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
			logger.log(Level.SEVERE, "School Data Bridge reported a problem while trying to find user by email", e);
		}

  	return null;
	}
	
  private UserEntity findUserEntityByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
  	UserEntity result = null;
  	
  	List<User> users = userController.listUsersByEmail(email);

  	for (User user : users) {
  		UserEntity userEntity = userController.findUserEntity(user);
  		if (userEntity != null) {
    		if (result == null) {
    			result = userEntity;
    		} else {
    			if (!result.getId().equals(userEntity.getId())) {
    				// TODO: Proper error handling
    				logger.severe("Several UserEntities found with given email: " + email);
    				throw new RuntimeException("Several UserEntities found with given email: " + email);
    			}
    		}
  		}
  	}
  	
  	return result;
  }
  
  public void updateLastLogin(UserEntity userEntity) {
    userController.updateLastLogin(userEntity);
  }

  public boolean confirmUserPassword(UserEntity user, String password) {
    String passwordHash = DigestUtils.md5Hex(password);
    InternalAuth internalAuth = internalAuthDAO.findByUserIdAndPassword(user.getId(), passwordHash);

    return internalAuth != null;
  }
  
}
