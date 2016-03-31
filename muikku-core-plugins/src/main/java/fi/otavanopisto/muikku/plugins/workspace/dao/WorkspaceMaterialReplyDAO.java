package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class WorkspaceMaterialReplyDAO extends CorePluginsDAO<WorkspaceMaterialReply> {
	
  private static final long serialVersionUID = -4395949418454232657L;

  public WorkspaceMaterialReply create(WorkspaceMaterial workspaceMaterial, WorkspaceMaterialReplyState state, Long userEntityId, Long numberOfTries, Date created, Date lastModified, Date submitted, Date withdrawn) {
		WorkspaceMaterialReply workspaceMaterialReply = new WorkspaceMaterialReply();
		
		workspaceMaterialReply.setWorkspaceMaterial(workspaceMaterial);
		workspaceMaterialReply.setUserEntityId(userEntityId);
		workspaceMaterialReply.setNumberOfTries(numberOfTries);
		workspaceMaterialReply.setCreated(created);
		workspaceMaterialReply.setLastModified(lastModified);
		workspaceMaterialReply.setState(state);
		workspaceMaterialReply.setSubmitted(submitted);
		workspaceMaterialReply.setWithdrawn(withdrawn);
		
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
  
  public WorkspaceMaterialReply updateState(WorkspaceMaterialReply workspaceMaterialReply, WorkspaceMaterialReplyState state) {
    workspaceMaterialReply.setState(state);
    return persist(workspaceMaterialReply);
  }
  
  public WorkspaceMaterialReply updateLastModified(WorkspaceMaterialReply workspaceMaterialReply, Date lastModified) {
    workspaceMaterialReply.setLastModified(lastModified);
    return persist(workspaceMaterialReply);
  }

  public WorkspaceMaterialReply updateSubmitted(WorkspaceMaterialReply workspaceMaterialReply, Date lastModified) {
    workspaceMaterialReply.setSubmitted(lastModified);
    return persist(workspaceMaterialReply);
  }

  public WorkspaceMaterialReply updateWithdrawn(WorkspaceMaterialReply workspaceMaterialReply, Date withdrawn) {
    workspaceMaterialReply.setWithdrawn(withdrawn);
    return persist(workspaceMaterialReply);
  }
  
  public void delete(WorkspaceMaterialReply workspaceMaterialReply) {
    super.delete(workspaceMaterialReply);
  }

}
