package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldTerm_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldTerm;


public class QueryConnectFieldTermDAO extends CorePluginsDAO<QueryConnectFieldTerm> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryConnectFieldTerm create(QueryConnectField field, String name, String text, QueryConnectFieldCounterpart counterpart) {

    QueryConnectFieldTerm queryConnectFieldTerm = new QueryConnectFieldTerm();
    queryConnectFieldTerm.setName(name);
    queryConnectFieldTerm.setText(text);
    queryConnectFieldTerm.setField(field);
    queryConnectFieldTerm.setCounterpart(counterpart);

    return persist(queryConnectFieldTerm);

  }

  public QueryConnectFieldTerm findByFieldAndName(QueryConnectField field, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectFieldTerm> criteria = criteriaBuilder.createQuery(QueryConnectFieldTerm.class);
    Root<QueryConnectFieldTerm> root = criteria.from(QueryConnectFieldTerm.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryConnectFieldTerm_.field), field),
        criteriaBuilder.equal(root.get(QueryConnectFieldTerm_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<QueryConnectFieldTerm> listByField(QueryConnectField field) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectFieldTerm> criteria = criteriaBuilder.createQuery(QueryConnectFieldTerm.class);
    Root<QueryConnectFieldTerm> root = criteria.from(QueryConnectFieldTerm.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(QueryConnectFieldTerm_.field), field));

    return entityManager.createQuery(criteria).getResultList();
  }

  public QueryConnectFieldTerm updateText(QueryConnectFieldTerm queryConnectFieldTerm, String text) {
    queryConnectFieldTerm.setText(text);
    return persist(queryConnectFieldTerm);
  }

  public QueryConnectFieldTerm updateCounterpart(QueryConnectFieldTerm queryConnectFieldTerm, QueryConnectFieldCounterpart counterpart) {
    queryConnectFieldTerm.setCounterpart(counterpart);
    return persist(queryConnectFieldTerm);
  }
  
  public void delete(QueryConnectFieldTerm queryConnectFieldTerm) {
    super.delete(queryConnectFieldTerm);
  }
}