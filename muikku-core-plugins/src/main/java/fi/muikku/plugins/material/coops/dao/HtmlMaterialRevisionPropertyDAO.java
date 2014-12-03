package fi.muikku.plugins.material.coops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevisionProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevisionProperty_;

public class HtmlMaterialRevisionPropertyDAO extends CorePluginsDAO<HtmlMaterialRevisionProperty> {

  private static final long serialVersionUID = -8715223954604734705L;

  public HtmlMaterialRevisionProperty create(HtmlMaterialRevision htmlMaterialRevision, String key, String value) {
    HtmlMaterialRevisionProperty htmlMaterialRevisionProperty = new HtmlMaterialRevisionProperty();

    htmlMaterialRevisionProperty.setFileRevision(htmlMaterialRevision);
    htmlMaterialRevisionProperty.setValue(value);
    htmlMaterialRevisionProperty.setKey(key);

    return persist(htmlMaterialRevisionProperty);
  }

  public List<HtmlMaterialRevisionProperty> listByHtmlMaterialRevision(HtmlMaterialRevision htmlMaterialRevision) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialRevisionProperty> criteria = criteriaBuilder.createQuery(HtmlMaterialRevisionProperty.class);
    Root<HtmlMaterialRevisionProperty> root = criteria.from(HtmlMaterialRevisionProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HtmlMaterialRevisionProperty_.htmlMaterialRevision), htmlMaterialRevision)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
