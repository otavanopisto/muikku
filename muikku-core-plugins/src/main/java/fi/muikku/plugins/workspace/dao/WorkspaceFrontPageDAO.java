package fi.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFrontPage;
import fi.muikku.plugins.workspace.model.WorkspaceFrontPage_;

public class WorkspaceFrontPageDAO extends CorePluginsDAO<WorkspaceFrontPage> {
	
	private static final long serialVersionUID = 9095130166469638314L;

	public WorkspaceFrontPage create(Long workspaceEntityId, String urlName, Long materialId) {
		WorkspaceFrontPage workspaceFrontPageDocument = new WorkspaceFrontPage();
		workspaceFrontPageDocument.setParent(null);
		workspaceFrontPageDocument.setUrlName(urlName);
		workspaceFrontPageDocument.setWorkspaceEntityId(workspaceEntityId);
		workspaceFrontPageDocument.setOrderNumber(0);
		workspaceFrontPageDocument.setHidden(Boolean.FALSE);
		workspaceFrontPageDocument.setMaterialId(materialId);
		
		return persist(workspaceFrontPageDocument);
	}

	public WorkspaceFrontPage findByWorkspaceEntityId(Long workspaceEntityId) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFrontPage> criteria = criteriaBuilder.createQuery(WorkspaceFrontPage.class);
    Root<WorkspaceFrontPage> root = criteria.from(WorkspaceFrontPage.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceFrontPage_.workspaceEntityId), workspaceEntityId)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}

}
