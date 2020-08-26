package fi.otavanopisto.muikku.schooldata.events;

import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.WorkspaceGroupPermission;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

public class DefaultSchoolDataWorkspaceSignupGroupsListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private PermissionController permissionController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;

  public synchronized void onSchoolDataWorkspaceDiscoveredEvent(@Observes SchoolDataWorkspaceDiscoveredEvent event) {
    if (event.getDiscoveredWorkspaceEntityId() != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(event.getDiscoveredWorkspaceEntityId());

      synchronizeWorkspaceSignupPermissions(workspaceEntity);
    }
  }
  
  public void onSchoolDataWorkspaceUpdated(@Observes SchoolDataWorkspaceUpdatedEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      synchronizeWorkspaceSignupPermissions(workspaceEntity);
    } else {
      logger.warning("Updated workspaceEntity #" + event.getDataSource() + '/' + event.getIdentifier() + " could not be found");
    }
  }
  
  private void synchronizeWorkspaceSignupPermissions(WorkspaceEntity workspaceEntity) {
    if (workspaceEntity != null) {
      schoolDataBridgeSessionController.startSystemSession();
      try {
        Set<SchoolDataIdentifier> sourceGroupIdentifiers = workspaceController.listWorkspaceSignupGroups(workspaceEntity);

        Permission permission = permissionController.findByName(MuikkuPermissions.WORKSPACE_SIGNUP);

        List<WorkspaceGroupPermission> muikkuGroupPermissions = permissionController.listByWorkspaceEntityAndPermission(workspaceEntity, permission);
        Set<SchoolDataIdentifier> existingGroupPermissionIdentifiers = muikkuGroupPermissions.stream().map(groupPermission -> groupPermission.getUserGroup().schoolDataIdentifier()).collect(Collectors.toSet());

        // Add groups that exist in source system but not in Muikku
        sourceGroupIdentifiers
          .stream()
          .filter(groupIdentifier -> !existingGroupPermissionIdentifiers.contains(groupIdentifier))
          .forEach(groupIdentifier -> {
            UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(groupIdentifier);
            permissionController.addWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);
          });
        
        
        // Remove groups that exist in Muikku but not in the source system
        existingGroupPermissionIdentifiers
          .stream()
          .filter(existingGroupIdentifier -> !sourceGroupIdentifiers.contains(existingGroupIdentifier))
          .forEach(existingGroupIdentifier -> {
            UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(existingGroupIdentifier);
            WorkspaceGroupPermission workspaceGroupPermission = permissionController.findWorkspaceGroupPermission(workspaceEntity, userGroupEntity, permission);
            permissionController.removeWorkspaceGroupPermission(workspaceGroupPermission);
          });
        
      } finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
    } else {
      logger.warning("Could not list signup groups because workspace entity was null");
    }
  }
  
}
