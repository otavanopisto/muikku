package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectFieldOption;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption;

public class WorkspaceMaterialMultiSelectFieldAnswerOptionDAO extends CorePluginsDAO<WorkspaceMaterialMultiSelectFieldAnswerOption> {
	
  private static final long serialVersionUID = 8767283875784190142L;

  public WorkspaceMaterialMultiSelectFieldAnswerOption create(WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer, QueryMultiSelectFieldOption option) {
    WorkspaceMaterialMultiSelectFieldAnswerOption workspaceMaterialMultiSelectFieldAnswerOption = new WorkspaceMaterialMultiSelectFieldAnswerOption();
		
		workspaceMaterialMultiSelectFieldAnswerOption.setFieldAnswer(fieldAnswer);
		workspaceMaterialMultiSelectFieldAnswerOption.setOption(option);
		
		return persist(workspaceMaterialMultiSelectFieldAnswerOption);
	}
  
  public WorkspaceMaterialMultiSelectFieldAnswerOption findByFieldAnswerAndOption(WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer, QueryMultiSelectFieldOption option) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialMultiSelectFieldAnswerOption> criteria = criteriaBuilder.createQuery(WorkspaceMaterialMultiSelectFieldAnswerOption.class);
    Root<WorkspaceMaterialMultiSelectFieldAnswerOption> root = criteria.from(WorkspaceMaterialMultiSelectFieldAnswerOption.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialMultiSelectFieldAnswerOption_.fieldAnswer), fieldAnswer),
        criteriaBuilder.equal(root.get(WorkspaceMaterialMultiSelectFieldAnswerOption_.option), option)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<WorkspaceMaterialMultiSelectFieldAnswerOption> listByFieldAnswer(WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialMultiSelectFieldAnswerOption> criteria = criteriaBuilder.createQuery(WorkspaceMaterialMultiSelectFieldAnswerOption.class);
    Root<WorkspaceMaterialMultiSelectFieldAnswerOption> root = criteria.from(WorkspaceMaterialMultiSelectFieldAnswerOption.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialMultiSelectFieldAnswerOption_.fieldAnswer), fieldAnswer)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  @Override
  public void delete(WorkspaceMaterialMultiSelectFieldAnswerOption workspaceMaterialMultiSelectFieldAnswerOption) {
    super.delete(workspaceMaterialMultiSelectFieldAnswerOption);
  }
  
}
