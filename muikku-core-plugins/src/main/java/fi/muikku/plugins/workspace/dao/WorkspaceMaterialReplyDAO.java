package fi.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply_;

public class WorkspaceMaterialReplyDAO extends PluginDAO<WorkspaceMaterialReply> {
	
  private static final long serialVersionUID = -4395949418454232657L;

  public WorkspaceMaterialReply create(WorkspaceMaterial workspaceMaterial, Long userEntityId) {
		WorkspaceMaterialReply workspaceMaterialReply = new WorkspaceMaterialReply();
		
		workspaceMaterialReply.setWorkspaceMaterial(workspaceMaterial);
		workspaceMaterialReply.setUserEntityId(userEntityId);
		
		return persist(workspaceMaterialReply);
	}

  public WorkspaceMaterialReply findByMaterialAndUserId(WorkspaceMaterial workspaceMaterial, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialReply> criteria = criteriaBuilder.createQuery(WorkspaceMaterialReply.class);
    Root<WorkspaceMaterialReply> root = criteria.from(WorkspaceMaterialReply.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialReply_.workspaceMaterial), workspaceMaterial),
        criteriaBuilder.equal(root.get(WorkspaceMaterialReply_.userEntityId), userEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
