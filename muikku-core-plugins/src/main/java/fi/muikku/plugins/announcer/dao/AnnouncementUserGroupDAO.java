package fi.muikku.plugins.announcer.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.announcer.model.Announcement;
import fi.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.muikku.plugins.announcer.model.AnnouncementUserGroup_;

public class AnnouncementUserGroupDAO extends CorePluginsDAO<AnnouncementUserGroup> {
	
  private static final long serialVersionUID = -8721990589622544635L;
  
  public AnnouncementUserGroup create(
      Announcement announcement,
      Long userGroupEntityId,
      boolean archived
  ) {
    AnnouncementUserGroup announcementUserGroup = new AnnouncementUserGroup();
    announcementUserGroup.setAnnouncement(announcement);
    announcementUserGroup.setUserGroupEntityId(userGroupEntityId);
    announcementUserGroup.setArchived(archived);
    
    return persist(announcementUserGroup);
 }
  
  public void archive(AnnouncementUserGroup announcementUserGroup) {
    if(announcementUserGroup != null){
      announcementUserGroup.setArchived(true);
      getEntityManager().persist(announcementUserGroup);
    }
  }
  
  public List<AnnouncementUserGroup> listByArchived(boolean archived){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementUserGroup> criteria = criteriaBuilder.createQuery(AnnouncementUserGroup.class);
    Root<AnnouncementUserGroup> root = criteria.from(AnnouncementUserGroup.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(AnnouncementUserGroup_.archived), archived));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<AnnouncementUserGroup> listByAnnouncementAndArchived(
      Announcement announcement,
      boolean archived
  ) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementUserGroup> criteria = criteriaBuilder.createQuery(AnnouncementUserGroup.class);
    Root<AnnouncementUserGroup> root = criteria.from(AnnouncementUserGroup.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(root.get(AnnouncementUserGroup_.announcement), announcement),
          criteriaBuilder.equal(root.get(AnnouncementUserGroup_.archived), archived)));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(AnnouncementUserGroup announcementUserGroup){
    super.delete(announcementUserGroup);
  }
  
}
