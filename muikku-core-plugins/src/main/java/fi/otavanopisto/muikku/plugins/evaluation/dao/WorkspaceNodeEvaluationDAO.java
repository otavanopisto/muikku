package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluationType;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation_;

public class WorkspaceNodeEvaluationDAO extends CorePluginsDAO<WorkspaceNodeEvaluation> {

  private static final long serialVersionUID = 3327224161244826382L;
  
  public WorkspaceNodeEvaluation create(
      Long studentEntityId,
      Long workspaceNodeId,
      String gradingScaleIdentifier,
      String gradingScaleSchoolDataSource,
      String gradeIdentifier,
      String gradeSchoolDataSource,
      Long assessorEntityId,
      Date evaluated,
      String verbalAssessment,
      Double points,
      WorkspaceNodeEvaluationType evaluationType) {
    WorkspaceNodeEvaluation evaluation = new WorkspaceNodeEvaluation();
    evaluation.setAssessorEntityId(assessorEntityId);
    evaluation.setEvaluated(evaluated);
    evaluation.setGradingScaleIdentifier(gradingScaleIdentifier);
    evaluation.setGradingScaleSchoolDataSource(gradingScaleSchoolDataSource);
    evaluation.setGradeIdentifier(gradeIdentifier);
    evaluation.setGradeSchoolDataSource(gradeSchoolDataSource);
    evaluation.setStudentEntityId(studentEntityId);
    evaluation.setVerbalAssessment(verbalAssessment);
    evaluation.setWorkspaceNodeId(workspaceNodeId);
    evaluation.setEvaluationType(evaluationType);
    evaluation.setPoints(points);
    evaluation.setArchived(false);
    
    return persist(evaluation);
  }

  public WorkspaceNodeEvaluation update(
      WorkspaceNodeEvaluation evaluation, 
      String gradingScaleIdentifier, 
      String gradingScaleSchoolDataSource, 
      String gradeIdentifier, 
      String gradeSchoolDataSource,
      Long assessorEntityId, 
      Date evaluated, 
      String verbalAssessment,
      Double points,
      WorkspaceNodeEvaluationType evaluationType) {

    evaluation.setGradingScaleIdentifier(gradingScaleIdentifier);
    evaluation.setGradingScaleSchoolDataSource(gradingScaleSchoolDataSource);
    evaluation.setGradeIdentifier(gradeIdentifier);
    evaluation.setGradeSchoolDataSource(gradeSchoolDataSource);
    evaluation.setAssessorEntityId(assessorEntityId);
    evaluation.setEvaluated(evaluated);
    evaluation.setVerbalAssessment(verbalAssessment);
    evaluation.setPoints(points);
    evaluation.setEvaluationType(evaluationType);

    return persist(evaluation);
  }

  /**
   * Lists WorkspaceNodeEvaluations for given student and material.
   * They can be of any type i.e. assessments or supplementation requests.
   * 
   * @param workspaceNodeId
   * @param studentEntityId
   * @param archived
   * @return
   */
  public List<WorkspaceNodeEvaluation> listByWorkspaceNodeIdAndStudentEntityIdAndArchived(Long workspaceNodeId, Long studentEntityId, boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNodeEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceNodeEvaluation.class);
    Root<WorkspaceNodeEvaluation> root = criteria.from(WorkspaceNodeEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceNodeEvaluation_.workspaceNodeId), workspaceNodeId),
        criteriaBuilder.equal(root.get(WorkspaceNodeEvaluation_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(WorkspaceNodeEvaluation_.archived), archived)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceNodeEvaluation> listByWorkspaceNodeId(Long workspaceNodeId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNodeEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceNodeEvaluation.class);
    Root<WorkspaceNodeEvaluation> root = criteria.from(WorkspaceNodeEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceNodeEvaluation_.workspaceNodeId), workspaceNodeId)
      )
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceNodeEvaluation> listByWorkspaceNodeIdAndStudentEntityId(Long workspaceNodeId, Long studentEntityId) {
    EntityManager entityManager = getEntityManager(); 
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNodeEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceNodeEvaluation.class);
    Root<WorkspaceNodeEvaluation> root = criteria.from(WorkspaceNodeEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceNodeEvaluation_.workspaceNodeId), workspaceNodeId),
        criteriaBuilder.equal(root.get(WorkspaceNodeEvaluation_.studentEntityId), studentEntityId)
      )
    );
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceNodeEvaluation> findByWorkspaceNodeIdsAndStudentEntityId(List<Long> workspaceNodeIds, Long studentEntityId) {
    EntityManager entityManager = getEntityManager(); 
    
    if (workspaceNodeIds.isEmpty()) {
      return Collections.emptyList();
    }
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNodeEvaluation> criteria = criteriaBuilder.createQuery(WorkspaceNodeEvaluation.class);
    Root<WorkspaceNodeEvaluation> root = criteria.from(WorkspaceNodeEvaluation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        root.get(WorkspaceNodeEvaluation_.studentEntityId).in(workspaceNodeIds),
        criteriaBuilder.equal(root.get(WorkspaceNodeEvaluation_.studentEntityId), studentEntityId)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public void delete(WorkspaceNodeEvaluation e) {
    super.delete(e);
  }
 
}
