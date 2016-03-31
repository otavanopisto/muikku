package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart;


public class QueryConnectFieldCounterpartDAO extends CorePluginsDAO<QueryConnectFieldCounterpart> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryConnectFieldCounterpart create(QueryConnectField field, String name, String text) {

    QueryConnectFieldCounterpart queryConnectFieldCounterpart = new QueryConnectFieldCounterpart();
    queryConnectFieldCounterpart.setName(name);
    queryConnectFieldCounterpart.setText(text);
    queryConnectFieldCounterpart.setField(field);
    
    return persist(queryConnectFieldCounterpart);

  }

  public List<QueryConnectFieldCounterpart> listByField(QueryConnectField field) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectFieldCounterpart> criteria = criteriaBuilder.createQuery(QueryConnectFieldCounterpart.class);
    Root<QueryConnectFieldCounterpart> root = criteria.from(QueryConnectFieldCounterpart.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(QueryConnectFieldCounterpart_.field), field));

    return entityManager.createQuery(criteria).getResultList();
  }

  public QueryConnectFieldCounterpart findByFieldAndName(QueryConnectField field, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectFieldCounterpart> criteria = criteriaBuilder.createQuery(QueryConnectFieldCounterpart.class);
    Root<QueryConnectFieldCounterpart> root = criteria.from(QueryConnectFieldCounterpart.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryConnectFieldCounterpart_.field), field),
        criteriaBuilder.equal(root.get(QueryConnectFieldCounterpart_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public QueryConnectFieldCounterpart updateText(QueryConnectFieldCounterpart connectFieldCounterpart, String text) {
    connectFieldCounterpart.setText(text);
    return persist(connectFieldCounterpart);
  }
  
  public void delete(QueryConnectFieldCounterpart queryConnectFieldCounterpart) {
    super.delete(queryConnectFieldCounterpart);
  }
  
}