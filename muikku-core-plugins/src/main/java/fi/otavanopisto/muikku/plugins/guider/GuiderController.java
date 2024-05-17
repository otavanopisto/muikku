package fi.otavanopisto.muikku.plugins.guider;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceJournalController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceVisitController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.users.UserEntityController;

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
  
  @Inject 
  private CourseMetaController courseMetaController;
  
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
      }
      else {
        switch (workspaceMaterialReply.getState()) {
          case WITHDRAWN:
            activity.getEvaluables().addAnswered(workspaceMaterialReply.getWithdrawn());
          break;
          case ANSWERED:
            activity.getEvaluables().addAnswered(workspaceMaterialReply.getLastModified());
          break;
          case FAILED:
            activity.getEvaluables().addFailed(workspaceMaterialReply.getSubmitted());
          break;
          case PASSED:
            activity.getEvaluables().addPassed(workspaceMaterialReply.getSubmitted());
          break;
          case SUBMITTED:
            activity.getEvaluables().addSubmitted(workspaceMaterialReply.getSubmitted());
          break;
          case UNANSWERED:
            activity.getEvaluables().addUnanswered();
          break;
          case INCOMPLETE:
            activity.getEvaluables().addIncomplete(workspaceMaterialReply.getLastModified());
          break;
        }
      }
    }
    
    List<WorkspaceMaterial> exerciseAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EXERCISE);
    for (WorkspaceMaterial exerciseAssignment : exerciseAssignments) {
      WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(exerciseAssignment, userEntity);
      if (workspaceMaterialReply == null) {
        activity.getExercises().addUnanswered();
      }
      else {
        switch (workspaceMaterialReply.getState()) {
          case UNANSWERED:
          case ANSWERED:
          case WITHDRAWN:
            activity.getExercises().addUnanswered();
          break;
          case PASSED:
          case FAILED:
          case SUBMITTED:
          case INCOMPLETE:
            activity.getExercises().addAnswered(workspaceMaterialReply.getSubmitted());
          break;
        }
      }
    }
    
    return activity;
  }
  
  public String getCurriculumName(SchoolDataIdentifier curriculumIdentifier) {
    if (curriculumIdentifier != null) {
      Curriculum curriculum = courseMetaController.findCurriculum(curriculumIdentifier);
      return curriculum == null ? null : curriculum.getName();
    }
    return null;
  }

}
