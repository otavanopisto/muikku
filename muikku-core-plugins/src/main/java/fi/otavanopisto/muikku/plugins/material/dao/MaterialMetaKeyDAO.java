package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.MaterialMetaKey_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.MaterialMetaKey;

public class MaterialMetaKeyDAO extends CorePluginsDAO<MaterialMetaKey> {

  private static final long serialVersionUID = 7332873861609737584L;
  
  public MaterialMetaKey create(String name) {
    MaterialMetaKey materialMetaKey = new MaterialMetaKey();
    materialMetaKey.setName(name);
    return persist(materialMetaKey);
  }
	
	public MaterialMetaKey findByName(String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MaterialMetaKey> criteria = criteriaBuilder.createQuery(MaterialMetaKey.class);
    Root<MaterialMetaKey> root = criteria.from(MaterialMetaKey.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.equal(root.get(MaterialMetaKey_.name), name)
    );

    return getSingleResult(entityManager.createQuery(criteria));
	}
	
}