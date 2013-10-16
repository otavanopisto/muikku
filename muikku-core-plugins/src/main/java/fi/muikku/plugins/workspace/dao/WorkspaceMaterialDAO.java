package fi.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial_;

@DAO
public class WorkspaceMaterialDAO extends PluginDAO<WorkspaceMaterial> {
	
	private static final long serialVersionUID = -1777382212388116832L;

	public WorkspaceMaterial create(WorkspaceFolder folder, Material material) {
		WorkspaceMaterial workspaceMaterial = new WorkspaceMaterial();
		workspaceMaterial.setFolder(folder);
		workspaceMaterial.setMaterial(material);
		return persist(workspaceMaterial);
	}

	public List<WorkspaceMaterial> listByFolder(WorkspaceFolder folder) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterial_.folder), folder)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

	public WorkspaceMaterial findByFolderAndUrlName(WorkspaceFolder folder, String urlName) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterial_.folder), folder),
      criteriaBuilder.equal(root.get(WorkspaceMaterial_.urlName), urlName)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}
	
}
