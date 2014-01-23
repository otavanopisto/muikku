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
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart_;

@DAO
public class QueryConnectFieldCounterpartDAO extends PluginDAO<QueryConnectFieldCounterpart> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryConnectFieldCounterpart create(QueryConnectField connectField, String name, String text) {

    QueryConnectFieldCounterpart queryConnectFieldCounterpart = new QueryConnectFieldCounterpart();
    queryConnectFieldCounterpart.setName(name);
    queryConnectFieldCounterpart.setText(text);
    queryConnectFieldCounterpart.setConnectField(connectField);
    
    return persist(queryConnectFieldCounterpart);

  }

  public List<QueryConnectFieldCounterpart> listByField(QueryConnectField connectField) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectFieldCounterpart> criteria = criteriaBuilder.createQuery(QueryConnectFieldCounterpart.class);
    Root<QueryConnectFieldCounterpart> root = criteria.from(QueryConnectFieldCounterpart.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(QueryConnectFieldCounterpart_.connectField), connectField));

    return entityManager.createQuery(criteria).getResultList();
  }

  public QueryConnectFieldCounterpart findByFieldAndName(QueryConnectField connectField, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectFieldCounterpart> criteria = criteriaBuilder.createQuery(QueryConnectFieldCounterpart.class);
    Root<QueryConnectFieldCounterpart> root = criteria.from(QueryConnectFieldCounterpart.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryConnectFieldCounterpart_.connectField), connectField),
        criteriaBuilder.equal(root.get(QueryConnectFieldCounterpart_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
}