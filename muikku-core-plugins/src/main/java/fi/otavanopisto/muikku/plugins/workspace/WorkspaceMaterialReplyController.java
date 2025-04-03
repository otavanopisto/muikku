package fi.otavanopisto.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;

public class WorkspaceMaterialReplyController {

  @Inject
  private WorkspaceMaterialReplyDAO workspaceMaterialReplyDAO;

  @Inject
  private WorkspaceRootFolderDAO workspaceRootFolderDAO;

  @Inject
  private WorkspaceNodeDAO workspaceNodeDAO;

  @Inject
  private ActivityLogController activityLogController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  public WorkspaceMaterialReply createWorkspaceMaterialReply(WorkspaceMaterial workspaceMaterial,
      WorkspaceMaterialReplyState state, UserEntity userEntity, boolean locked) {

    // #5013: Race condition with field save websocket messages might mean this user
    // already has a reply for this page

    WorkspaceMaterialReply reply = findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial,
        userEntity);
    if (reply == null) {
      Date created = new Date();
      Date submitted = state == WorkspaceMaterialReplyState.SUBMITTED ? new Date() : null;
      Date withdrawn = state == WorkspaceMaterialReplyState.WITHDRAWN ? new Date() : null;
      reply = workspaceMaterialReplyDAO.create(workspaceMaterial, state, userEntity.getId(), 1L, created, created,
          submitted, withdrawn, locked);

      // Activity logging

      if (state == WorkspaceMaterialReplyState.SUBMITTED) {
        logAssignmentActivity(userEntity.getId(), workspaceMaterial);
      }
    }

    return reply;
  }

  public WorkspaceMaterialReply findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(
      WorkspaceMaterial workspaceMaterial, UserEntity userEntity) {
    return workspaceMaterialReplyDAO.findByWorkspaceMaterialAndUserEntityId(workspaceMaterial, userEntity.getId());
  }

  public fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply findWorkspaceMaterialReplyById(
      Long workspaceMaterialReplyId) {
    return workspaceMaterialReplyDAO.findById(workspaceMaterialReplyId);
  }

  public List<WorkspaceMaterialReply> listWorkspaceMaterialRepliesByWorkspaceEntity(
      WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    List<WorkspaceMaterialReply> workspaceMaterialReplies = new ArrayList<WorkspaceMaterialReply>();
    WorkspaceRootFolder rootFolder = workspaceRootFolderDAO.findByWorkspaceEntityId(workspaceEntity.getId());
    List<WorkspaceMaterial> workspaceMaterials = new ArrayList<WorkspaceMaterial>();
    appendWorkspaceMaterials(workspaceMaterials, rootFolder);
    WorkspaceMaterialReply reply;
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      reply = findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
      if (reply != null) {
        workspaceMaterialReplies.add(reply);
      }
    }
    return workspaceMaterialReplies;
  }

  public Long getReplyCountByUserEntityAndReplyStatesAndWorkspaceMaterials(Long userEntityId,
      List<WorkspaceMaterialReplyState> replyStates, List<WorkspaceMaterial> materials) {
    return workspaceMaterialReplyDAO.countByUserAndStatesAndMaterials(userEntityId, replyStates, materials);
  }

  private void appendWorkspaceMaterials(List<WorkspaceMaterial> materials, WorkspaceNode workspaceNode) {
    List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParent(workspaceNode);
    for (WorkspaceNode childNode : childNodes) {
      if (childNode instanceof WorkspaceMaterial) {
        materials.add((WorkspaceMaterial) childNode);
      }

      appendWorkspaceMaterials(materials, childNode);
    }
  }

  public List<WorkspaceMaterialReply> listWorkspaceMaterialRepliesByWorkspaceMaterial(
      WorkspaceMaterial workspaceMaterial) {
    return workspaceMaterialReplyDAO.listByWorkspaceMaterial(workspaceMaterial);
  }

  public void deleteWorkspaceMaterialReply(WorkspaceMaterialReply workspaceMaterialReply) {
    workspaceMaterialReplyDAO.delete(workspaceMaterialReply);
  }

  public void incWorkspaceMaterialReplyTries(WorkspaceMaterialReply workspaceMaterialReply) {
    workspaceMaterialReplyDAO.update(workspaceMaterialReply, workspaceMaterialReply.getNumberOfTries() + 1, new Date());
  }

  public WorkspaceMaterialReply updateWorkspaceMaterialReplyModified(
      fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply, Date lastModified) {
    return workspaceMaterialReplyDAO.updateLastModified(workspaceMaterialReply, lastModified);
  }

  public WorkspaceMaterialReply updateWorkspaceMaterialReply(
      fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply,
      WorkspaceMaterialReplyState state) {
    switch (state) {
    case SUBMITTED:
      logAssignmentActivity(workspaceMaterialReply.getUserEntityId(), workspaceMaterialReply.getWorkspaceMaterial());
      workspaceMaterialReplyDAO.updateSubmitted(workspaceMaterialReply, new Date());
      break;
    case WITHDRAWN:
      workspaceMaterialReplyDAO.updateWithdrawn(workspaceMaterialReply, new Date());
      break;
    default:
      break;
    }

    return workspaceMaterialReplyDAO.updateState(workspaceMaterialReply, state);
  }
  
  public WorkspaceMaterialReply updateWorkspaceMaterialReplyLocked(
      fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply,
      boolean locked) {
    return workspaceMaterialReplyDAO.updateLocked(workspaceMaterialReply, locked);
  }

  private void logAssignmentActivity(Long userEntityId, WorkspaceMaterial workspaceMaterial) {
    WorkspaceRootFolder root = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (workspaceMaterial.getAssignmentType() != null) {
      switch (workspaceMaterial.getAssignmentType()) {
      case EVALUATED:
        activityLogController.createActivityLog(userEntityId, ActivityLogType.MATERIAL_ASSIGNMENTDONE,
            root.getWorkspaceEntityId(), null);
        break;
      case EXERCISE:
        activityLogController.createActivityLog(userEntityId, ActivityLogType.MATERIAL_EXERCISEDONE,
            root.getWorkspaceEntityId(), null);
        break;
      default:
        break;
      }
    }
  }
}
