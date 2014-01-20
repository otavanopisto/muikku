package fi.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.QueryConnectField;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm_;

@DAO
public class QueryConnectFieldTermDAO extends PluginDAO<QueryConnectFieldTerm> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryConnectFieldTerm create(QueryConnectField connectField, String name, String text, QueryConnectFieldCounterpart counterpart) {

    QueryConnectFieldTerm queryConnectFieldTerm = new QueryConnectFieldTerm();
    queryConnectFieldTerm.setName(name);
    queryConnectFieldTerm.setText(text);
    queryConnectFieldTerm.setConnectField(connectField);
    queryConnectFieldTerm.setCounterpart(counterpart);
    
    return persist(queryConnectFieldTerm);

  }

  public List<QueryConnectFieldTerm> listByField(QueryConnectField connectField) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectFieldTerm> criteria = criteriaBuilder.createQuery(QueryConnectFieldTerm.class);
    Root<QueryConnectFieldTerm> root = criteria.from(QueryConnectFieldTerm.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(QueryConnectFieldTerm_.connectField), connectField));

    return entityManager.createQuery(criteria).getResultList();
  }

  public QueryConnectFieldTerm findBySelectFieldAndName(QueryConnectField connectField, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectFieldTerm> criteria = criteriaBuilder.createQuery(QueryConnectFieldTerm.class);
    Root<QueryConnectFieldTerm> root = criteria.from(QueryConnectFieldTerm.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryConnectFieldTerm_.connectField), connectField),
        criteriaBuilder.equal(root.get(QueryConnectFieldTerm_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
}