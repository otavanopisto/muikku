package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.EnvironmentUserDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.UserRole;

@Stateless
@Dependent
public class UserRoleSchoolDataEntityInitializer implements SchoolDataUserRoleInitializer {

	@Inject
	private Logger logger;
	
	@Inject
	private RoleController roleController;
	
	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

	@Inject
	private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

	@Inject
	private EnvironmentUserDAO environmentUserDAO;

  @Override
  public List<UserRole> init(List<UserRole> userRoles) {
    List<UserRole> result = new ArrayList<>(userRoles.size());
    
    for (UserRole userRole : userRoles) {
      userRole = init(userRole);
      if (userRole != null) {
        result.add(userRole);
      }
    }
    
    return result;
  }
  
  private UserRole init(UserRole userRole) {
    // Find data source entity
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(userRole.getSchoolDataSource());
    if (dataSource != null) {
      // ... and SchoolDataIdentifier for the user
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, userRole.getUserIdentifier());
      if (userSchoolDataIdentifier != null) {
        // ... and EnvironmentUser
        
        Role role = roleController.findRole(dataSource, userRole.getRoleIdentifier());
        if (role != null) {
          EnvironmentRoleEntity roleEntity = roleController.findEnvironmentRoleEntity(role);
          if (roleEntity != null) {
            EnvironmentUser environmentUser = environmentUserDAO.findByUserAndArchived(userSchoolDataIdentifier.getUserEntity(), Boolean.FALSE);
            if (environmentUser != null) {
              // If environment user is found, we just need to update the role
              environmentUserDAO.updateRole(environmentUser, roleEntity);
            } else {
              // If environment user does not exist we create new with given role
              environmentUserDAO.create(userSchoolDataIdentifier.getUserEntity(), roleEntity);
            }
            
            return userRole;
          } else {
            logger.severe("Could not init role of user " + userRole.getUserIdentifier() + " because role entity does not exist");
          }
        } else {
          logger.severe("Could not init role of user " + userRole.getUserIdentifier() + " because role could not be resolved");
        }
      } else {
        logger.severe("Could not init role of user " + userRole.getUserIdentifier() + " because school data identifier could not be found");
      }
    } else {
      logger.severe("Could not find dataSource " + userRole.getSchoolDataSource());
    }
    
    return null;
  }

  @Override
  public int getPriority() {
    return SchoolDataEntityInitializer.PRIORITY_HIGHEST;
  }

}
