package fi.muikku.plugins.material.coops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.coops.model.HtmlMaterialExtensionProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialExtensionProperty_;
import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialExtensionPropertyDAO extends CorePluginsDAO<HtmlMaterialExtensionProperty> {

  private static final long serialVersionUID = -8715223954604734705L;

  public HtmlMaterialExtensionProperty create(HtmlMaterial htmlMaterial, String key, String value) {
    HtmlMaterialExtensionProperty htmlMaterialExtensionProperty = new HtmlMaterialExtensionProperty();

    htmlMaterialExtensionProperty.setFile(htmlMaterial);
    htmlMaterialExtensionProperty.setKey(key);
    htmlMaterialExtensionProperty.setValue(value);

    return persist(htmlMaterialExtensionProperty);
  }

  public HtmlMaterialExtensionProperty findByFileAndKey(HtmlMaterial htmlMaterial, String key) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialExtensionProperty> criteria = criteriaBuilder.createQuery(HtmlMaterialExtensionProperty.class);
    Root<HtmlMaterialExtensionProperty> root = criteria.from(HtmlMaterialExtensionProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HtmlMaterialExtensionProperty_.htmlMaterial), htmlMaterial),
        criteriaBuilder.equal(root.get(HtmlMaterialExtensionProperty_.key), key)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<HtmlMaterialExtensionProperty> listByFile(HtmlMaterial htmlMaterial) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialExtensionProperty> criteria = criteriaBuilder.createQuery(HtmlMaterialExtensionProperty.class);
    Root<HtmlMaterialExtensionProperty> root = criteria.from(HtmlMaterialExtensionProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HtmlMaterialExtensionProperty_.htmlMaterial), htmlMaterial)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public HtmlMaterialExtensionProperty updateValue(HtmlMaterialExtensionProperty htmlMaterialExtensionProperty, String value) {
    htmlMaterialExtensionProperty.setValue(value);
    return persist(htmlMaterialExtensionProperty);
  }

}
