package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.OrphanMaterial;

public class OrphanMaterialDAO extends CorePluginsDAO<OrphanMaterial> {
  
  private static final long serialVersionUID = -3468160385318100755L;

  public List<OrphanMaterial> getBatch(int count) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<OrphanMaterial> criteria = criteriaBuilder.createQuery(OrphanMaterial.class);
    Root<OrphanMaterial> root = criteria.from(OrphanMaterial.class);
    criteria.select(root);
    return entityManager.createQuery(criteria).setMaxResults(count).getResultList();
  }

  public void delete(OrphanMaterial orphanMaterial) {
    super.delete(orphanMaterial);
  }
  
}
