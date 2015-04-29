package fi.muikku.plugins.evaluation.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation_;

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

  public WorkspaceMaterialEvaluation findByWorkspaceMaterialIdAndStudentEntityId(Long workspaceMaterialId, Long studentEntityId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceMaterialEvaluation.class);
    Root<WorkspaceMaterialEvaluation> root = criteria.from(WorkspaceMaterialEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.workspaceMaterialId), workspaceMaterialId),
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.studentEntityId), studentEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
