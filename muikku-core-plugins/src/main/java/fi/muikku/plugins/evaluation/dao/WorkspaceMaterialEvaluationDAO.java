package fi.muikku.plugins.evaluation.dao;

import java.util.Date;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;

public class WorkspaceMaterialEvaluationDAO extends CorePluginsDAO<WorkspaceMaterialEvaluation> {

  private static final long serialVersionUID = 3327224161244826382L;

  public WorkspaceMaterialEvaluation create(Long studentEntityId, Long workspaceMaterialId, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, Long assessorEntityId, Date evaluated, String verbalAssessment) {
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = new WorkspaceMaterialEvaluation();
    workspaceMaterialEvaluation.setAssessorEntityId(assessorEntityId);
    workspaceMaterialEvaluation.setEvaluated(evaluated);
    workspaceMaterialEvaluation.setGradingScaleIdentifier(gradingScaleIdentifier);
    workspaceMaterialEvaluation.setGradingScaleSchoolDataSource(gradingScaleSchoolDataSource);
    workspaceMaterialEvaluation.setGradeIdentifier(gradeIdentifier);
    workspaceMaterialEvaluation.setGradeSchoolDataSource(gradeSchoolDataSource);
    workspaceMaterialEvaluation.setStudentEntityId(studentEntityId);
    workspaceMaterialEvaluation.setVerbalAssessment(verbalAssessment);
    workspaceMaterialEvaluation.setWorkspaceMaterialId(workspaceMaterialId);
    
    return persist(workspaceMaterialEvaluation);
  }
  
  
  
}
