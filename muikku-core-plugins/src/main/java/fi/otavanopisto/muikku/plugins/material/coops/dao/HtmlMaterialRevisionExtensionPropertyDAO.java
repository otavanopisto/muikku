package fi.otavanopisto.muikku.plugins.material.coops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevisionExtensionProperty_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevisionExtensionProperty;

public class HtmlMaterialRevisionExtensionPropertyDAO extends CorePluginsDAO<HtmlMaterialRevisionExtensionProperty> {

  private static final long serialVersionUID = -8715223954604734705L;

  public HtmlMaterialRevisionExtensionProperty create(HtmlMaterialRevision htmlMaterialRevision, String key, String value) {
    HtmlMaterialRevisionExtensionProperty htmlMaterialRevisionExtensionProperty = new HtmlMaterialRevisionExtensionProperty();

    htmlMaterialRevisionExtensionProperty.setFileRevision(htmlMaterialRevision);
    htmlMaterialRevisionExtensionProperty.setValue(value);
    htmlMaterialRevisionExtensionProperty.setKey(key);

    return persist(htmlMaterialRevisionExtensionProperty);
  }

  public List<HtmlMaterialRevisionExtensionProperty> listByHtmlMaterialRevision(HtmlMaterialRevision htmlMaterialRevision) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialRevisionExtensionProperty> criteria = criteriaBuilder.createQuery(HtmlMaterialRevisionExtensionProperty.class);
    Root<HtmlMaterialRevisionExtensionProperty> root = criteria.from(HtmlMaterialRevisionExtensionProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HtmlMaterialRevisionExtensionProperty_.htmlMaterialRevision), htmlMaterialRevision)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public void delete(HtmlMaterialRevisionExtensionProperty e) {
    super.delete(e);
  }
  
}
