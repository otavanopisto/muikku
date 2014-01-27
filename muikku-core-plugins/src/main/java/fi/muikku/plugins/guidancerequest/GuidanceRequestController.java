package fi.muikku.plugins.guidancerequest;

import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;

@Dependent
public class GuidanceRequestController {

  @Inject
  private GuidanceRequestDAO guidanceRequestDAO;
  
  @Inject
  private WorkspaceGuidanceRequestDAO workspaceGuidanceRequestDAO;

  @Permit (GuidanceRequestPermissions.CREATE_GUIDANCEREQUEST)
  public GuidanceRequest createGuidanceRequest(UserEntity student, Date date, String message) {
    return guidanceRequestDAO.create(student, date, message);
  }
  
  @Permit (GuidanceRequestPermissions.CREATE_WORKSPACE_GUIDANCEREQUEST)
  public GuidanceRequest createWorkspaceGuidanceRequest(@PermitContext WorkspaceEntity workspaceEntity, UserEntity student, Date date, String message) {
    return workspaceGuidanceRequestDAO.create(workspaceEntity, student, date, message);
  }
  
  @Permit (GuidanceRequestPermissions.LIST_WORKSPACE_GUIDANCEREQUESTS)
  public List<WorkspaceGuidanceRequest> listWorkspaceGuidanceRequestsByWorkspace(@PermitContext WorkspaceEntity workspaceEntity) {
    return workspaceGuidanceRequestDAO.listByWorkspace(workspaceEntity);
  }

  /**
   * TODO: methods that return owned guidancerequests and if the user has managed groups, also the group's users' requests
   */
  
  // TODO rights
  public List<GuidanceRequest> listGuidanceRequestsByStudent(UserEntity student) {
    return guidanceRequestDAO.listByStudent(student);
  }

  public List<WorkspaceGuidanceRequest> listWorkspaceGuidanceRequestsByWorkspaceAndUser(WorkspaceEntity workspaceEntity,
      UserEntity userEntity) {
    return workspaceGuidanceRequestDAO.listByWorkspaceAndUser(workspaceEntity, userEntity);
  }
  
}
