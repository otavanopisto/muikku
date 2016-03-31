package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.MaterialMeta_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.MaterialMeta;
import fi.otavanopisto.muikku.plugins.material.model.MaterialMetaKey;

public class MaterialMetaDAO extends CorePluginsDAO<MaterialMeta> {

  private static final long serialVersionUID = 7332873861609737584L;
  
  public MaterialMeta create(Material material, MaterialMetaKey key, String value) {
    MaterialMeta materialMeta = new MaterialMeta();
    materialMeta.setKey(key);
    materialMeta.setMaterial(material);
    materialMeta.setValue(value);
    return persist(materialMeta);
  }

  public List<MaterialMeta> listByMaterial(Material material) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MaterialMeta> criteria = criteriaBuilder.createQuery(MaterialMeta.class);
    Root<MaterialMeta> root = criteria.from(MaterialMeta.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.equal(root.get(MaterialMeta_.material), material)
    );

    return entityManager.createQuery(criteria).getResultList();
	}
	
	public MaterialMeta findByMaterialAndKey(Material material, MaterialMetaKey key) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MaterialMeta> criteria = criteriaBuilder.createQuery(MaterialMeta.class);
    Root<MaterialMeta> root = criteria.from(MaterialMeta.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(MaterialMeta_.key), key),
        criteriaBuilder.equal(root.get(MaterialMeta_.material), material)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
	
	public MaterialMeta updateValue(MaterialMeta materialMeta, String value) {
	  materialMeta.setValue(value);
	  return persist(materialMeta);
	}
	
}