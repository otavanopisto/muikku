package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationType;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation_;

public class WorkspaceMaterialEvaluationDAO extends CorePluginsDAO<WorkspaceMaterialEvaluation> {

  private static final long serialVersionUID = 3327224161244826382L;
  
  public WorkspaceMaterialEvaluation create(Long studentEntityId, Long workspaceMaterialId, String gradingScaleIdentifier, String gradingScaleSchoolDataSource, String gradeIdentifier, String gradeSchoolDataSource, Long assessorEntityId, Date evaluated, String verbalAssessment, WorkspaceMaterialEvaluationType evaluationType) {
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
    workspaceMaterialEvaluation.setEvaluationType(evaluationType);
    workspaceMaterialEvaluation.setArchived(false);
    
    return persist(workspaceMaterialEvaluation);
  }

  public WorkspaceMaterialEvaluation update(
      WorkspaceMaterialEvaluation workspaceMaterialEvaluation, 
      String gradingScaleIdentifier, 
      String gradingScaleSchoolDataSource, 
      String gradeIdentifier, 
      String gradeSchoolDataSource,
      Long assessorEntityId, 
      Date evaluated, 
      String verbalAssessment) {

    workspaceMaterialEvaluation.setGradingScaleIdentifier(gradingScaleIdentifier);
    workspaceMaterialEvaluation.setGradingScaleSchoolDataSource(gradingScaleSchoolDataSource);
    workspaceMaterialEvaluation.setGradeIdentifier(gradeIdentifier);
    workspaceMaterialEvaluation.setGradeSchoolDataSource(gradeSchoolDataSource);
    workspaceMaterialEvaluation.setAssessorEntityId(assessorEntityId);
    workspaceMaterialEvaluation.setEvaluated(evaluated);
    workspaceMaterialEvaluation.setVerbalAssessment(verbalAssessment);
    return persist(workspaceMaterialEvaluation);
  }

  public List<WorkspaceMaterialEvaluation> listByWorkspaceMaterialIdAndStudentEntityIdAndArchived(Long workspaceMaterialId, Long studentEntityId, boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceMaterialEvaluation.class);
    Root<WorkspaceMaterialEvaluation> root = criteria.from(WorkspaceMaterialEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.workspaceMaterialId), workspaceMaterialId),
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.archived), archived)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceMaterialEvaluation> listByWorkspaceMaterialIdAndStudentEntityIdAndTypeAndArchived(Long workspaceMaterialId, Long studentEntityId, WorkspaceMaterialEvaluationType evaluationType, boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceMaterialEvaluation.class);
    Root<WorkspaceMaterialEvaluation> root = criteria.from(WorkspaceMaterialEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.workspaceMaterialId), workspaceMaterialId),
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.evaluationType), evaluationType),
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.archived), archived)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceMaterialEvaluation> listByWorkspaceMaterialId(Long workspaceMaterialId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceMaterialEvaluation.class);
    Root<WorkspaceMaterialEvaluation> root = criteria.from(WorkspaceMaterialEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.workspaceMaterialId), workspaceMaterialId)
      )
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceMaterialEvaluation> findByWorkspaceMaterialIdsAndStudentEntityId(List<Long> workspaceMaterialIds, Long studentEntityId) {
    EntityManager entityManager = getEntityManager(); 
    
    if (workspaceMaterialIds.isEmpty()) {
      return Collections.emptyList();
    }
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceMaterialEvaluation.class);
    Root<WorkspaceMaterialEvaluation> root = criteria.from(WorkspaceMaterialEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        root.get(WorkspaceMaterialEvaluation_.studentEntityId).in(workspaceMaterialIds),
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluation_.studentEntityId), studentEntityId)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceMaterialEvaluation updateAssessorEntityId(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, Long assessorEntityId) {
    workspaceMaterialEvaluation.setAssessorEntityId(assessorEntityId);
    return persist(workspaceMaterialEvaluation);
  }
  
  public WorkspaceMaterialEvaluation updateEvaluated(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, Date evaluated) {
    workspaceMaterialEvaluation.setEvaluated(evaluated);
    return persist(workspaceMaterialEvaluation);
  }
  
  public WorkspaceMaterialEvaluation updateGradingScaleIdentifier(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, String gradingScaleIdentifier) {
    workspaceMaterialEvaluation.setGradingScaleIdentifier(gradingScaleIdentifier);
    return persist(workspaceMaterialEvaluation);
  }
  
  public WorkspaceMaterialEvaluation updateGradingScaleSchoolDataSource(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, String gradingScaleSchoolDataSource) {
    workspaceMaterialEvaluation.setGradingScaleSchoolDataSource(gradingScaleSchoolDataSource);
    return persist(workspaceMaterialEvaluation);
  }
  
  public WorkspaceMaterialEvaluation updateGradeIdentifier(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, String gradeIdentifier) {
    workspaceMaterialEvaluation.setGradeIdentifier(gradeIdentifier);
    return persist(workspaceMaterialEvaluation);
  }
  
  public WorkspaceMaterialEvaluation updateGradeSchoolDataSource(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, String gradeSchoolDataSource) {
    workspaceMaterialEvaluation.setGradeSchoolDataSource(gradeSchoolDataSource);
    return persist(workspaceMaterialEvaluation);
  }
  
  public WorkspaceMaterialEvaluation updateVerbalAssessment(WorkspaceMaterialEvaluation workspaceMaterialEvaluation, String verbalAssessment) {
    workspaceMaterialEvaluation.setVerbalAssessment(verbalAssessment);
    return persist(workspaceMaterialEvaluation);
  }

  public void delete(WorkspaceMaterialEvaluation e) {
    super.delete(e);
  }
 
}
