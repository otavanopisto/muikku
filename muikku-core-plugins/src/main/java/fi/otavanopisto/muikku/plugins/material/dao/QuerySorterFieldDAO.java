package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QuerySorterField;
import fi.otavanopisto.muikku.plugins.material.model.QuerySorterField_;

public class QuerySorterFieldDAO extends CorePluginsDAO<QuerySorterField> {

  private static final long serialVersionUID = -1180756839976898146L;

  public QuerySorterField create(Material material, String name) {

    QuerySorterField querySorterField = new QuerySorterField();

    querySorterField.setMaterial(material);
    querySorterField.setName(name);

    return persist(querySorterField);
  }

  public QuerySorterField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QuerySorterField> criteria = criteriaBuilder.createQuery(QuerySorterField.class);
    Root<QuerySorterField> root = criteria.from(QuerySorterField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QuerySorterField_.material), material),
        criteriaBuilder.equal(root.get(QuerySorterField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QuerySorterField queryField) {
    super.delete(queryField);
  }

}
