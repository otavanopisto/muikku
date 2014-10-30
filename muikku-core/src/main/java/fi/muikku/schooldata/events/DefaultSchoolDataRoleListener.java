package fi.muikku.schooldata.events;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.users.EnvironmentRoleEntityController;
import fi.muikku.users.RoleSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceRoleEntityController;

public class DefaultSchoolDataRoleListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private EnvironmentRoleEntityController environmentRoleEntityController;
  
  @Inject
  private WorkspaceRoleEntityController workspaceRoleEntityController;

  @Inject
  private RoleSchoolDataIdentifierController roleSchoolDataIdentifierController;
  
  public void onSchoolDataEnvironmentRoleDiscoveredEvent(@Observes SchoolDataEnvironmentRoleDiscoveredEvent event) {
    EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findEnvironmentRoleEntity(event.getDataSource(), event.getIdentifier());
    if (environmentRoleEntity == null) {
      EnvironmentRoleArchetype roleArchetype = EnvironmentRoleArchetype.valueOf(event.getArchetype().name());
      environmentRoleEntityController.createEnvironmentRoleEntity(event.getDataSource(), event.getIdentifier(), roleArchetype, event.getName());
    } else {
      logger.warning("EnvironmentRoleEntity for " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
  
  public void onSchoolDataEnvironmentRoleRemoved(@Observes SchoolDataEnvironmentRoleRemovedEvent event) {
    RoleSchoolDataIdentifier roleSchoolDataIdentifier = roleSchoolDataIdentifierController.findRoleSchoolDataIdentifierByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (roleSchoolDataIdentifier != null) {
      roleSchoolDataIdentifierController.deleteRoleSchoolDataIdentifier(roleSchoolDataIdentifier);
    }
  }

  public void onSchoolDataWorkspaceRoleDiscoveredEvent(@Observes SchoolDataWorkspaceRoleDiscoveredEvent event) {
    WorkspaceRoleEntity workspaceRoleEntity = workspaceRoleEntityController.findWorkspaceRoleEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceRoleEntity == null) {
      WorkspaceRoleArchetype roleArchetype = WorkspaceRoleArchetype.valueOf(event.getArchetype().name());
      workspaceRoleEntityController.createWorkspaceRoleEntity(event.getDataSource(), event.getIdentifier(), roleArchetype, event.getName());
    } else {
      logger.warning("WorkspaceRoleEntity for " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
  
  public void onSchoolDataWorkspaceRoleRemoved(@Observes SchoolDataWorkspaceRoleRemovedEvent event) {
    RoleSchoolDataIdentifier roleSchoolDataIdentifier = roleSchoolDataIdentifierController.findRoleSchoolDataIdentifierByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (roleSchoolDataIdentifier != null) {
      roleSchoolDataIdentifierController.deleteRoleSchoolDataIdentifier(roleSchoolDataIdentifier);
    }
  }
  
}
