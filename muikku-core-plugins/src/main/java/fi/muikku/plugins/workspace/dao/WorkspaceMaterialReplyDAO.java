package fi.muikku.plugins.workspace.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply_;

public class WorkspaceMaterialReplyDAO extends CorePluginsDAO<WorkspaceMaterialReply> {
	
  private static final long serialVersionUID = -4395949418454232657L;

  public WorkspaceMaterialReply create(WorkspaceMaterial workspaceMaterial, Long userEntityId, Long numberOfTries, Date created, Date lastModified) {
		WorkspaceMaterialReply workspaceMaterialReply = new WorkspaceMaterialReply();
		
		workspaceMaterialReply.setWorkspaceMaterial(workspaceMaterial);
		workspaceMaterialReply.setUserEntityId(userEntityId);
		workspaceMaterialReply.setNumberOfTries(numberOfTries);
		workspaceMaterialReply.setCreated(created);
		workspaceMaterialReply.setLastModified(lastModified);
		
		return persist(workspaceMaterialReply);
	}

  public WorkspaceMaterialReply findByWorkspaceMaterialAndUserEntityId(WorkspaceMaterial workspaceMaterial, Long userEntityId) {
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

  public List<WorkspaceMaterialReply> listByWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialReply> criteria = criteriaBuilder.createQuery(WorkspaceMaterialReply.class);
    Root<WorkspaceMaterialReply> root = criteria.from(WorkspaceMaterialReply.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialReply_.workspaceMaterial), workspaceMaterial)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceMaterialReply update(WorkspaceMaterialReply workspaceMaterialReply, Long numberOfTries, Date lastModified) {
    workspaceMaterialReply.setNumberOfTries(numberOfTries);
    workspaceMaterialReply.setLastModified(lastModified);
    
    getEntityManager().persist(workspaceMaterialReply);
    
    return workspaceMaterialReply;
  }
  
  public void delete(WorkspaceMaterialReply workspaceMaterialReply) {
    super.delete(workspaceMaterialReply);
  }

}
