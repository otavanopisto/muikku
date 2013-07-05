package fi.muikku.plugins.internallogin;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.internallogin.dao.InternalAuthDAO;
import fi.muikku.plugins.internallogin.model.InternalAuth;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;

@Dependent
@Stateful
public class InternalLoginController {
	
	@Inject
	private Logger logger;
	
	@Inject
	private InternalAuthDAO internalAuthDAO;
	
	@Inject
  private UserSchoolDataController userSchoolDataController;
	
	public UserEntity findUserByEmailAndPassword(String email, String password) {
		UserEntity userEntity = findUserEntityByEmail(email);
  	if (userEntity != null) {
    	String passwordHash = DigestUtils.md5Hex(password);
    	InternalAuth internalAuth = internalAuthDAO.findByUserIdAndPassword(userEntity.getId(), passwordHash);
    	if (internalAuth != null) {
    		return userEntity;
    	}
  	}
  	
  	return null;
	}
	
  private UserEntity findUserEntityByEmail(String email) {
  	UserEntity result = null;
  	
  	List<User> users = userSchoolDataController.listUsersByEmail(email);

  	for (User user : users) {
  		UserEntity userEntity = userSchoolDataController.findUserEntity(user);
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
  
  
  
}
