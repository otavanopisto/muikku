package fi.muikku.schooldata.events;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.users.UserEntityController;

public class DefaultSchoolDataWorkspaceListener {
  
  private static final int MAX_URL_NAME_LENGTH = 30;
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;
  
  public void onSchoolDataWorkspaceDiscoveredEvent(@Observes SchoolDataWorkspaceDiscoveredEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity == null) {
      String urlNameBase = generateWorkspaceUrlName(event.getName());
      String urlName = urlNameBase;
      int urlNameIterator = 1;
      while (true) {
        if (workspaceEntityController.findWorkspaceByUrlName(urlName) == null) {
          break;
        }
        
        urlName = urlNameBase + "_" + (urlNameIterator++); 
      }

      workspaceEntity = workspaceEntityController.createWorkspaceEntity(event.getDataSource(), event.getIdentifier(), urlName);
    } else {
      logger.warning("workspaceEntity #" + event.getDataSource() + '/' + event.getIdentifier() + " already exists");
    }
  }
  
  public void onSchoolDataWorkspaceRemoved(@Observes SchoolDataWorkspaceRemovedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      workspaceEntity = workspaceEntityController.archiveWorkspaceEntity(workspaceEntity);
    } 
  }
  
  public void onSchoolDataWorkspaceUserDiscoveredEvent(@Observes SchoolDataWorkspaceUserDiscoveredEvent event) {
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
    if (userEntity != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
      if (workspaceEntity != null) {
        WorkspaceRoleEntity workspaceUserRole = workspaceController.findWorkspaceRoleEntityByDataSourceAndIdentifier(event.getRoleDataSource(), event.getRoleIdentifier());
        if (workspaceUserRole != null) {
          workspaceController.createWorkspaceUserEntity(userEntity, workspaceEntity, event.getIdentifier(), workspaceUserRole);
        } else {
          logger.warning("could not init workspace user because workspace role #" + event.getRoleIdentifier() + '/' + event.getRoleDataSource() +  " could not be found");
        }
      } else {
        logger.warning("could not init workspace user because workspace entity #" + event.getWorkspaceIdentifier() + '/' + event.getWorkspaceDataSource() +  " could not be found");
      }
    } else {
      logger.warning("could not init workspace user because user entity #" + event.getUserIdentifier() + '/' + event.getUserDataSource() +  " could not be found");
    }
  }
  
  public void onSchoolDataWorkspaceUserRemovedEvent(@Observes SchoolDataWorkspaceUserRemovedEvent event) {
    UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(event.getUserDataSource(), event.getUserIdentifier());
    if (userEntity != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getWorkspaceDataSource(), event.getWorkspaceIdentifier());
      if (workspaceEntity != null) {
        WorkspaceUserEntity workspaceUserEntity = workspaceController.findWorkspaceUserEntityByWorkspaceAndUser(workspaceEntity, userEntity);
        if (workspaceUserEntity != null) {
          workspaceController.archiveWorkspaceUserEntity(workspaceUserEntity);
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
    return StringUtils.substring(StringUtils.replace(StringUtils.stripAccents(StringUtils.lowerCase(StringUtils.trim(StringUtils.normalizeSpace(name)))), " ", "-").replaceAll("-{2,}", "-"), 0, MAX_URL_NAME_LENGTH);
  }
}
