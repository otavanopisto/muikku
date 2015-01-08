package fi.muikku.plugins.material.coops.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.criterion.Order;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevision_;

public class HtmlMaterialRevisionDAO extends CorePluginsDAO<HtmlMaterialRevision> {

  private static final long serialVersionUID = -8715223954604734705L;

  public HtmlMaterialRevision create(HtmlMaterial htmlMaterial, String sessionId, Long revision, Date created, String data, String checksum) {
    HtmlMaterialRevision htmlMaterialRevision = new HtmlMaterialRevision();

    htmlMaterialRevision.setChecksum(checksum);
    htmlMaterialRevision.setCreated(created);
    htmlMaterialRevision.setData(data);
    htmlMaterialRevision.setFile(htmlMaterial);
    htmlMaterialRevision.setRevision(revision);
    htmlMaterialRevision.setSessionId(sessionId);

    return persist(htmlMaterialRevision);
  }

  public List<HtmlMaterialRevision> listByFileAndRevisionGreaterThanOrderedByRevision(HtmlMaterial htmlMaterial, Long revision) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HtmlMaterialRevision> criteria = criteriaBuilder.createQuery(HtmlMaterialRevision.class);
    Root<HtmlMaterialRevision> root = criteria.from(HtmlMaterialRevision.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HtmlMaterialRevision_.htmlMaterial), htmlMaterial),
        criteriaBuilder.greaterThan(root.get(HtmlMaterialRevision_.revision), revision)
      )
    );
    criteria.orderBy(criteriaBuilder.asc(root.get(HtmlMaterialRevision_.revision)));

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public Long maxRevisionByHtmlMaterial(HtmlMaterial htmlMaterial) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<HtmlMaterialRevision> root = criteria.from(HtmlMaterialRevision.class);
    criteria.select(criteriaBuilder.max(root.get(HtmlMaterialRevision_.revision)));
    criteria.where(criteriaBuilder.equal(root.get(HtmlMaterialRevision_.htmlMaterial), htmlMaterial));
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

}
