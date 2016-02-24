package fi.muikku.schooldata.events;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupUserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.users.UserGroupEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;

public class DefaultSchoolDataUserGroupListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @PostConstruct
  public void init() {
    discoveredUserGroups = new HashMap<>();
    discoveredUserGroupUsers = new HashMap<>();
  }

  private String getUserGroupDiscoveryId(String dataSource, String identifier) {
    return "DUG-" + dataSource + "/" + identifier;
  }
  
  private String getUserGroupUserDiscoveryId(String dataSource, String identifier) {
    return "DUGU-" + dataSource + "/" + identifier;
  }
  
  public void onSchoolDataUserGroupDiscoveredEvent(@Observes SchoolDataUserGroupDiscoveredEvent event) {
    String discoverId = getUserGroupDiscoveryId(event.getDataSource(), event.getIdentifier());
    if (discoveredUserGroups.containsKey(discoverId)) {
      event.setDiscoveredUserGroupEntityId(discoveredUserGroups.get(discoverId));
      return;
    }
    
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier(), true);
    
    if ((userGroupEntity == null) || (userGroupEntity.getArchived())) {
      if (userGroupEntity == null) {
        userGroupEntity = userGroupEntityController.createUserGroupEntity(event.getDataSource(), event.getIdentifier());
      }
      else {
        userGroupEntityController.unarchiveUserGroupEntity(userGroupEntity);
      }
      discoveredUserGroups.put(discoverId, userGroupEntity.getId());
      event.setDiscoveredUserGroupEntityId(userGroupEntity.getId());
    } else {
      logger.warning("UserGroupEntity for " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }  

  public void onSchoolDataUserGroupRemovedEvent(@Observes SchoolDataUserGroupRemovedEvent event) {
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (userGroupEntity != null) {
      userGroupEntityController.archiveUserGroupEntity(userGroupEntity);
    }
  }  

  public void onSchoolDataUserGroupUpdatedEvent(@Observes SchoolDataUserGroupUpdatedEvent event) {
  }  
  
  public void onSchoolDataUserGroupUserDiscoveredEvent(@Observes SchoolDataUserGroupUserDiscoveredEvent event) {
    String discoverId = getUserGroupUserDiscoveryId(event.getDataSource(), event.getIdentifier());
    if (discoveredUserGroupUsers.containsKey(discoverId)) {
      event.setDiscoveredUserGroupUserEntityId(discoveredUserGroupUsers.get(discoverId));
      return;
    }
    
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(event.getUserGroupDataSource(), event.getUserGroupIdentifier(), true);

    if (userGroupEntity != null) {
      if (!userGroupEntity.getArchived()) {
        UserGroupUserEntity userGroupUserEntity = userGroupEntityController.findUserGroupUserEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier(), true);
        
        if ((userGroupUserEntity == null) || (userGroupUserEntity.getArchived())) {
          UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
          if (userSchoolDataIdentifier != null) {
            if (userGroupUserEntity == null) {
              userGroupUserEntity = userGroupEntityController.createUserGroupUserEntity(userGroupEntity, event.getDataSource(), event.getIdentifier(), userSchoolDataIdentifier);
            }
            else {
              userGroupEntityController.unarchiveUserGroupUserEntity(userGroupUserEntity);
              userGroupEntityController.updateUserSchoolDataIdentifier(userGroupUserEntity, userSchoolDataIdentifier);
            }
            discoveredUserGroupUsers.put(discoverId, userGroupUserEntity.getId());
            event.setDiscoveredUserGroupUserEntityId(userGroupUserEntity.getId());
          } else {
            logger.warning("could not add group user because UserSchoolDataIdentifier for " + event.getUserIdentifier() + "/" + event.getUserDataSource() + " wasn't found");
          }
        } else {
          logger.warning("UserGroupUserEntity for " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
        }
      }
    } else {
      logger.warning("could not init user group user because usergroup #" + event.getUserGroupIdentifier() + '/' + event.getUserGroupDataSource() +  " could not be found");
    }
  }  

  public void onSchoolDataUserGroupUserRemovedEvent(@Observes SchoolDataUserGroupUserRemovedEvent event) {
    String discoverId = getUserGroupUserDiscoveryId(event.getDataSource(), event.getIdentifier());
    discoveredUserGroupUsers.remove(discoverId);
    
    UserGroupUserEntity userGroupUserEntity = userGroupEntityController.findUserGroupUserEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (userGroupUserEntity != null) {
      userGroupEntityController.archiveUserGroupUserEntity(userGroupUserEntity);
    }
  }  

  public void onSchoolDataUserGroupUserUpdatedEvent(@Observes SchoolDataUserGroupUserUpdatedEvent event) {
  }  
  
  private Map<String, Long> discoveredUserGroups;
  private Map<String, Long> discoveredUserGroupUsers;
}
