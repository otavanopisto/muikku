package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QueryTextField_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryTextField;


public class QueryTextFieldDAO extends CorePluginsDAO<QueryTextField> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryTextField create(Material material, String name) {

    QueryTextField queryTextField = new QueryTextField();

    queryTextField.setMaterial(material);
    queryTextField.setName(name);

    return persist(queryTextField);
  }

  public QueryTextField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryTextField> criteria = criteriaBuilder.createQuery(QueryTextField.class);
    Root<QueryTextField> root = criteria.from(QueryTextField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryTextField_.material), material),
        criteriaBuilder.equal(root.get(QueryTextField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QueryTextField queryField) {
    super.delete(queryField);
  }

}
