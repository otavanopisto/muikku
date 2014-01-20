package fi.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.materialfields.model.SelectFieldOption_;

@DAO
public class QuerySelectFieldOptionDAO extends PluginDAO<QuerySelectFieldOption> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QuerySelectFieldOption create(String name, String text, QuerySelectField field) {

    QuerySelectFieldOption querySelectFieldOption = new QuerySelectFieldOption();
    querySelectFieldOption.setName(name);
    querySelectFieldOption.setText(text);
    querySelectFieldOption.setSelectField(field);

    return persist(querySelectFieldOption);

  }

  public List<QuerySelectFieldOption> listByField(QuerySelectField field) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QuerySelectFieldOption> criteria = criteriaBuilder.createQuery(QuerySelectFieldOption.class);
    Root<QuerySelectFieldOption> root = criteria.from(QuerySelectFieldOption.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(SelectFieldOption_.selectField), field));

    return entityManager.createQuery(criteria).getResultList();
  }

  public QuerySelectFieldOption findBySelectFieldAndName(QuerySelectField selectField, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QuerySelectFieldOption> criteria = criteriaBuilder.createQuery(QuerySelectFieldOption.class);
    Root<QuerySelectFieldOption> root = criteria.from(QuerySelectFieldOption.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SelectFieldOption_.selectField), selectField),
        criteriaBuilder.equal(root.get(SelectFieldOption_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
}