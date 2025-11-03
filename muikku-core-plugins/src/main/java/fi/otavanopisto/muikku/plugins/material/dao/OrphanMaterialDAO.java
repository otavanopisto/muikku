package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.plugins.material.model.OrphanMaterial;

public class OrphanMaterialDAO extends CoreDAO<OrphanMaterial> {
  
  private static final long serialVersionUID = -5759085487898738000L;

  public List<OrphanMaterial> getBatch(int count) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<OrphanMaterial> criteria = criteriaBuilder.createQuery(OrphanMaterial.class);
    Root<OrphanMaterial> root = criteria.from(OrphanMaterial.class);
    criteria.select(root);
    TypedQuery<OrphanMaterial> query = entityManager.createQuery(criteria);
    query.setMaxResults(count);
    return query.getResultList();
  }

  public void delete(OrphanMaterial orphanMaterial) {
    super.delete(orphanMaterial);
  }

}
