package fi.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.Material_;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

public class MaterialDAO extends PluginDAO<Material> {
  
  /**
   * 
   */
  private static final long serialVersionUID = -4182497624872407751L;

  public Material create(String type,
                         String title,
                         UserEntity creator,
                         WorkspaceEntity workspaceEntity) {
    Material material = new Material();
    material.setType(type);
    material.setTitle(title);
    material.setWorkspaceEntityId(workspaceEntity.getId());
    getEntityManager().persist(material);
    return material;
  }
  
  public void delete(Material material) {
    super.delete(material);
  }
  
  public Material findByUrlName(String urlName) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Material> criteria = criteriaBuilder.createQuery(Material.class);
    Root<Material> root = criteria.from(Material.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(Material_.urlName), urlName)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public Material findByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Material> criteria = criteriaBuilder.createQuery(Material.class);
    Root<Material> root = criteria.from(Material.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(Material_.workspaceEntityId), workspaceEntity.getId())
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
}