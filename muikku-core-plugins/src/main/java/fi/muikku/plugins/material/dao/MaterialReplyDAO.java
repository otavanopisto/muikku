package fi.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.MaterialReply;
import fi.muikku.plugins.material.model.MaterialReply_;

public class MaterialReplyDAO extends PluginDAO<MaterialReply> {
	
  private static final long serialVersionUID = -4395949418454232657L;

  public MaterialReply create(Material material, Long userEntityId) {
		MaterialReply materialReply = new MaterialReply();
		
		materialReply.setMaterial(material);
		materialReply.setUserEntityId(userEntityId);
		
		return persist(materialReply);
	}

  public MaterialReply findByMaterialAndUserId(Material material, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MaterialReply> criteria = criteriaBuilder.createQuery(MaterialReply.class);
    Root<MaterialReply> root = criteria.from(MaterialReply.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(MaterialReply_.material), material),
        criteriaBuilder.equal(root.get(MaterialReply_.userEntityId), userEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
