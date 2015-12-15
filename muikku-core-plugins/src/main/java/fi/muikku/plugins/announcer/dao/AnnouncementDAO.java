package fi.muikku.plugins.announcer.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.announcer.model.Announcement;
import fi.muikku.plugins.announcer.model.Announcement_;

public class AnnouncementDAO extends CorePluginsDAO<Announcement> {
	
  private static final long serialVersionUID = -8721990589622544635L;
  
  public Announcement create(
      Long publisherUserEntityId,
      String caption,
      String content,
      Date created,
      Date startDate,
      Date endDate,
      boolean archived
  ) {
    Announcement announcement = new Announcement();
    announcement.setPublisherUserEntityId(publisherUserEntityId);
    announcement.setCaption(caption);
    announcement.setContent(content);
    announcement.setCreated(created);
    announcement.setStartDate(startDate);
    announcement.setEndDate(endDate);
    announcement.setArchived(archived);
    
    return persist(announcement);
 }
  
  public void archive(Announcement announcement) {
    if(announcement != null){
      announcement.setArchived(true);
      getEntityManager().persist(announcement);
    }
  }
  
  public List<Announcement> listByArchived(boolean archived){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);
    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(Announcement_.archived), archived));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<Announcement> listActive() {
    EntityManager entityManager = getEntityManager(); 
    Date currentDate = new Date();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);
    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.lessThanOrEqualTo(root.get(Announcement_.startDate), currentDate),
        criteriaBuilder.greaterThanOrEqualTo(root.get(Announcement_.endDate), currentDate)
      )
    );
    return entityManager.createQuery(criteria).getResultList();
  }
}
