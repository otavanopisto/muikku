package fi.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder_;

@DAO
public class WorkspaceRootFolderDAO extends PluginDAO<WorkspaceRootFolder> {
	
	private static final long serialVersionUID = 9095130166469638314L;

	public WorkspaceRootFolder create(WorkspaceEntity workspaceEntity) {
		WorkspaceRootFolder workspaceRootFolder = new WorkspaceRootFolder();
		workspaceRootFolder.setParent(null);
		workspaceRootFolder.setUrlName(workspaceEntity.getUrlName());
		workspaceRootFolder.setWorkspaceEntityId(workspaceEntity.getId());
		return persist(workspaceRootFolder);
	}

	public WorkspaceRootFolder findByWorkspaceEntityId(Long workspaceEntityId) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceRootFolder> criteria = criteriaBuilder.createQuery(WorkspaceRootFolder.class);
    Root<WorkspaceRootFolder> root = criteria.from(WorkspaceRootFolder.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceRootFolder_.workspaceEntityId), workspaceEntityId)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}

}
