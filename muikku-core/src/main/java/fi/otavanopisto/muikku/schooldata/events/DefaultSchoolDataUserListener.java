package fi.otavanopisto.muikku.schooldata.events;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.users.EnvironmentRoleEntityController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
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
  private OrganizationEntityController organizationEntityController;
  
  public void onSchoolDataUserUpdatedEvent(@Observes SchoolDataUserUpdatedEvent event) {
    Long userEntityId = event.getUserEntityId();
    SchoolDataIdentifier defaultIdentifier = event.getDefaultIdentifier();

    List<SchoolDataUserEventIdentifier> discoveredIdentifiers = event.getDiscoveredIdentifiers();
    List<SchoolDataUserEventIdentifier> updatedIdentifiers = event.getUpdatedIdentifiers();
    List<SchoolDataUserEventIdentifier> removedIdentifiers = event.getRemovedIdentifiers();
    
    Collection<String> allEmails = event.getAllEmails().stream().map(UserEmail::getAddress).collect(Collectors.toList());
    if (allEmails.isEmpty()) {
      logger.warning("Updating user without email addresses");
    }
    else {
      // Attempt to find existing users by given emails
      Collection<UserEntity> emailUsers = userEntityController.listUserEntitiesByEmails(allEmails);
      if (emailUsers.isEmpty()) {
        // Could not find any users with given emails
      } else if (emailUsers.size() > 1) {
        logger.log(Level.SEVERE, String.format("Multiple users found with given emails (%s)", StringUtils.join(allEmails, ',')));
        return;
      } else {
        UserEntity emailUser = emailUsers.iterator().next();
        if (userEntityId != null) {
          if (!emailUser.getId().equals(userEntityId)) {
            logger.log(Level.SEVERE, String.format("One or more of emails %s belong to another user", StringUtils.join(allEmails, ',')));
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
      for (SchoolDataUserEventIdentifier eventIdentifier : discoveredIdentifiers) {
        SchoolDataIdentifier identifier = eventIdentifier.getIdentifier();

        List<EnvironmentRoleEntity> environmentRoleEntities = new ArrayList<>();
        for (SchoolDataIdentifier environmentRoleIdentifier : eventIdentifier.getEnvironmentRoleIdentifiers()) {
          EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findBy(environmentRoleIdentifier);
          if (environmentRoleEntity != null) {
            environmentRoleEntities.add(environmentRoleEntity);
          }
        }

        OrganizationEntity organizationEntity = eventIdentifier.getOrganizationIdentifier() == null ? null :
          organizationEntityController.findBy(eventIdentifier.getOrganizationIdentifier());
        
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifierIncludeArchived(
            identifier.getDataSource(), identifier.getIdentifier());
        if (userSchoolDataIdentifier == null) {
          userSchoolDataIdentifier = userSchoolDataIdentifierController.createUserSchoolDataIdentifier(
              identifier.getDataSource(), identifier.getIdentifier(), userEntity, environmentRoleEntities, organizationEntity);
          logger.log(Level.FINE, String.format("Added new identifier %s for user %d", identifier, userEntity.getId()));
        }
        else if (userSchoolDataIdentifier.getArchived()) {
          userSchoolDataIdentifierController.unarchiveUserSchoolDataIdentifier(userSchoolDataIdentifier);
        }
        
        userEmailEntityController.setUserEmails(userSchoolDataIdentifier, getValidEmails(eventIdentifier.getEmails()));
        userSchoolDataIdentifierController.setUserIdentifierRoles(userSchoolDataIdentifier, environmentRoleEntities);
        userSchoolDataIdentifierController.setUserIdentifierOrganization(userSchoolDataIdentifier, organizationEntity);
      }
      
      for (SchoolDataUserEventIdentifier eventIdentifier : updatedIdentifiers) {
        SchoolDataIdentifier identifier = eventIdentifier.getIdentifier();
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifierIncludeArchived(
            identifier.getDataSource(), identifier.getIdentifier());
        OrganizationEntity organizationEntity = eventIdentifier.getOrganizationIdentifier() == null ? null :
          organizationEntityController.findBy(eventIdentifier.getOrganizationIdentifier());
        
        List<UserEmail> emails = eventIdentifier.getEmails();
        
        List<EnvironmentRoleEntity> environmentRoleEntities = new ArrayList<>();
        for (SchoolDataIdentifier environmentRoleIdentifier : eventIdentifier.getEnvironmentRoleIdentifiers()) {
          EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findBy(environmentRoleIdentifier);
          if (environmentRoleEntity != null) {
            environmentRoleEntities.add(environmentRoleEntity);
          }
        }

        userEmailEntityController.setUserEmails(eventIdentifier.getIdentifier(), getValidEmails(emails));
        userSchoolDataIdentifierController.setUserIdentifierRoles(userSchoolDataIdentifier, environmentRoleEntities);
        userSchoolDataIdentifierController.setUserIdentifierOrganization(userSchoolDataIdentifier, organizationEntity);
      }
      
      for (SchoolDataUserEventIdentifier eventIdentifier : removedIdentifiers) {
        List<UserEmail> emails = eventIdentifier.getEmails();
        userEmailEntityController.setUserEmails(eventIdentifier.getIdentifier(), getValidEmails(emails));
      }
    }

    // Remove identifiers in the removed list
    for (SchoolDataUserEventIdentifier eventIdentifier : removedIdentifiers) {
      SchoolDataIdentifier identifier = eventIdentifier.getIdentifier();
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(identifier);
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
      boolean isArchived = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity).isEmpty();
      if (isArchived && !userEntity.getArchived()) {
        logger.log(Level.INFO, String.format("UserEntity #%d has no identities left, archiving userEntity", userEntity.getId()));
        userEntityController.archiveUserEntity(userEntity);
      } else if (!isArchived && userEntity.getArchived()) {
        logger.log(Level.INFO, String.format("UserEntity #%d has identities but was archived, unarchiving userEntity", userEntity.getId()));
        userEntityController.unarchiveUserEntity(userEntity);
      }
    }
    
  }
  
  private List<UserEmail> getValidEmails(List<UserEmail> userEmails) {
    List<UserEmail> result = new ArrayList<>();
    if (userEmails != null && !userEmails.isEmpty()) {
      for (UserEmail userEmail : userEmails) {
        if (!validEmail(userEmail.getAddress())) {
          logger.log(Level.SEVERE, String.format("Found invalid email address (%s), removed from synchronization", userEmail.getAddress()));
        } else {
          result.add(userEmail);
        }
      }
    }
    return result;
  }
  
  private boolean validEmail(String email) {
    return EmailValidator.getInstance().isValid(email);
  }

}
