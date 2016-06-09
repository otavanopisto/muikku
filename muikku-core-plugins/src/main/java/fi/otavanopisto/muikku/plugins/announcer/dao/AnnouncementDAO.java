package fi.otavanopisto.muikku.plugins.announcer.dao;

import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup_;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace_;

public class AnnouncementDAO extends CorePluginsDAO<Announcement> {
	
  private static final long serialVersionUID = -8721990589622544635L;
  
  public Announcement create(Long publisherUserEntityId, String caption, String content, Date created, Date startDate, 
      Date endDate, Boolean archived, Boolean publiclyVisible) {
    Announcement announcement = new Announcement();
    announcement.setPublisherUserEntityId(publisherUserEntityId);
    announcement.setCaption(caption);
    announcement.setContent(content);
    announcement.setCreated(created);
    announcement.setStartDate(startDate);
    announcement.setEndDate(endDate);
    announcement.setArchived(archived);
    announcement.setPubliclyVisible(publiclyVisible);
    return persist(announcement);
 }
  
  public List<Announcement> listByArchivedWithNoWorkspaces(Boolean archived){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);

    Subquery<Announcement> subquery = subqueryWorkspaceAnnouncements(criteriaBuilder, criteria);
    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(Announcement_.archived), archived),
        criteriaBuilder.not(criteriaBuilder.in(root).value(subquery))
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(Announcement_.startDate)));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Announcement> listByArchived(boolean archived){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);

    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(Announcement_.archived), archived));
    criteria.orderBy(criteriaBuilder.desc(root.get(Announcement_.startDate)));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Announcement> listByWorkspaceEntityIdAndArchived(Long workspaceEntityId, Boolean archived){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);
    Root<AnnouncementWorkspace> root = criteria.from(AnnouncementWorkspace.class);
    Join<AnnouncementWorkspace, Announcement> announcement = root.join(AnnouncementWorkspace_.announcement);
    criteria.select(announcement);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(announcement.get(Announcement_.archived), archived),
        criteriaBuilder.equal(root.get(AnnouncementWorkspace_.archived), archived),
        criteriaBuilder.equal(root.get(AnnouncementWorkspace_.workspaceEntityId), workspaceEntityId)
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(announcement.get(Announcement_.startDate)));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Announcement> listByDateAndWorkspaceEntityIdAndArchived(Date date, Long workspaceEntityId, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    date = onlyDateFields(date);
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);
    Root<AnnouncementWorkspace> root = criteria.from(AnnouncementWorkspace.class);
    Join<AnnouncementWorkspace, Announcement> announcement = root.join(AnnouncementWorkspace_.announcement);
    criteria.select(announcement);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.lessThanOrEqualTo(announcement.get(Announcement_.startDate), date),
        criteriaBuilder.greaterThanOrEqualTo(announcement.get(Announcement_.endDate), date),
        criteriaBuilder.equal(announcement.get(Announcement_.archived), archived),
        criteriaBuilder.equal(root.get(AnnouncementWorkspace_.archived), archived),
        criteriaBuilder.equal(root.get(AnnouncementWorkspace_.workspaceEntityId), workspaceEntityId)
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(announcement.get(Announcement_.startDate)));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<Announcement> listByDateAndUserGroupEntityIdsAndPubliclyVisibleAndArchived(Date currentDate, List<Long> userGroupEntityIds, Boolean publiclyVisible, Boolean archived) {
    if (userGroupEntityIds.isEmpty()) {
      return Collections.emptyList();
    }
    
    currentDate = onlyDateFields(currentDate);
    
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);
    Root<AnnouncementUserGroup> root = criteria.from(AnnouncementUserGroup.class);
    Join<AnnouncementUserGroup, Announcement> announcement = root.join(AnnouncementUserGroup_.announcement);
    criteria.select(announcement);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.lessThanOrEqualTo(announcement.get(Announcement_.startDate), currentDate),
        criteriaBuilder.greaterThanOrEqualTo(announcement.get(Announcement_.endDate), currentDate),
        criteriaBuilder.equal(announcement.get(Announcement_.archived), archived),
        criteriaBuilder.equal(root.get(AnnouncementUserGroup_.archived), archived),
        root.get(AnnouncementUserGroup_.userGroupEntityId).in(userGroupEntityIds),
        criteriaBuilder.equal(announcement.get(Announcement_.publiclyVisible), publiclyVisible)
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(announcement.get(Announcement_.startDate)));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Announcement> listByDateAndWorkspaceEntityIdsAndArchived(Date currentDate, List<Long> workspaceEntityIds, Boolean archived) {
    if (workspaceEntityIds.isEmpty()) {
      return Collections.emptyList();
    }
    
    currentDate = onlyDateFields(currentDate);
    
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);
    Root<AnnouncementWorkspace> root = criteria.from(AnnouncementWorkspace.class);
    Join<AnnouncementWorkspace, Announcement> announcement = root.join(AnnouncementWorkspace_.announcement);
    criteria.select(announcement);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.lessThanOrEqualTo(announcement.get(Announcement_.startDate), currentDate),
        criteriaBuilder.greaterThanOrEqualTo(announcement.get(Announcement_.endDate), currentDate),
        criteriaBuilder.equal(announcement.get(Announcement_.archived), archived),
        criteriaBuilder.equal(root.get(AnnouncementWorkspace_.archived), archived),
        root.get(AnnouncementWorkspace_.workspaceEntityId).in(workspaceEntityIds)
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(announcement.get(Announcement_.startDate)));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<Announcement> listActiveWithNoWorkspaces() {
    EntityManager entityManager = getEntityManager(); 
    Date currentDate = new Date();
    currentDate = onlyDateFields(currentDate);
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);

    Subquery<Announcement> subquery = subqueryWorkspaceAnnouncements(criteriaBuilder, criteria);

    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.lessThanOrEqualTo(root.get(Announcement_.startDate), currentDate),
        criteriaBuilder.greaterThanOrEqualTo(root.get(Announcement_.endDate), currentDate),
        criteriaBuilder.not(criteriaBuilder.in(root).value(subquery))
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(Announcement_.startDate)));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Announcement> listByDateAndPubliclyVisibleWithNoWorkspacesAndArchived(Date currentDate, Boolean publiclyVisible, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    currentDate = onlyDateFields(currentDate);
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);

    Subquery<Announcement> subquery = subqueryWorkspaceAnnouncements(criteriaBuilder, criteria);

    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.lessThanOrEqualTo(root.get(Announcement_.startDate), currentDate),
        criteriaBuilder.greaterThanOrEqualTo(root.get(Announcement_.endDate), currentDate),
        criteriaBuilder.equal(root.get(Announcement_.archived), archived),
        criteriaBuilder.equal(root.get(Announcement_.publiclyVisible), publiclyVisible),
        criteriaBuilder.not(criteriaBuilder.in(root).value(subquery))
      )
    );
          
    criteria.orderBy(criteriaBuilder.desc(root.get(Announcement_.startDate)));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<Announcement> listByDateWithNoWorkspacesAndArchived(Date currentDate, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    currentDate = onlyDateFields(currentDate);
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);

    Subquery<Announcement> subquery = subqueryWorkspaceAnnouncements(criteriaBuilder, criteria);

    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(Announcement_.archived), archived),
        criteriaBuilder.lessThanOrEqualTo(root.get(Announcement_.startDate), currentDate),
        criteriaBuilder.greaterThanOrEqualTo(root.get(Announcement_.endDate), currentDate),
        criteriaBuilder.not(criteriaBuilder.in(root).value(subquery))
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(Announcement_.startDate)));
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Announcement> listByDateAndArchived(Date currentDate, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    currentDate = onlyDateFields(currentDate);
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);

    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(Announcement_.archived), archived),
        criteriaBuilder.lessThanOrEqualTo(root.get(Announcement_.startDate), currentDate),
        criteriaBuilder.greaterThanOrEqualTo(root.get(Announcement_.endDate), currentDate)
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(Announcement_.startDate)));
    return entityManager.createQuery(criteria).getResultList();
  }

  public Announcement updateCaption(Announcement announcement, String caption) {
    announcement.setCaption(caption);
    return persist(announcement);
  }

  public Announcement updateContent(Announcement announcement, String content) {
    announcement.setContent(content);
    return persist(announcement);
  }

  public Announcement updateStartDate(Announcement announcement, Date startDate) {
    announcement.setStartDate(startDate);
    return persist(announcement);
  }

  public Announcement updateEndDate(Announcement announcement, Date endDate) {
    announcement.setEndDate(endDate);
    return persist(announcement);
  }

  public Announcement updatePubliclyVisible(Announcement announcement, Boolean publiclyVisible) {
    announcement.setPubliclyVisible(publiclyVisible);
    return persist(announcement);
  }
  
  public Announcement updateArchived(Announcement announcement, Boolean archived) {
    announcement.setArchived(archived);
    return persist(announcement);
  }
  
  public void delete(Announcement announcement) {
    super.delete(announcement);
  }

  private Subquery<Announcement> subqueryWorkspaceAnnouncements(CriteriaBuilder criteriaBuilder, CriteriaQuery<Announcement> criteria) {
    Subquery<Announcement> subquery = criteria.subquery(Announcement.class);
    Root<AnnouncementWorkspace> announcementWorkspaces = subquery.from(AnnouncementWorkspace.class);
    subquery.select(announcementWorkspaces.get(AnnouncementWorkspace_.announcement));
    return subquery;
  }

  private Date onlyDateFields(Date currentDate) {
    Calendar cal = Calendar.getInstance();
    cal.setTime(currentDate);
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);
    currentDate = cal.getTime();
    return currentDate;
  }
}
