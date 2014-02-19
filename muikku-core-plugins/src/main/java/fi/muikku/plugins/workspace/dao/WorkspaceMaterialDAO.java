package fi.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial_;
import fi.muikku.plugins.workspace.model.WorkspaceNode;

@DAO
public class WorkspaceMaterialDAO extends PluginDAO<WorkspaceMaterial> {
	
	private static final long serialVersionUID = -1777382212388116832L;

	public WorkspaceMaterial create(WorkspaceNode parent, Material material, String urlName) {
		WorkspaceMaterial workspaceMaterial = new WorkspaceMaterial();
		workspaceMaterial.setParent(parent);
		workspaceMaterial.setMaterial(material);
		workspaceMaterial.setUrlName(urlName);
		
		return persist(workspaceMaterial);
	}

	public List<WorkspaceMaterial> listByParent(WorkspaceNode parent) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterial_.parent), parent)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

	public WorkspaceMaterial findByFolderAndUrlName(WorkspaceNode parent, String urlName) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
  		criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.parent), parent),
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.urlName), urlName)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}
	
	public void delete(WorkspaceMaterial workspaceMaterial) {
	  super.delete(workspaceMaterial);
	}
	
}
