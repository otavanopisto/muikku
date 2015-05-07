package fi.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationDAO;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.muikku.plugins.workspace.ContentNode;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialException;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;

public class EvaluationController {

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceMaterialEvaluationDAO workspaceMaterialEvaluationDAO;

  public WorkspaceMaterialEvaluation createWorkspaceMaterialEvaluation(UserEntity student, WorkspaceMaterial workspaceMaterial, GradingScale gradingScale, GradingScaleItem grade, UserEntity assessor, Date evaluated, String verbalAssessment) {
    return workspaceMaterialEvaluationDAO.create(student.getId(), 
        workspaceMaterial.getId(),  
        gradingScale.getIdentifier(), 
        gradingScale.getSchoolDataSource(), 
        grade.getIdentifier(), 
        grade.getSchoolDataSource(), 
        assessor.getId(), 
        evaluated, 
        verbalAssessment);
  }
  
  public WorkspaceMaterialEvaluation findWorkspaceMaterialEvaluation(Long id) {
    return workspaceMaterialEvaluationDAO.findById(id);
  }
  
  public WorkspaceMaterialEvaluation findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(WorkspaceMaterial workspaceMaterial, UserEntity student) {
    return workspaceMaterialEvaluationDAO.findByWorkspaceMaterialIdAndStudentEntityId(workspaceMaterial.getId(), student.getId());
  }
  
  public WorkspaceMaterialEvaluation updateWorkspaceMaterialEvaluation(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, GradingScale gradingScale, GradingScaleItem grade, UserEntity assessor, Date evaluated, String verbalAssessment) {
    workspaceMaterialEvaluationDAO.updateGradingScaleIdentifier(workspaceMaterialEvaluation, gradingScale.getIdentifier());
    workspaceMaterialEvaluationDAO.updateGradingScaleSchoolDataSource(workspaceMaterialEvaluation, gradingScale.getSchoolDataSource());
    workspaceMaterialEvaluationDAO.updateVerbalAssessment(workspaceMaterialEvaluation, verbalAssessment);
    workspaceMaterialEvaluationDAO.updateGradeIdentifier(workspaceMaterialEvaluation, grade.getIdentifier());
    workspaceMaterialEvaluationDAO.updateGradeSchoolDataSource(workspaceMaterialEvaluation, grade.getSchoolDataSource());
    workspaceMaterialEvaluationDAO.updateAssessorEntityId(workspaceMaterialEvaluation, assessor.getId());
    workspaceMaterialEvaluationDAO.updateEvaluated(workspaceMaterialEvaluation, evaluated);
    return workspaceMaterialEvaluation;
  }

  public List<ContentNode> getAssignmentContentNodes(WorkspaceEntity workspaceEntity) throws WorkspaceMaterialException {
    // TODO: Optimize this
    List<ContentNode> result = new ArrayList<>();
    addAssignmentNodes(workspaceMaterialController.listWorkspaceMaterialsAsContentNodes(workspaceEntity, false), result);
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
