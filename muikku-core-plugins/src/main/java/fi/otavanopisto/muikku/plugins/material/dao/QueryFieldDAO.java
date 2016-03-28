package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QueryField_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;


public class QueryFieldDAO extends CorePluginsDAO<QueryField> {

	private static final long serialVersionUID = -5327160259588566934L;

  public QueryField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryField> criteria = criteriaBuilder.createQuery(QueryField.class);
    Root<QueryField> root = criteria.from(QueryField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryField_.material), material),
        criteriaBuilder.equal(root.get(QueryField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<QueryField> listByMaterial(Material material) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryField> criteria = criteriaBuilder.createQuery(QueryField.class);
    Root<QueryField> root = criteria.from(QueryField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(QueryField_.material), material)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(QueryField queryField) {
    super.delete(queryField);
  }

}
