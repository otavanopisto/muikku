package fi.otavanopisto.muikku.controller;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.CourseIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;

@RequestScoped
@Named ("Workspace")
public class GenericWorkspaceController {

  @Inject
  private WorkspaceController workspaceController;
  
  /* Workspace */

  public Workspace findWorkspace(WorkspaceEntity workspaceEntity) {
    return workspaceController.findWorkspace(workspaceEntity);
  }

  public List<Workspace> listWorkspaces() {
    return workspaceController.listWorkspaces();
  }

  public List<Workspace> listWorkspacesByCourseIdentifier(CourseIdentifier courseIdentifier) {
    return workspaceController.listWorkspacesByCourseIdentifier(courseIdentifier);
  }
  
  /* Workspace Entity */
  
  public WorkspaceEntity findWorkspaceEntity(Workspace workspace) {
    return workspaceController.findWorkspaceEntity(workspace);
  }
  
  public WorkspaceEntity findWorkspaceEntityById(Long workspaceId) {
    return workspaceController.findWorkspaceEntityById(workspaceId);
  }

  public WorkspaceEntity findWorkspaceEntityByUrlName(String urlName) {
    return workspaceController.findWorkspaceEntityByUrlName(urlName);
  }

  /* WorkspaceUsers */
  
  public List<WorkspaceUser> listWorkspaceUsers(Workspace workspace) {
    return workspaceController.listWorkspaceUsers(workspace);
  }

  public List<WorkspaceUser> listWorkspaceUsers(WorkspaceEntity workspaceEntity) {
    return workspaceController.listWorkspaceUsers(workspaceEntity);
  }

  public int countWorkspaceUsers(WorkspaceEntity workspaceEntity) {
    return workspaceController.countWorkspaceUsers(workspaceEntity);
  }

}
