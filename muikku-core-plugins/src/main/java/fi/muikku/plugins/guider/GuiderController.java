package fi.muikku.plugins.guider;

import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.WorkspaceJournalController;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.muikku.plugins.workspace.WorkspaceVisitController;
import fi.muikku.plugins.workspace.model.WorkspaceJournalEntry;
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
  
  @Inject
  private WorkspaceVisitController workspaceVisitController;
  
  @Inject
  private WorkspaceJournalController workspaceJournalController;
  
  public GuiderStudentWorkspaceActivity getStudentWorkspaceActivity(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
    if (userEntity == null) {
      return null;
    }

    GuiderStudentWorkspaceActivity activity = new GuiderStudentWorkspaceActivity();
    
    activity.setLastVisit(workspaceVisitController.getLastVisit(workspaceEntity, userEntity));
    activity.setNumVisits(workspaceVisitController.getNumVisits(workspaceEntity, userEntity));
    
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalController.findLatestsEntryByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity);
    if (workspaceJournalEntry != null) {
      activity.setJournalEntryCount(workspaceJournalController.countEntriesByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity));
      activity.setLastJournalEntry(workspaceJournalEntry.getCreated());
    }
    
    List<WorkspaceMaterial> evaluatedAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EVALUATED);
    for (WorkspaceMaterial evaluatedAssignment : evaluatedAssignments) {
      WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(evaluatedAssignment, userEntity);
      if (workspaceMaterialReply == null) {
        activity.getEvaluables().addUnanswered();
      } else {
        switch (workspaceMaterialReply.getState()) {
          case WITHDRAWN:
            activity.getEvaluables().addEvaluated(workspaceMaterialReply.getWithdrawn());
          break;
          case ANSWERED:
            activity.getEvaluables().addAnswered(workspaceMaterialReply.getLastModified());
          break;
          case EVALUATED:
            activity.getEvaluables().addEvaluated(workspaceMaterialReply.getSubmitted());
          break;
          case SUBMITTED:
            activity.getEvaluables().addSubmitted(workspaceMaterialReply.getSubmitted());
          break;
          case UNANSWERED:
            activity.getEvaluables().addUnanswered();
          break;
        }
      }
    }
    
    List<WorkspaceMaterial> exerciseAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EXERCISE);
    for (WorkspaceMaterial exerciseAssignment : exerciseAssignments) {
      WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(exerciseAssignment, userEntity);
      if (workspaceMaterialReply == null) {
        activity.getExcercices().addUnanswered();
      } else {
        switch (workspaceMaterialReply.getState()) {
          case WITHDRAWN:
            activity.getExcercices().addAnswered(workspaceMaterialReply.getWithdrawn());
          break;
          case ANSWERED:
            activity.getExcercices().addAnswered(workspaceMaterialReply.getLastModified());
          break;
          case EVALUATED:
            activity.getExcercices().addAnswered(workspaceMaterialReply.getSubmitted());
          break;
          case SUBMITTED:
            activity.getExcercices().addAnswered(workspaceMaterialReply.getSubmitted());
          break;
          case UNANSWERED:
            activity.getExcercices().addUnanswered();
          break;
        }
      }
    }
    
    return activity;
  }
  
}
