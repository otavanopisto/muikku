package fi.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswerOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswerOption_;

public class WorkspaceMaterialChecklistFieldAnswerOptionDAO extends CorePluginsDAO<WorkspaceMaterialChecklistFieldAnswerOption> {
	
  private static final long serialVersionUID = 8767283875784190142L;

  public WorkspaceMaterialChecklistFieldAnswerOption create(WorkspaceMaterialChecklistFieldAnswer fieldAnswer, QueryChecklistFieldOption option) {
    WorkspaceMaterialChecklistFieldAnswerOption workspaceMaterialChecklistFieldAnswerOption = new WorkspaceMaterialChecklistFieldAnswerOption();
		
		workspaceMaterialChecklistFieldAnswerOption.setFieldAnswer(fieldAnswer);
		workspaceMaterialChecklistFieldAnswerOption.setOption(option);
		
		return persist(workspaceMaterialChecklistFieldAnswerOption);
	}
  
  public WorkspaceMaterialChecklistFieldAnswerOption findByFieldAnswerAndOption(WorkspaceMaterialChecklistFieldAnswer fieldAnswer, QueryChecklistFieldOption option) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialChecklistFieldAnswerOption> criteria = criteriaBuilder.createQuery(WorkspaceMaterialChecklistFieldAnswerOption.class);
    Root<WorkspaceMaterialChecklistFieldAnswerOption> root = criteria.from(WorkspaceMaterialChecklistFieldAnswerOption.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialChecklistFieldAnswerOption_.fieldAnswer), fieldAnswer),
        criteriaBuilder.equal(root.get(WorkspaceMaterialChecklistFieldAnswerOption_.option), option)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<WorkspaceMaterialChecklistFieldAnswerOption> listByFieldAnswer(WorkspaceMaterialChecklistFieldAnswer fieldAnswer) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialChecklistFieldAnswerOption> criteria = criteriaBuilder.createQuery(WorkspaceMaterialChecklistFieldAnswerOption.class);
    Root<WorkspaceMaterialChecklistFieldAnswerOption> root = criteria.from(WorkspaceMaterialChecklistFieldAnswerOption.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialChecklistFieldAnswerOption_.fieldAnswer), fieldAnswer)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(WorkspaceMaterialChecklistFieldAnswerOption workspaceMaterialChecklistFieldAnswerOption) {
    super.delete(workspaceMaterialChecklistFieldAnswerOption);
  }
  
}
