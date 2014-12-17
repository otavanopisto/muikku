package fi.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.model.QueryMultiSelectField;
import fi.muikku.plugins.material.model.QueryMultiSelectFieldOption;
import fi.muikku.plugins.material.model.QueryMultiSelectFieldOption_;


public class QueryMultiSelectFieldOptionDAO extends CorePluginsDAO<QueryMultiSelectFieldOption> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryMultiSelectFieldOption create(String name, String text, QueryMultiSelectField field) {

    QueryMultiSelectFieldOption queryMultiSelectFieldOption = new QueryMultiSelectFieldOption();
    queryMultiSelectFieldOption.setName(name);
    queryMultiSelectFieldOption.setText(text);
    queryMultiSelectFieldOption.setField(field);
    
    return persist(queryMultiSelectFieldOption);
  }

  public List<QueryMultiSelectFieldOption> listByField(QueryMultiSelectField field) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryMultiSelectFieldOption> criteria = criteriaBuilder.createQuery(QueryMultiSelectFieldOption.class);
    Root<QueryMultiSelectFieldOption> root = criteria.from(QueryMultiSelectFieldOption.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(QueryMultiSelectFieldOption_.field), field));

    return entityManager.createQuery(criteria).getResultList();
  }

  public QueryMultiSelectFieldOption findByFieldAndName(QueryMultiSelectField selectField, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryMultiSelectFieldOption> criteria = criteriaBuilder.createQuery(QueryMultiSelectFieldOption.class);
    Root<QueryMultiSelectFieldOption> root = criteria.from(QueryMultiSelectFieldOption.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryMultiSelectFieldOption_.field), selectField),
        criteriaBuilder.equal(root.get(QueryMultiSelectFieldOption_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public QueryMultiSelectFieldOption updateText(QueryMultiSelectFieldOption querySelectFieldOption, String text) {
    querySelectFieldOption.setText(text);
    return persist(querySelectFieldOption);
  }
}