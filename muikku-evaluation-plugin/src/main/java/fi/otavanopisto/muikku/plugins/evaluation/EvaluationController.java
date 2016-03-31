package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.ContentNode;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialException;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.users.UserEntityController;

public class EvaluationController {

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceMaterialEvaluationDAO workspaceMaterialEvaluationDAO;
  
  @Inject
  private UserEntityController userEntityController;

  public WorkspaceMaterialEvaluation createOrUpdateWorkspaceMaterialEvaluation(UserEntity student, WorkspaceMaterial workspaceMaterial, GradingScale gradingScale, GradingScaleItem grade, UserEntity assessor, Date evaluated, String verbalAssessment) {
    WorkspaceMaterialEvaluation evaluation = workspaceMaterialEvaluationDAO.findByWorkspaceMaterialIdAndStudentEntityId(
        workspaceMaterial.getId(),
        student.getId());
    
    if (evaluation == null) {
      evaluation = workspaceMaterialEvaluationDAO.create(student.getId(), 
          workspaceMaterial.getId(),  
          gradingScale.getIdentifier(), 
          gradingScale.getSchoolDataSource(), 
          grade.getIdentifier(), 
          grade.getSchoolDataSource(), 
          assessor.getId(), 
          evaluated, 
          verbalAssessment);
    } else {
      evaluation = workspaceMaterialEvaluationDAO.update(
          evaluation,
          gradingScale.getIdentifier(), 
          gradingScale.getSchoolDataSource(), 
          grade.getIdentifier(), 
          grade.getSchoolDataSource(), 
          assessor.getId(), 
          evaluated, 
          verbalAssessment);
    }
    
    WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, student);
    WorkspaceMaterialReplyState state = grade.isPassingGrade() ? WorkspaceMaterialReplyState.PASSED : WorkspaceMaterialReplyState.FAILED;
    if (reply == null) {
      workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, state, student);
    } else {
      workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, state);
    }
    
    return evaluation;
  }
  
  public void deleteWorkspaceMaterialEvaluation(WorkspaceMaterialEvaluation evaluation) {
    if (evaluation != null) {
      workspaceMaterialEvaluationDAO.delete(evaluation);
    }
  }
  
  public WorkspaceMaterialEvaluation findWorkspaceMaterialEvaluation(Long id) {
    return workspaceMaterialEvaluationDAO.findById(id);
  }
  
  public WorkspaceMaterialEvaluation findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(WorkspaceMaterial workspaceMaterial, UserEntity student) {
    return workspaceMaterialEvaluationDAO.findByWorkspaceMaterialIdAndStudentEntityId(workspaceMaterial.getId(), student.getId());
  }
  
  public List<WorkspaceMaterialEvaluation> listWorkspaceMaterialEvaluationsByWorkspaceMaterialId(Long workspaceMaterialId){
    return workspaceMaterialEvaluationDAO.listByWorkspaceMaterialId(workspaceMaterialId);
  }
  
  public WorkspaceMaterialEvaluation updateWorkspaceMaterialEvaluation(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, GradingScale gradingScale, GradingScaleItem grade, UserEntity assessor, Date evaluated, String verbalAssessment) {
    workspaceMaterialEvaluationDAO.updateGradingScaleIdentifier(workspaceMaterialEvaluation, gradingScale.getIdentifier());
    workspaceMaterialEvaluationDAO.updateGradingScaleSchoolDataSource(workspaceMaterialEvaluation, gradingScale.getSchoolDataSource());
    workspaceMaterialEvaluationDAO.updateVerbalAssessment(workspaceMaterialEvaluation, verbalAssessment);
    workspaceMaterialEvaluationDAO.updateGradeIdentifier(workspaceMaterialEvaluation, grade.getIdentifier());
    workspaceMaterialEvaluationDAO.updateGradeSchoolDataSource(workspaceMaterialEvaluation, grade.getSchoolDataSource());
    workspaceMaterialEvaluationDAO.updateAssessorEntityId(workspaceMaterialEvaluation, assessor.getId());
    workspaceMaterialEvaluationDAO.updateEvaluated(workspaceMaterialEvaluation, evaluated);
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialEvaluation.getWorkspaceMaterialId());
    UserEntity student = userEntityController.findUserEntityById(workspaceMaterialEvaluation.getStudentEntityId());
    
    WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, student);
    WorkspaceMaterialReplyState state = grade.isPassingGrade() ? WorkspaceMaterialReplyState.PASSED : WorkspaceMaterialReplyState.FAILED;
    if (reply == null) {
      workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, state, student);
    } else {
      workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, state);
    }
    
    return workspaceMaterialEvaluation;
  }

  public List<ContentNode> getAssignmentContentNodes(WorkspaceEntity workspaceEntity, boolean processHtml) throws WorkspaceMaterialException {
    List<ContentNode> result = new ArrayList<>();
    addAssignmentNodes(workspaceMaterialController.listVisibleEvaluableWorkspaceMaterialsAsContentNodes(workspaceEntity, processHtml), result);
    return result;
  }
  
  private void addAssignmentNodes(List<ContentNode> contentNodes, List<ContentNode> result) {
    for (ContentNode contentNode : contentNodes) {
      if (contentNode.getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED) {
        result.add(contentNode);
      } else {
        addAssignmentNodes(contentNode.getChildren(), result);
      }
    }
  }
  
}
