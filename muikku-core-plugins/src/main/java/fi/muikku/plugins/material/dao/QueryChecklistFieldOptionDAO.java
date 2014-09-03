package fi.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.model.QueryChecklistField;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption_;

@DAO
public class QueryChecklistFieldOptionDAO extends CorePluginsDAO<QueryChecklistFieldOption> {

  private static final long serialVersionUID = -5327160259588566934L;

  public QueryChecklistFieldOption create(String name, String text, QueryChecklistField field) {

    QueryChecklistFieldOption queryChecklistFieldOption = new QueryChecklistFieldOption();
    queryChecklistFieldOption.setName(name);
    queryChecklistFieldOption.setText(text);
    queryChecklistFieldOption.setField(field);
    
    return persist(queryChecklistFieldOption);
  }

  public List<QueryChecklistFieldOption> listByField(QueryChecklistField field) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryChecklistFieldOption> criteria = criteriaBuilder.createQuery(QueryChecklistFieldOption.class);
    Root<QueryChecklistFieldOption> root = criteria.from(QueryChecklistFieldOption.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(QueryChecklistFieldOption_.field), field));

    return entityManager.createQuery(criteria).getResultList();
  }

  public QueryChecklistFieldOption findByFieldAndName(QueryChecklistField selectField, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryChecklistFieldOption> criteria = criteriaBuilder.createQuery(QueryChecklistFieldOption.class);
    Root<QueryChecklistFieldOption> root = criteria.from(QueryChecklistFieldOption.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryChecklistFieldOption_.field), selectField),
        criteriaBuilder.equal(root.get(QueryChecklistFieldOption_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public QueryChecklistFieldOption updateText(QueryChecklistFieldOption querySelectFieldOption, String text) {
    querySelectFieldOption.setText(text);
    return persist(querySelectFieldOption);
  }
}