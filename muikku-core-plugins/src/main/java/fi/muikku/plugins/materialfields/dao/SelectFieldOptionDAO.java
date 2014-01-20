package fi.muikku.plugins.materialfields.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.SelectFieldOption;
import fi.muikku.plugins.materialfields.model.SelectFieldOption_;

@DAO
public class SelectFieldOptionDAO extends PluginDAO<SelectFieldOption> {

  private static final long serialVersionUID = -5327160259588566934L;

  public SelectFieldOption create(String name, String text, QuerySelectField field) {

    SelectFieldOption selectFieldOption = new SelectFieldOption();
    selectFieldOption.setName(name);
    selectFieldOption.setText(text);
    selectFieldOption.setSelectField(field);

    return persist(selectFieldOption);

  }

  public List<SelectFieldOption> listByField(QuerySelectField field) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SelectFieldOption> criteria = criteriaBuilder.createQuery(SelectFieldOption.class);
    Root<SelectFieldOption> root = criteria.from(SelectFieldOption.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(SelectFieldOption_.selectField), field));

    return entityManager.createQuery(criteria).getResultList();
  }

  public SelectFieldOption findBySelectFieldAndName(QuerySelectField selectField, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SelectFieldOption> criteria = criteriaBuilder.createQuery(SelectFieldOption.class);
    Root<SelectFieldOption> root = criteria.from(SelectFieldOption.class);
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