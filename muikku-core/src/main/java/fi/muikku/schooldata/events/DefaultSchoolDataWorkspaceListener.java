package fi.muikku.schooldata.events;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceUserEntityController;

public class DefaultSchoolDataWorkspaceListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @PostConstruct
  public void init() {
    discoveredWorkspaces = new HashMap<>();
    discoveredWorkspaceUsers = new HashMap<>();
  }
  
  public synchronized void onSchoolDataWorkspaceDiscoveredEvent(@Observes SchoolDataWorkspaceDiscoveredEvent event) {
    String discoverId = "WS-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredWorkspaces.containsKey(discoverId)) {
      event.setDiscoveredWorkspaceEntityId(discoveredWorkspaces.get(discoverId));
      return;
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity == null) {
      // workspace url name
      String urlNameBase = generateWorkspaceUrlName(event.getName());
      String urlName = urlNameBase;
      int urlNameIterator = 1;
      while (workspaceEntityController.findWorkspaceByUrlName(urlName) != null) {
        urlName = urlNameBase + "-" + ++urlNameIterator; 
      }
      // workspace
      workspaceEntity = workspaceEntityController.createWorkspaceEntity(event.getDataSource(), event.getIdentifier(), urlName);
      // workspace bookkeeping
      discoveredWorkspaces.put(discoverId, workspaceEntity.getId());
      event.setDiscoveredWorkspaceEntityId(workspaceEntity.getId());
    } else {
      logger.warning("workspaceEntity #" + event.getDataSource() + '/' + event.getIdentifier() + " already exists");
    }
  }
  
  public void onSchoolDataWorkspaceUpdated(@Observes SchoolDataWorkspaceUpdatedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      // TODO: How should we handle the updating of URL names?
    } else {
      logger.warning("Updated workspaceEntity #" + event.getDataSource() + '/' + event.getIdentifier() + " could not be found");
    }
  }
  
  public void onSchoolDataWorkspaceRemoved(@Observes SchoolDataWorkspaceRemovedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      workspaceEntity = workspaceEntityController.archiveWorkspaceEntity(workspaceEntity);
    } 
  }
  
  public synchronized void onSchoolDataWorkspaceUserDiscoveredEvent(@Observes SchoolDataWorkspaceUserDiscoveredEvent event) {
    String discoverId = "WSU-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredWorkspaceUsers.containsKey(discoverId)) {
      event.setDiscoveredWorkspaceUserEntityId(discoveredWorkspaceUsers.get(discoverId));
      return;
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
    if (workspaceEntity != null) {
      WorkspaceRoleEntity workspaceUserRole = workspaceController.findWorkspaceRoleEntityByDataSourceAndIdentifier(event.getRoleDataSource(), event.getRoleIdentifier());
      if (workspaceUserRole != null) {
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
        if (userSchoolDataIdentifier != null) {
          WorkspaceUserEntity workspaceUserEntity = 
              workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(
                  workspaceEntity,
                  userSchoolDataIdentifier);
          if (workspaceUserEntity == null) {
            workspaceUserEntity = workspaceUserEntityController.createWorkspaceUserEntity(userSchoolDataIdentifier, workspaceEntity, event.getIdentifier(), workspaceUserRole);
            discoveredWorkspaceUsers.put(discoverId, workspaceUserEntity.getId());
            event.setDiscoveredWorkspaceUserEntityId(workspaceUserEntity.getId());
          } else {
            workspaceUserEntityController.unArchiveWorkspaceUserEntity(workspaceUserEntity);
          }
        } else {
          logger.warning("could not add workspace user because userSchoolDataIdentifier #" + event.getUserIdentifier() + '/' + event.getUserDataSource() +  " could not be found");
        }
      } else {
        logger.warning("could not init workspace user because workspace role #" + event.getRoleIdentifier() + '/' + event.getRoleDataSource() +  " could not be found");
      }      
    } else {
      logger.warning("could not init workspace user because workspace entity #" + event.getWorkspaceIdentifier() + '/' + event.getWorkspaceDataSource() +  " could not be found"); 
    }
  }

  public void onSchoolDataWorkspaceUserRemovedEvent(@Observes SchoolDataWorkspaceUserRemovedEvent event) {
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
    if (userEntity != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
      if (workspaceEntity != null) {
        WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndIdentifier(workspaceEntity, event.getIdentifier());
        if (workspaceUserEntity != null) {
          workspaceUserEntityController.archiveWorkspaceUserEntity(workspaceUserEntity);
        }
      } else {
        logger.warning("could not remove workspace user because workspace entity #" + event.getWorkspaceIdentifier() + '/' + event.getWorkspaceDataSource() +  " could not be found");
      }
    } else {
      logger.warning("could not remove workspace user because user entity #" + event.getUserIdentifier() + '/' + event.getUserDataSource() +  " could not be found");
    }
  }
  
  /**
   * Generates URL name from workspace name.
   * 
   * @param name original workspace name
   * @return URL name
   */
  private String generateWorkspaceUrlName(String name) {
    // convert to lower-case and replace spaces and slashes with a minus sign
    String urlName = StringUtils.lowerCase(name.replaceAll(" ", "-").replaceAll("/", "-"));
    // truncate consecutive minus signs into just one
    while (urlName.indexOf("--") >= 0) {
      urlName = urlName.replace("--", "-");
    }
    // get rid of accented characters and all special characters other than minus, period, and underscore
    urlName = StringUtils.stripAccents(urlName).replaceAll("[^a-z0-9\\-\\.\\_]", "");
    return urlName;
  }
  
  private Map<String, Long> discoveredWorkspaceUsers;
  private Map<String, Long> discoveredWorkspaces;
}
