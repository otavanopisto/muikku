package fi.otavanopisto.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder_;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;


public class WorkspaceRootFolderDAO extends CorePluginsDAO<WorkspaceRootFolder> {
	
	private static final long serialVersionUID = 9095130166469638314L;

	public WorkspaceRootFolder create(WorkspaceEntity workspaceEntity) {
		WorkspaceRootFolder workspaceRootFolder = new WorkspaceRootFolder();
		workspaceRootFolder.setParent(null);
		workspaceRootFolder.setUrlName(workspaceEntity.getUrlName());
		workspaceRootFolder.setWorkspaceEntityId(workspaceEntity.getId());
		workspaceRootFolder.setOrderNumber(0);
		workspaceRootFolder.setHidden(Boolean.FALSE);
		workspaceRootFolder.setTitle("Root");
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
	
	public void delete(WorkspaceRootFolder workspaceRootFolder) {
	  super.delete(workspaceRootFolder);
	}

}
