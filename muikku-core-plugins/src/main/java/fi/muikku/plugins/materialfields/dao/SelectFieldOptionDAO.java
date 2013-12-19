package fi.muikku.plugins.materialfields.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.SelectFieldOption;

public class SelectFieldOptionDAO extends PluginDAO<SelectFieldOption> {

  private static final long serialVersionUID = -5327160259588566934L;

  public SelectFieldOption create(String name, String optText, QuerySelectField field) {

    SelectFieldOption selectFieldOption = new SelectFieldOption();
    selectFieldOption.setName(name);
    selectFieldOption.setOptText(optText);
    selectFieldOption.setSelectField(field);

    return persist(selectFieldOption);

  }

  public List<SelectFieldOption> listByField(QuerySelectField field) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SelectFieldOption> criteria = criteriaBuilder.createQuery(SelectFieldOption.class);
    Root<SelectFieldOption> root = criteria.from(SelectFieldOption.class);
    criteria.select(root);
    criteria.where(
    // criteriaBuilder.equal(root.get(), field) //TODO: fix metamodel generation problem in SelectFieldOption where QuerySelectField object is not included in
    // generated model
        );

    return entityManager.createQuery(criteria).getResultList();
  }

}