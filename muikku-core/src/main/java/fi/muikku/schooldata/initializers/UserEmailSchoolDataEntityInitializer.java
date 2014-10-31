package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserEmailEntityDAO;
import fi.muikku.dao.users.UserEmailSchoolDataIdentifierDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.UserEmail;

@Stateless
@Dependent
public class UserEmailSchoolDataEntityInitializer implements SchoolDataUserEmailInitializer {
	
  @Inject
  private Logger logger;
  
  @Inject
  private UserEmailEntityDAO userEmailEntityDAO;
  
  @Inject
  private UserController userController;
  
	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;
	
	@Inject
	private UserEmailSchoolDataIdentifierDAO userEmailSchoolDataIdentifierDAO; 

  @Override
  public List<UserEmail> init(List<UserEmail> emails) {
    List<UserEmail> result = new ArrayList<>(emails.size());
    
    for (UserEmail email : emails) {
      email = init(email);
      if (email != null) {
        result.add(email);
      }
    }
    
    return result;
  }

  private UserEmail init(UserEmail userEmail) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(userEmail.getSchoolDataSource());
    if (dataSource != null) {
      UserEmailEntity userEmailEntity = userController.findUserEmailEntity(userEmail);
      if (userEmailEntity != null) {
        userEmailEntityDAO.updateAddress(userEmailEntity, userEmail.getAddress());
      } else {
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, userEmail.getUserIdentifier());
        if (userSchoolDataIdentifier != null) {
          userEmailEntity = userEmailEntityDAO.create(userSchoolDataIdentifier.getUserEntity(), userEmail.getAddress());
          userEmailSchoolDataIdentifierDAO.create(dataSource, userEmail.getIdentifier(), userEmailEntity);
        } else {
          logger.severe("Could not init email of user " + userEmail.getUserIdentifier() + " because school data identifier could not be found");
        }
      }
      
      return userEmail;
    } else {
      logger.severe("Could not find dataSource " + userEmail.getSchoolDataSource());
    }
    
    return null;
  }

  @Override
  public int getPriority() {
    return SchoolDataEntityInitializer.PRIORITY_HIGHEST;
  }

}
