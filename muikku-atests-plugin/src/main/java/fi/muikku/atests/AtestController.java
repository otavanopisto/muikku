package fi.muikku.atests;

import java.util.List;

import javax.inject.Inject;

import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateRolePermissionDAO;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceSettingsTemplate;
import fi.muikku.model.workspace.WorkspaceSettingsTemplateRolePermission;

public class AtestController {

  @Inject
  private WorkspaceRolePermissionDAO workspaceRolePermissionDAO;

  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;

  @Inject
  private WorkspaceSettingsTemplateDAO workspaceSettingsTemplateDAO;

  @Inject
  private WorkspaceSettingsTemplateRolePermissionDAO workspaceSettingsTemplateRolePermissionDAO;

  public void createWorkspacePermissions(Long workspaceId) {
    WorkspaceSettingsTemplate workspaceSettingsTemplate = workspaceSettingsTemplateDAO.findById(1l);
    List<WorkspaceSettingsTemplateRolePermission> roleTemplate = workspaceSettingsTemplateRolePermissionDAO.listByTemplate(workspaceSettingsTemplate);
  
    WorkspaceEntity workspace = workspaceEntityDAO.findById(workspaceId);
  
    System.out.println("Copy-pasting rolepermissions for workspace " + workspace);

    for (WorkspaceSettingsTemplateRolePermission rp : roleTemplate) {
      if (workspaceRolePermissionDAO.findByRoleAndPermission(workspace, rp.getRole(), rp.getPermission()) == null)
        workspaceRolePermissionDAO.create(workspace, rp.getRole(), rp.getPermission());
    }
  }
}
