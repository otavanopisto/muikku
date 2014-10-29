package fi.muikku.schooldata.events;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.users.UserEntityController;

public class DefaultSchoolDataWorkspaceListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;
  
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
  
  
  
}
