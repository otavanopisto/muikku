package fi.otavanopisto.muikku.schooldata.events;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.RoleSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.users.EnvironmentRoleEntityController;
import fi.otavanopisto.muikku.users.RoleSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceRoleEntityController;

public class DefaultSchoolDataRoleListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private EnvironmentRoleEntityController environmentRoleEntityController;
  
  @Inject
  private WorkspaceRoleEntityController workspaceRoleEntityController;

  @Inject
  private RoleSchoolDataIdentifierController roleSchoolDataIdentifierController;
  
  @PostConstruct
  public void init() {
    discoveredWorkspaceRoles = new HashMap<>();
    discoveredEnvironmentRoles = new HashMap<>();
  }
  
  public void onSchoolDataEnvironmentRoleDiscoveredEvent(@Observes SchoolDataEnvironmentRoleDiscoveredEvent event) {
    String discoverId = "ER-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredEnvironmentRoles.containsKey(discoverId)) {
      event.setDiscoveredEnvironmentRoleEntityId(discoveredEnvironmentRoles.get(discoverId));
      return;
    }
    
    EnvironmentRoleEntity environmentRoleEntity = environmentRoleEntityController.findEnvironmentRoleEntity(event.getDataSource(), event.getIdentifier());
    if (environmentRoleEntity == null) {
      EnvironmentRoleArchetype roleArchetype = EnvironmentRoleArchetype.valueOf(event.getArchetype().name());
      environmentRoleEntity = environmentRoleEntityController.createEnvironmentRoleEntity(event.getDataSource(), event.getIdentifier(), roleArchetype, event.getName());
      discoveredEnvironmentRoles.put(discoverId, environmentRoleEntity.getId());
      event.setDiscoveredEnvironmentRoleEntityId(environmentRoleEntity.getId());
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
    String discoverId = "WSR-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredWorkspaceRoles.containsKey(discoverId)) {
      event.setDiscoveredWorkspaceRoleEntityId(discoveredWorkspaceRoles.get(discoverId));
      return;
    }
    
    WorkspaceRoleEntity workspaceRoleEntity = workspaceRoleEntityController.findWorkspaceRoleEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceRoleEntity == null) {
      WorkspaceRoleArchetype roleArchetype = WorkspaceRoleArchetype.valueOf(event.getArchetype().name());
      workspaceRoleEntity = workspaceRoleEntityController.createWorkspaceRoleEntity(event.getDataSource(), event.getIdentifier(), roleArchetype, event.getName());
      discoveredWorkspaceRoles.put(discoverId, workspaceRoleEntity.getId());
      event.setDiscoveredWorkspaceRoleEntityId(workspaceRoleEntity.getId());
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

  private Map<String, Long> discoveredEnvironmentRoles;
  private Map<String, Long> discoveredWorkspaceRoles;
}
