package fi.otavanopisto.muikku.plugins.material.coops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevisionProperty_;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevision_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevisionProperty;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;

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

  public HtmlMaterialRevisionProperty findByHtmlMaterialAndKeyMaxRevision(HtmlMaterial htmlMaterial, String key) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialRevisionProperty> criteria = criteriaBuilder.createQuery(HtmlMaterialRevisionProperty.class);
    Root<HtmlMaterialRevisionProperty> root = criteria.from(HtmlMaterialRevisionProperty.class);
    Join<HtmlMaterialRevisionProperty, HtmlMaterialRevision> revisionJoin = root.join(HtmlMaterialRevisionProperty_.htmlMaterialRevision);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HtmlMaterialRevisionProperty_.key), key),
        criteriaBuilder.equal(revisionJoin.get(HtmlMaterialRevision_.htmlMaterial), htmlMaterial)
      )
    );
    
    // TODO: This could be optimized
    
    criteria.orderBy(criteriaBuilder.desc(revisionJoin.get(HtmlMaterialRevision_.revision)));
    TypedQuery<HtmlMaterialRevisionProperty> query = entityManager.createQuery(criteria);
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }

  public HtmlMaterialRevisionProperty findByHtmlMaterialAndKeyRevisionLeAndMaxRevision(HtmlMaterial htmlMaterial, String key, Long revisionLe) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialRevisionProperty> criteria = criteriaBuilder.createQuery(HtmlMaterialRevisionProperty.class);
    Root<HtmlMaterialRevisionProperty> root = criteria.from(HtmlMaterialRevisionProperty.class);
    Join<HtmlMaterialRevisionProperty, HtmlMaterialRevision> revisionJoin = root.join(HtmlMaterialRevisionProperty_.htmlMaterialRevision);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HtmlMaterialRevisionProperty_.key), key),
        criteriaBuilder.equal(revisionJoin.get(HtmlMaterialRevision_.htmlMaterial), htmlMaterial),
        criteriaBuilder.lessThanOrEqualTo(revisionJoin.get(HtmlMaterialRevision_.revision), revisionLe)
      )
    );
    
    // TODO: This could be optimized
    
    criteria.orderBy(criteriaBuilder.desc(revisionJoin.get(HtmlMaterialRevision_.revision)));
    TypedQuery<HtmlMaterialRevisionProperty> query = entityManager.createQuery(criteria);
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }

  public List<String> listKeysByHtmlMaterial(HtmlMaterial htmlMaterial) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<String> criteria = criteriaBuilder.createQuery(String.class);
    Root<HtmlMaterialRevisionProperty> root = criteria.from(HtmlMaterialRevisionProperty.class);
    Join<HtmlMaterialRevisionProperty, HtmlMaterialRevision> revisionJoin = root.join(HtmlMaterialRevisionProperty_.htmlMaterialRevision);
    criteria.select(root.get(HtmlMaterialRevisionProperty_.key)).distinct(true);
    criteria.where(
      criteriaBuilder.equal(revisionJoin.get(HtmlMaterialRevision_.htmlMaterial), htmlMaterial)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(HtmlMaterialRevisionProperty e) {
    super.delete(e);
  }

}
