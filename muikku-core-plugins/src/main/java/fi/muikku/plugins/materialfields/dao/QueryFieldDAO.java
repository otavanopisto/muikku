package fi.muikku.plugins.materialfields.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.model.QueryField;
import fi.muikku.plugins.materialfields.model.QueryField_;

@DAO
public class QueryFieldDAO extends PluginDAO<QueryField> {

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

}
