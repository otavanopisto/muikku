package fi.muikku.plugins.progressanalysis;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.users.UserEntityController;

public class StudyActivityAnalysisController {
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  public StudyActivityWorkspaceAnalysis getWorkspaceAssignmentsAnalysis(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
    if (userEntity == null) {
      return null;
    }
    
    long evaluableUnanswered = 0l;
    Date lastEvaluableAssignmentAnswerDate = new Date();
    long evaluableAssignmentAnswered = 0l;
    long evaluableSubmitted = 0l;
    Date lastEvaluableSubmitDate = new Date();
    long evaluableEvaluated = 0l;
    Date lastEvaluableEvaluationDate = new Date();
    long exercisesAswered = 0l;
    long exercisesUnaswered = 0l;
    Date lastExerciseSubmittedDate = new Date();

    List<WorkspaceMaterial> evaluatedAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EVALUATED);
    for (WorkspaceMaterial evaluatedAssignment : evaluatedAssignments) {
      WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(evaluatedAssignment, userEntity);
      if (workspaceMaterialReply == null) {
        evaluableUnanswered++;
      } else {
        switch (workspaceMaterialReply.getState()) {
          case WITHDRAWN:
          case ANSWERED:
            evaluableAssignmentAnswered++;
          break;
          case EVALUATED:
            evaluableEvaluated++;
          break;
          case SUBMITTED:
            evaluableSubmitted++;
          break;
          case UNANSWERED:
            evaluableUnanswered++;
          break;
        }
      }
    }
    
    List<WorkspaceMaterial> exerciseAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EXERCISE);
    for (WorkspaceMaterial exerciseAssignment : exerciseAssignments) {
      WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(exerciseAssignment, userEntity);
      if (workspaceMaterialReply == null) {
        exercisesUnaswered++;
      } else {
        switch (workspaceMaterialReply.getState()) {
          case WITHDRAWN:
          case ANSWERED:
          case EVALUATED:
          case SUBMITTED:
            evaluableSubmitted++;
          break;
          case UNANSWERED:
            exercisesUnaswered++;
          break;
        }
      }
    }
    
    return new StudyActivityWorkspaceAnalysis(evaluableUnanswered, lastEvaluableAssignmentAnswerDate, 
        evaluableAssignmentAnswered, evaluableSubmitted, lastEvaluableSubmitDate, evaluableEvaluated, 
        lastEvaluableEvaluationDate, exercisesUnaswered, exercisesAswered, lastExerciseSubmittedDate);
  }
  
}
