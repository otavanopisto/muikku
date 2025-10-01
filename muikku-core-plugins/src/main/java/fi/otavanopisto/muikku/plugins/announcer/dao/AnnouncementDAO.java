package fi.otavanopisto.muikku.plugins.announcer.dao;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementRecipient;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementRecipient_;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup_;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement_;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace_;

public class AnnouncementDAO extends CorePluginsDAO<Announcement> {
	
  private static final long serialVersionUID = -8721990589622544635L;
  
  public Announcement create(Long publisherUserEntityId, OrganizationEntity organizationEntity, 
      String caption, String content, Date created, Date startDate, 
      Date endDate, Boolean archived, Boolean publiclyVisible) {
    Announcement announcement = new Announcement();
    announcement.setPublisherUserEntityId(publisherUserEntityId);
    announcement.setOrganizationEntityId(organizationEntity.getId());
    announcement.setCaption(caption);
    announcement.setContent(content);
    announcement.setCreated(created);
    announcement.setStartDate(startDate);
    announcement.setEndDate(endDate);
    announcement.setArchived(archived);
    announcement.setPubliclyVisible(publiclyVisible);
    return persist(announcement);
  }

  public List<Announcement> listAnnouncements(OrganizationEntity organizationEntity, List<UserGroupEntity> userGroupEntities, 
      List<WorkspaceEntity> workspaceEntities, AnnouncementEnvironmentRestriction environment, AnnouncementTimeFrame timeFrame, boolean onlyUnread, Long loggedUser,  boolean archived, Integer firstResult, Integer maxResults) {
    return listAnnouncements(organizationEntity, userGroupEntities, workspaceEntities, environment, timeFrame, null, onlyUnread, loggedUser, archived, firstResult, maxResults);
  }
  
  public List<Announcement> listAnnouncements(
      OrganizationEntity organizationEntity,
      List<UserGroupEntity> userGroupEntities, 
      List<WorkspaceEntity> workspaceEntities, 
      AnnouncementEnvironmentRestriction environment, 
      AnnouncementTimeFrame timeFrame, 
      UserEntity announcementOwner,
      boolean onlyUnread,
      Long loggedUser,
      boolean archived,
      Integer firstResult, 
      Integer maxResults) {
    EntityManager entityManager = getEntityManager();
    Date currentDate = onlyDateFields(new Date());
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Announcement> criteria = criteriaBuilder.createQuery(Announcement.class);
    Root<Announcement> root = criteria.from(Announcement.class);
    criteria.select(root).distinct(true);
    
    List<Predicate> predicates = new ArrayList<Predicate>();
    predicates.add(criteriaBuilder.equal(root.get(Announcement_.organizationEntityId), organizationEntity.getId()));
    predicates.add(criteriaBuilder.equal(root.get(Announcement_.archived), archived));
    
    switch (timeFrame) {
      case ALL:
        // No restrictions here
      break;
      case CURRENTANDUPCOMING:
        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(Announcement_.endDate), currentDate));
      break;
      case CURRENTANDEXPIRED:
        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(Announcement_.startDate), currentDate));
      break;
      case CURRENT:
        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(Announcement_.startDate), currentDate));
        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(Announcement_.endDate), currentDate));
      break;
      case UPCOMING:
        predicates.add(criteriaBuilder.greaterThan(root.get(Announcement_.startDate), currentDate));
      break;
      case EXPIRED:
        predicates.add(criteriaBuilder.lessThan(root.get(Announcement_.endDate), currentDate));
      break;
    }
    
    if (announcementOwner != null) {
      predicates.add(criteriaBuilder.equal(root.get(Announcement_.publisherUserEntityId), announcementOwner.getId()));
    }

    // Predicates for group visibility restrictions (workspace, usergroup or environment)
    List<Predicate> groupPredicates = new ArrayList<Predicate>();

    /**
     * Environment announcements: 
     * - All announcements which are not tied to a workspace
     * - Publicly visible and/or group (when requested)
     */
    switch (environment) {
      case NONE:
        // No environment announcements added
      break;
      case PUBLIC:
        groupPredicates.add(
            criteriaBuilder.and(
                criteriaBuilder.not(criteriaBuilder.in(root).value(subqueryWorkspaceAnnouncements(criteriaBuilder, criteria))),
                criteriaBuilder.equal(root.get(Announcement_.publiclyVisible), Boolean.TRUE)
            )
        );
      break;
      case PUBLICANDGROUP:
        groupPredicates.add(
            criteriaBuilder.not(criteriaBuilder.in(root).value(subqueryWorkspaceAnnouncements(criteriaBuilder, criteria)))
        );
      break;
    }

    /**
     * Workspace announcements:
     * - All announcements tied to specified workspace(s)
     */
    if (CollectionUtils.isNotEmpty(workspaceEntities)) {
      List<Long> workspaceEntityIds = workspaceEntities.stream().map((WorkspaceEntity workspaceEntity) -> workspaceEntity.getId()).collect(Collectors.toList());
      
      Subquery<Announcement> subquery = criteria.subquery(Announcement.class);
      Root<AnnouncementWorkspace> announcementWorkspace = subquery.from(AnnouncementWorkspace.class);
      
      subquery.select(announcementWorkspace.get(AnnouncementWorkspace_.announcement));
      subquery.where(
          criteriaBuilder.and(
              criteriaBuilder.equal(announcementWorkspace.get(AnnouncementWorkspace_.archived), Boolean.FALSE),
              announcementWorkspace.get(AnnouncementWorkspace_.workspaceEntityId).in(workspaceEntityIds)
          ));
      
      groupPredicates.add(root.in(subquery));
    }

    /**
     * User group announcements:
     * - Environment announcements that are tied to user group.
     */
    if (CollectionUtils.isNotEmpty(userGroupEntities)) {
      List<Long> userGroupEntityIds = userGroupEntities.stream().map((UserGroupEntity userGroupEntity) -> userGroupEntity.getId()).collect(Collectors.toList());
      
      Subquery<Announcement> subquery = criteria.subquery(Announcement.class);
      Root<AnnouncementUserGroup> announcementUserGroup = subquery.from(AnnouncementUserGroup.class);
      
      subquery.select(announcementUserGroup.get(AnnouncementUserGroup_.announcement));
      subquery.where(
          criteriaBuilder.and(
              criteriaBuilder.equal(announcementUserGroup.get(AnnouncementUserGroup_.archived), Boolean.FALSE),
              announcementUserGroup.get(AnnouncementUserGroup_.userGroupEntityId).in(userGroupEntityIds)
          ));
      
      groupPredicates.add(root.in(subquery));
    }
    
    /**
     * User recipients for unread announcements:
     */
    if (onlyUnread) {
      Subquery<Announcement> subquery = criteria.subquery(Announcement.class);
      Root<AnnouncementRecipient> announcementRecipient = subquery.from(AnnouncementRecipient.class);
      
      subquery.select(announcementRecipient.get(AnnouncementRecipient_.announcement));
      subquery.where(
              announcementRecipient.get(AnnouncementRecipient_.userEntityId).in(loggedUser)
          );
      
      predicates.add(criteriaBuilder.not(root.in(subquery)));
    }
    
    predicates.add(criteriaBuilder.or(groupPredicates.toArray(new Predicate[0])));
    
    criteria.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
    
    criteria.orderBy(criteriaBuilder.desc(root.get(Announcement_.startDate)), criteriaBuilder.desc(root.get(Announcement_.id)));
    
    TypedQuery<Announcement> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
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
    subquery.where(criteriaBuilder.equal(announcementWorkspaces.get(AnnouncementWorkspace_.archived), Boolean.FALSE));
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
