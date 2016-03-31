package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QuerySelectFieldOption_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectField;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectFieldOption;


public class QuerySelectFieldOptionDAO extends CorePluginsDAO<QuerySelectFieldOption> {

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
    criteria.where(criteriaBuilder.equal(root.get(QuerySelectFieldOption_.selectField), field));

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
        criteriaBuilder.equal(root.get(QuerySelectFieldOption_.selectField), selectField),
        criteriaBuilder.equal(root.get(QuerySelectFieldOption_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<QuerySelectFieldOption> listBySelectField(QuerySelectField selectField) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QuerySelectFieldOption> criteria = criteriaBuilder.createQuery(QuerySelectFieldOption.class);
    Root<QuerySelectFieldOption> root = criteria.from(QuerySelectFieldOption.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(QuerySelectFieldOption_.selectField), selectField)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public QuerySelectFieldOption updateText(QuerySelectFieldOption querySelectFieldOption, String text) {
    querySelectFieldOption.setText(text);
    return persist(querySelectFieldOption);
  }
  
  public void delete(QuerySelectFieldOption querySelectFieldOption) {
    super.delete(querySelectFieldOption);
  }
}