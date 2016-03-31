package fi.otavanopisto.muikku.schooldata.events;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.users.EnvironmentRoleEntityController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

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
  
  public void onSchoolDataUserUpdatedEvent(@Observes SchoolDataUserUpdatedEvent event) {
    Long userEntityId = event.getUserEntityId();
    SchoolDataIdentifier defaultIdentifier = event.getDefaultIdentifier();

    List<SchoolDataIdentifier> discoveredIdentifiers = event.getDiscoveredIdentifiers();
    List<SchoolDataIdentifier> updatedIdentifiers = event.getUpdatedIdentifiers();
    List<SchoolDataIdentifier> removedIdentifiers = event.getRemovedIdentifiers();

    List<String> emails = new ArrayList<>();
    if (event.getEmails() != null) {
      for (String email : event.getEmails()) {
        if (!validEmail(email)) {
          logger.log(Level.SEVERE, String.format("Found invalid email address (%s), removed from synchronization", email));
        } else {
          emails.add(email);
        }
      }
    }
    
    if (emails.isEmpty()) {
      logger.warning("Updating user without email addresses");
    } else {
      // Attempt to find existing users by given emails
      
      List<UserEntity> emailUsers = userEntityController.listUserEntitiesByEmails(emails);
      if (emailUsers.isEmpty()) {
        // Could not find any users with given emails
      } else if (emailUsers.size() > 1) {
        logger.log(Level.SEVERE, String.format("Multiple users found with given emails (%s)", StringUtils.join(emails, ',')));
        return;
      } else {
        UserEntity emailUser = emailUsers.get(0);
        if (userEntityId != null) {
          if (!emailUser.getId().equals(userEntityId)) {
            logger.log(Level.SEVERE, String.format("One or more of emails %s belong to another user", StringUtils.join(emails, ',')));
            return;
          }
        } else {
          userEntityId = emailUser.getId();
          logger.log(Level.INFO, String.format("Found userEntity (%d) by email, merging user to existing account", userEntityId));
        }
      }
    }

    UserEntity userEntity = null;

    // If it's not an user delete event we need to create / update user into the system
    if (!discoveredIdentifiers.isEmpty() || !updatedIdentifiers.isEmpty()) {
      // UserEntityId has not been defined in the event and could not be found by email, so we create new user
      if (userEntityId == null) {
        userEntity = userEntityController.createUserEntity(defaultIdentifier.getDataSource(), defaultIdentifier.getIdentifier());
      } else {
        // Otherwise we use the existing one
        userEntity = userEntityController.findUserEntityById(userEntityId);
        if (userEntity == null) {
          logger.log(Level.WARNING, "Could not find specified userEntityId %d, aborting synchronization", userEntityId);
          return;
        }
        
        if (defaultIdentifier != null) {
          if (!StringUtils.equals(userEntity.getDefaultIdentifier(), defaultIdentifier.getIdentifier()) || !StringUtils.equals(userEntity.getDefaultSchoolDataSource().getIdentifier(), defaultIdentifier.getDataSource())) {
            logger.log(Level.FINE, String.format("Updating default identifier for user #%d into %s", userEntity.getId(), defaultIdentifier));
            userEntityController.updateDefaultSchoolDataSource(userEntity, defaultIdentifier.getDataSource());
            userEntityController.updateDefaultIdentifier(userEntity, defaultIdentifier.getIdentifier());
          }
        }
      }
      
      // Attach discovered identities to user
      for (SchoolDataIdentifier identifier : discoveredIdentifiers) {
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifierIncludeArchived(
            identifier.getDataSource(),
            identifier.getIdentifier());
        if (userSchoolDataIdentifier == null) {
          userSchoolDataIdentifierController.createUserSchoolDataIdentifier(identifier.getDataSource(), identifier.getIdentifier(), userEntity);
          logger.log(Level.FINE, String.format("Added new identifier %s for user %d", identifier, userEntity.getId()));
        }
        else if (userSchoolDataIdentifier.getArchived()) {
          userSchoolDataIdentifierController.unarchiveUserSchoolDataIdentifier(userSchoolDataIdentifier);
        }
      }
      
      // Update user emails
      userEmailEntityController.setUserEmails(userEntity, emails);

      // Update users environment role
      if (event.getEnvironmentRoleIdentifier() != null) {
        EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findEnvironmentRoleEntity(event.getEnvironmentRoleIdentifier().getDataSource(), event.getEnvironmentRoleIdentifier().getIdentifier());
        if (environmentRoleEntity != null) {
          EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
          if (environmentUser == null) {
            logger.fine(String.format("UserEntity %d did not have an environment user so created new one into role %s", userEntity.getId(), environmentRoleEntity.getName()));
            environmentUserController.createEnvironmentUser(userEntity, environmentRoleEntity);
          } else {
            if (environmentUser.getRole() == null || !environmentUser.getRole().getId().equals(environmentRoleEntity.getId())) {
              logger.fine(String.format("Updated UserEntity %d role into %s", userEntity.getId(), environmentRoleEntity.getName()));
              environmentUserController.updateEnvironmentUserRole(environmentUser, environmentRoleEntity);
            }
          }
        } else {
          logger.severe(String.format("Could not find specified environment role entity %s", event.getEnvironmentRoleIdentifier()));
        }
      } else {
        // Users new role has been set to null which means that we need to remove the environment role from the user
        EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
        if (environmentUser != null) {
          logger.info(String.format("Removed UserEntity %d environment role", userEntity.getId()));
          environmentUserController.updateEnvironmentUserRole(environmentUser, null);
        }
      }
    }

    // Remove identifiers in the removed list
    for (SchoolDataIdentifier identifier : removedIdentifiers) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
      if (userSchoolDataIdentifier != null) {
        logger.log(Level.FINE, String.format("Removing user school data identifier %s", identifier));
        userSchoolDataIdentifierController.archiveUserSchoolDataIdentifier(userSchoolDataIdentifier);
        
        if (userEntity == null) {
          userEntity = userSchoolDataIdentifier.getUserEntity();
        }
      }
    }

    // Finally check if user has any identifiers left, if not archive the user from the system
    if (userEntity != null) {
      if (userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity).isEmpty()) {
        logger.log(Level.INFO, String.format("UserEntity #%d has no identities left, archiving userEntity", userEntity.getId()));
        userEntityController.archiveUserEntity(userEntity);
      }
    }
    
  }
  
  private boolean validEmail(String email) {
    return EmailValidator.getInstance().isValid(email);
  }

}
