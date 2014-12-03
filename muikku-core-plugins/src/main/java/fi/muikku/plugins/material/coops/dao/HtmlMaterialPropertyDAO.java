package fi.muikku.plugins.material.coops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.coops.model.HtmlMaterialProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialProperty_;

public class HtmlMaterialPropertyDAO extends CorePluginsDAO<HtmlMaterialProperty> {

  private static final long serialVersionUID = -8715223954604734705L;

  public HtmlMaterialProperty create(HtmlMaterial htmlMaterial, String key, String value) {
    HtmlMaterialProperty fileProperty = new HtmlMaterialProperty();

    fileProperty.setHtmlMaterial(htmlMaterial);
    fileProperty.setKey(key);
    fileProperty.setValue(value);

    return persist(fileProperty);
  }

  public HtmlMaterialProperty findByHtmlMaterialAndKey(HtmlMaterial htmlMaterial, String key) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialProperty> criteria = criteriaBuilder.createQuery(HtmlMaterialProperty.class);
    Root<HtmlMaterialProperty> root = criteria.from(HtmlMaterialProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HtmlMaterialProperty_.htmlMaterial), htmlMaterial),
        criteriaBuilder.equal(root.get(HtmlMaterialProperty_.key), key)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<HtmlMaterialProperty> listByHtmlMaterial(HtmlMaterial htmlMaterial) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialProperty> criteria = criteriaBuilder.createQuery(HtmlMaterialProperty.class);
    Root<HtmlMaterialProperty> root = criteria.from(HtmlMaterialProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HtmlMaterialProperty_.htmlMaterial), htmlMaterial)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public HtmlMaterialProperty updateValue(HtmlMaterialProperty fileProperty, String value) {
    fileProperty.setValue(value);
    return persist(fileProperty);
  }

}
