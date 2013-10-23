package fi.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceFolder_;

@DAO
public class WorkspaceFolderDAO extends PluginDAO<WorkspaceFolder> {
	
	private static final long serialVersionUID = 9095130166469638314L;

	public WorkspaceFolder create(Long workspaceEntityId, WorkspaceFolder parent, String urlName) {
		WorkspaceFolder workspaceFolder = new WorkspaceFolder();
		workspaceFolder.setWorkspaceEntityId(workspaceEntityId);
		workspaceFolder.setParent(parent);
		workspaceFolder.setUrlName(urlName);
		return persist(workspaceFolder);
	}

	public WorkspaceFolder findByParentAndUrlName(WorkspaceFolder parent, String urlName) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFolder> criteria = criteriaBuilder.createQuery(WorkspaceFolder.class);
    Root<WorkspaceFolder> root = criteria.from(WorkspaceFolder.class);
    criteria.select(root);
    criteria.where(
   		criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceFolder_.parent), parent),
        criteriaBuilder.equal(root.get(WorkspaceFolder_.urlName), urlName)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}

	public WorkspaceFolder findByWorkspaceEntityId(Long workspaceEntityId) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFolder> criteria = criteriaBuilder.createQuery(WorkspaceFolder.class);
    Root<WorkspaceFolder> root = criteria.from(WorkspaceFolder.class);
    criteria.select(root);
    criteria.where(
   		criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceFolder_.workspaceEntityId), workspaceEntityId),
        criteriaBuilder.isNull(root.get(WorkspaceFolder_.urlName))
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}
	
	public List<WorkspaceFolder> listByWorkspaceEntityId(Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFolder> criteria = criteriaBuilder.createQuery(WorkspaceFolder.class);
    Root<WorkspaceFolder> root = criteria.from(WorkspaceFolder.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceFolder_.workspaceEntityId), workspaceEntityId)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

	public List<WorkspaceFolder> listByParent(WorkspaceFolder parent) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFolder> criteria = criteriaBuilder.createQuery(WorkspaceFolder.class);
    Root<WorkspaceFolder> root = criteria.from(WorkspaceFolder.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceFolder_.parent), parent)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

}
