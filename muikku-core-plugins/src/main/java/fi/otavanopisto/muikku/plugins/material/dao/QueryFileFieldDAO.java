package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QueryFileField_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryFileField;


public class QueryFileFieldDAO extends CorePluginsDAO<QueryFileField> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryFileField create(Material material, String name) {

    QueryFileField queryFileField = new QueryFileField();

    queryFileField.setMaterial(material);
    queryFileField.setName(name);

    return persist(queryFileField);
  }

  public QueryFileField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryFileField> criteria = criteriaBuilder.createQuery(QueryFileField.class);
    Root<QueryFileField> root = criteria.from(QueryFileField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryFileField_.material), material),
        criteriaBuilder.equal(root.get(QueryFileField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QueryFileField queryField) {
    super.delete(queryField);
  }
  
}
