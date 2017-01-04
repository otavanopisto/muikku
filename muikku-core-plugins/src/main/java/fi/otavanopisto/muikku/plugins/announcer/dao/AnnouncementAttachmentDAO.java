package fi.otavanopisto.muikku.plugins.announcer.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementAttachment;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementAttachment_;

public class AnnouncementAttachmentDAO extends CorePluginsDAO<AnnouncementAttachment> {

  private static final long serialVersionUID = 2684218995954542919L;

  public AnnouncementAttachment create(String name, String contentType, byte[] content) {
    AnnouncementAttachment announcementAttachment = new AnnouncementAttachment();
    announcementAttachment.setName(name);
    announcementAttachment.setContentType(contentType);
    announcementAttachment.setContent(content);
    
    return persist(announcementAttachment);
  }
 
  public AnnouncementAttachment findByName(String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementAttachment> criteria = criteriaBuilder.createQuery(AnnouncementAttachment.class);
    Root<AnnouncementAttachment> root = criteria.from(AnnouncementAttachment.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(AnnouncementAttachment_.name), name)
    );
    return getSingleResult(entityManager.createQuery(criteria));
  }
}
