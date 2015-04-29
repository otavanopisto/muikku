package fi.muikku.plugins.evaluation;

import java.util.Date;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.evaluation.dao.WorkspaceMaterialEvaluationDAO;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;

public class EvaluationController {
  
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
  
  
  
}
