package fi.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryMemoField;
import fi.muikku.plugins.material.model.QueryMemoField_;

public class QueryMemoFieldDAO extends CorePluginsDAO<QueryMemoField> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryMemoField create(Material material, String name) {

    QueryMemoField queryMemoField = new QueryMemoField();

    queryMemoField.setMaterial(material);
    queryMemoField.setName(name);

    return persist(queryMemoField);
  }

  public QueryMemoField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryMemoField> criteria = criteriaBuilder.createQuery(QueryMemoField.class);
    Root<QueryMemoField> root = criteria.from(QueryMemoField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryMemoField_.material), material),
        criteriaBuilder.equal(root.get(QueryMemoField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
