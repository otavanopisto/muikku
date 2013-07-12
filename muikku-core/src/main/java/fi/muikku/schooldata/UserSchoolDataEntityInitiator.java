package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.schooldata.entity.User;

@Stateless
@Dependent
@SchoolDataBridgeEntityInitiator ( entity = User.class )
public class UserSchoolDataEntityInitiator implements SchoolDataEntityInitiator<User> {

	@Inject
	private Logger logger;
	
	@Inject
	private UserEntityDAO userEntityDAO;

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

	@Inject
	private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;
	
	@Override
	public User single(User user) {
	  // Find data source entity
		SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(user.getSchoolDataSource());
		
		// Try to find school data identifier for the user
		UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, user.getIdentifier());
		if (userSchoolDataIdentifier == null) {
			// If school data identifier does not exist, we need to create new UserEntity and bind it to identifier
			UserEntity userEntity = userEntityDAO.create(Boolean.FALSE);
			userSchoolDataIdentifier = userSchoolDataIdentifierDAO.create(dataSource, user.getIdentifier(), userEntity);
		}
		
		return user;
	}

	@Override
	public List<User> list(List<User> users) {
		List<User> result = new ArrayList<>(users.size());
		
		for (User user : users) {
			user = single(user);
			if (user != null) {
			  result.add(user);
			}
		}
		
		return result;
	}

}
