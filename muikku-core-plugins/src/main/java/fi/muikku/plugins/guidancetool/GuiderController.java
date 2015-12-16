package fi.muikku.plugins.guidancetool;

import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.users.UserEntityController;

public class GuiderController {
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  public GuiderStudentWorkspaceActivity getWorkspaceAssignmentsAnalysis(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
    if (userEntity == null) {
      return null;
    }

    GuiderStudentWorkspaceActivity analysis = new GuiderStudentWorkspaceActivity();

    List<WorkspaceMaterial> evaluatedAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EVALUATED);
    for (WorkspaceMaterial evaluatedAssignment : evaluatedAssignments) {
      WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(evaluatedAssignment, userEntity);
      if (workspaceMaterialReply == null) {
        analysis.getEvaluables().addUnanswered();
      } else {
        switch (workspaceMaterialReply.getState()) {
          case WITHDRAWN:
            analysis.getEvaluables().addEvaluated(workspaceMaterialReply.getWithdrawn());
          break;
          case ANSWERED:
            analysis.getEvaluables().addAnswered(workspaceMaterialReply.getLastModified());
          break;
          case EVALUATED:
            analysis.getEvaluables().addEvaluated(workspaceMaterialReply.getSubmitted());
          break;
          case SUBMITTED:
            analysis.getEvaluables().addSubmitted(workspaceMaterialReply.getSubmitted());
          break;
          case UNANSWERED:
            analysis.getEvaluables().addUnanswered();
          break;
        }
      }
    }
    
    List<WorkspaceMaterial> exerciseAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EXERCISE);
    for (WorkspaceMaterial exerciseAssignment : exerciseAssignments) {
      WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(exerciseAssignment, userEntity);
      if (workspaceMaterialReply == null) {
        analysis.getExcercices().addUnanswered();
      } else {
        switch (workspaceMaterialReply.getState()) {
          case WITHDRAWN:
            analysis.getExcercices().addAnswered(workspaceMaterialReply.getWithdrawn());
          break;
          case ANSWERED:
            analysis.getExcercices().addAnswered(workspaceMaterialReply.getLastModified());
          break;
          case EVALUATED:
            analysis.getExcercices().addAnswered(workspaceMaterialReply.getSubmitted());
          break;
          case SUBMITTED:
            analysis.getExcercices().addAnswered(workspaceMaterialReply.getSubmitted());
          break;
          case UNANSWERED:
            analysis.getExcercices().addUnanswered();
          break;
        }
      }
    }
    
    return analysis;
  }
  
}
