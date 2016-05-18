package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryOrganizerField;
import fi.otavanopisto.muikku.plugins.material.model.QueryOrganizerField_;

public class QueryOrganizerFieldDAO extends CorePluginsDAO<QueryOrganizerField> {

  private static final long serialVersionUID = -966341537821700067L;

  public QueryOrganizerField create(Material material, String name) {

    QueryOrganizerField queryOrganizerField = new QueryOrganizerField();

    queryOrganizerField.setMaterial(material);
    queryOrganizerField.setName(name);

    return persist(queryOrganizerField);
  }

  public QueryOrganizerField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryOrganizerField> criteria = criteriaBuilder.createQuery(QueryOrganizerField.class);
    Root<QueryOrganizerField> root = criteria.from(QueryOrganizerField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryOrganizerField_.material), material),
        criteriaBuilder.equal(root.get(QueryOrganizerField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QueryOrganizerField queryField) {
    super.delete(queryField);
  }

}
