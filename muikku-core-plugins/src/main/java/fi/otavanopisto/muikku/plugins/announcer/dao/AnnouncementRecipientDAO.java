package fi.otavanopisto.muikku.plugins.announcer.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementRecipient;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementRecipient_;

public class AnnouncementRecipientDAO extends CorePluginsDAO<AnnouncementRecipient> {
	
  private static final long serialVersionUID = -5945129760014248759L;

  public AnnouncementRecipient create(Announcement announcement, Long userEntityId, Date readDate, boolean pinned) {
    AnnouncementRecipient announcementRecipient = new AnnouncementRecipient();
    announcementRecipient.setAnnouncement(announcement);
    announcementRecipient.setUserEntityId(userEntityId);
    announcementRecipient.setPinned(pinned);
    announcementRecipient.setReadDate(readDate);
    
    return persist(announcementRecipient);
 }
  
  public AnnouncementRecipient update(AnnouncementRecipient announcementRecipient, boolean pinned, Date readDate) {

    announcementRecipient.setPinned(pinned);
    announcementRecipient.setReadDate(readDate);
    
    return persist(announcementRecipient);
 }
  
  public List<AnnouncementRecipient> listByUser(Long userEntityId){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementRecipient> criteria = criteriaBuilder.createQuery(AnnouncementRecipient.class);
    Root<AnnouncementRecipient> root = criteria.from(AnnouncementRecipient.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(AnnouncementRecipient_.userEntityId), userEntityId));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<AnnouncementRecipient> listByAnnouncement(Announcement announcement){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementRecipient> criteria = criteriaBuilder.createQuery(AnnouncementRecipient.class);
    Root<AnnouncementRecipient> root = criteria.from(AnnouncementRecipient.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(AnnouncementRecipient_.announcement), announcement));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(AnnouncementRecipient announcementRecipient){
    super.delete(announcementRecipient);
  }
  
  public AnnouncementRecipient findByAnnouncementAndUserEntityId(Announcement announcement, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementRecipient> criteria = criteriaBuilder.createQuery(AnnouncementRecipient.class);
    Root<AnnouncementRecipient> root = criteria.from(AnnouncementRecipient.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(AnnouncementRecipient_.announcement), announcement),
        criteriaBuilder.equal(root.get(AnnouncementRecipient_.userEntityId), userEntityId)
      )
    );
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
