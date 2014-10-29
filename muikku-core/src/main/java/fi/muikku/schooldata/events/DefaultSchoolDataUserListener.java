package fi.muikku.schooldata.events;

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.users.EnvironmentRoleEntityController;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserEmailEntityController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;

public class DefaultSchoolDataUserListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private EnvironmentRoleEntityController environmentRoleEntityController;

  @Inject
  private EnvironmentUserController environmentUserController;
  
  public void onSchoolDataUserDiscoveredEvent(@Observes SchoolDataUserDiscoveredEvent event) {
    if (userEntityController.findUserEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()) == null) {
      // User does not yet exist on the database
      
      List<UserEntity> emailUsers = userEntityController.listUserEntitiesByEmails(event.getEmails());
      if (emailUsers.size() > 1) {
        // TODO: Better exception handling
        throw new RuntimeException("Multiple users found by emails");
      }
      
      UserEntity userEntity = null;
      if (emailUsers.size() == 1) {
        // Matching user found, attach identity
        userEntity = emailUsers.get(0);
        userSchoolDataIdentifierController.createUserSchoolDataIdentifier(event.getDataSource(), event.getIdentifier(), userEntity);
      } else {
        userEntity = userEntityController.createUserEntity(event.getDataSource(), event.getIdentifier());
        userSchoolDataIdentifierController.createUserSchoolDataIdentifier(event.getDataSource(), event.getIdentifier(), userEntity);
      }
      
      List<String> existingAddresses = userEmailEntityController.listAddressesByUserEntity(userEntity);
      for (String email : event.getEmails()) {
        if (!existingAddresses.contains(email)) {
          userEmailEntityController.addUserEmail(userEntity, email);
        }
      }
    }
  }
  
  public void onSchoolDataUserEnvironmentRoleDiscoveredEvent(@Observes SchoolDataUserEnvironmentRoleDiscoveredEvent event) {
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
    if (userEntity != null) {
      EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findEnvironmentRoleEntity(event.getRoleDataSource(), event.getRoleIdentifier());
      if (environmentRoleEntity != null) {
        EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
        if (environmentUser == null) {
          environmentUserController.createEnvironmentUserRole(userEntity, environmentRoleEntity);
        } else {
          environmentUserController.updateEnvironmentUserRole(environmentUser, environmentRoleEntity);
        }
      } else {
        logger.warning("Could not add environment role " + event.getRoleIdentifier() + '/' + event.getRoleDataSource() + " to user because it does not exist");
      }
    } else {
      logger.warning("Could not add new role to user " + event.getUserIdentifier() + '/' + event.getUserDataSource() + " because it does not exist");
    }
  }

}
