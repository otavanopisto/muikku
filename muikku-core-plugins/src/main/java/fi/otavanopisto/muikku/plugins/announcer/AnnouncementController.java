package fi.otavanopisto.muikku.plugins.announcer;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.RandomStringUtils;

import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementAttachmentDAO;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementCategoryDAO;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementDAO;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementEnvironmentRestriction;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementRecipientDAO;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementTimeFrame;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementUserGroupDAO;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementWorkspaceDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementAttachment;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementCategory;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementRecipient;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

public class AnnouncementController {
  
  @Inject
  private AnnouncementDAO announcementDAO;
  
  @Inject
  private AnnouncementUserGroupDAO announcementUserGroupDAO;

  @Inject
  private AnnouncementWorkspaceDAO announcementWorkspaceDAO;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private AnnouncementAttachmentDAO announcementAttachmentDAO;
  
  @Inject
  private AnnouncementRecipientDAO announcementRecipientDAO;
  
  @Inject
  private AnnouncementCategoryDAO announcementCategoryDAO;
  
  public Announcement createAnnouncement(UserEntity publisher, OrganizationEntity organizationEntity, String caption, String content, Date startDate, Date endDate, boolean publiclyVisible, List<AnnouncementCategory> categories) {
    return announcementDAO.create(
        publisher.getId(),
        organizationEntity,
        caption,
        content,
        new Date(),
        startDate,
        endDate,
        Boolean.FALSE,
        publiclyVisible,
        categories);
  }

  public AnnouncementUserGroup addAnnouncementTargetGroup(Announcement announcement, UserGroupEntity userGroupEntity) {
    return announcementUserGroupDAO.create(announcement, userGroupEntity.getId(), Boolean.FALSE);
  }
  
  public AnnouncementWorkspace addAnnouncementWorkspace(Announcement announcement, WorkspaceEntity workspaceEntity) {
    return announcementWorkspaceDAO.create(announcement, workspaceEntity.getId(), Boolean.FALSE);
  }

  public Announcement updateAnnouncement(Announcement announcement, String caption, String content, Date startDate, Date endDate, boolean publiclyVisible, boolean archived) {
    announcementDAO.updateCaption(announcement, caption);
    announcementDAO.updateContent(announcement, content);
    announcementDAO.updateStartDate(announcement, startDate);
    announcementDAO.updateEndDate(announcement, endDate);
    announcementDAO.updatePubliclyVisible(announcement, publiclyVisible);
    announcementDAO.updateArchived(announcement, archived);
    return announcement;
  }
  
  public List<Announcement> listAnnouncements(Collection<SchoolDataIdentifier> userIdentifiers, OrganizationEntity organizationEntity, boolean includeGroups, boolean includeWorkspaces, 
      AnnouncementEnvironmentRestriction environment, AnnouncementTimeFrame timeFrame, UserEntity announcementOwner, boolean onlyUnread, Long loggedUser,  boolean onlyArchived, Integer firstResult, Integer maxResults) {

    List<UserGroupEntity> userGroupEntities = includeGroups ? userGroupEntityController.listUserGroupsByUserIdentifiers(userIdentifiers) : Collections.emptyList();
    List<WorkspaceEntity> workspaceEntities = includeWorkspaces ? workspaceEntityController.listActiveWorkspaceEntitiesByUserIdentifiers(userIdentifiers) : Collections.emptyList();

    List<Announcement> announcements = announcementDAO.listAnnouncements(
        organizationEntity,
        userGroupEntities,
        workspaceEntities,
        environment, 
        timeFrame, 
        announcementOwner,
        onlyUnread,
        loggedUser,
        onlyArchived,
        firstResult, 
        maxResults);
    
    return announcements;
  }

  public List<Announcement> listWorkspaceAnnouncements(OrganizationEntity organizationEntity, List<WorkspaceEntity> workspaceEntities, 
      AnnouncementEnvironmentRestriction environment, AnnouncementTimeFrame timeFrame, UserEntity announcementOwner, boolean onlyUnread, Long loggedUser,  boolean onlyArchived, Integer firstResult, Integer maxResults) {
    
    List<Announcement> announcements = announcementDAO.listAnnouncements(
        organizationEntity,
        Collections.emptyList(),
        workspaceEntities, 
        environment, 
        timeFrame, 
        announcementOwner,
        onlyUnread,
        loggedUser,
        onlyArchived,
        firstResult, 
        maxResults);
    
    return announcements;
  }
  
  public List<Announcement> listAll() {
    return announcementDAO.listAll();
  }
  
  public Announcement findById(Long id) {
    return announcementDAO.findById(id);
  }
  
  public List<Announcement> listActiveByWorkspaceEntities(OrganizationEntity organizationEntity, List<WorkspaceEntity> workspaceEntities,  Integer firstResult, Integer maxResults) {
    List<Long> workspaceEntityIds = new ArrayList<>(workspaceEntities.size());
    
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      workspaceEntityIds.add(workspaceEntity.getId());
    }
    
    List<Announcement> result = new ArrayList<>(announcementDAO.listAnnouncements(organizationEntity,
        Collections.emptyList(), workspaceEntities, AnnouncementEnvironmentRestriction.NONE, AnnouncementTimeFrame.CURRENT, false, null, false, firstResult, maxResults));

    
    Collections.sort(result, new Comparator<Announcement>() {
      public int compare(Announcement o1, Announcement o2) {
        return o2.getStartDate().compareTo(o1.getStartDate());
      }
    });
    
    return result;
  }
  
  public List<AnnouncementUserGroup> listAnnouncementUserGroups(Announcement announcement) {
    return announcementUserGroupDAO.listByAnnouncementAndArchived(announcement, Boolean.FALSE);
  }

  public List<AnnouncementWorkspace> listAnnouncementWorkspaces(Announcement announcement) {
    return announcementWorkspaceDAO.listByAnnouncementAndArchived(announcement, Boolean.FALSE);
  }

  /**
   * Lists announcement workspaces and return them as sorted list so that the users' workspaces are first
   * @param userIdentifier 
   */
  public List<AnnouncementWorkspace> listAnnouncementWorkspacesSortByUserFirst(Announcement announcement, SchoolDataIdentifier userIdentifier) {
    List<WorkspaceEntity> userWorkspaces = workspaceEntityController.listActiveWorkspaceEntitiesByUserIdentifier(userIdentifier);
    Set<Long> userWorkspaceIds = userWorkspaces.stream().map(workspace -> workspace.getId()).collect(Collectors.toSet());
    List<AnnouncementWorkspace> announcementWorkspaces = announcementWorkspaceDAO.listByAnnouncementAndArchived(announcement, Boolean.FALSE);

    announcementWorkspaces.sort(new Comparator<AnnouncementWorkspace>() {
      @Override
      public int compare(AnnouncementWorkspace o1, AnnouncementWorkspace o2) {
        boolean o1user = userWorkspaceIds.contains(o1.getWorkspaceEntityId());
        boolean o2user = userWorkspaceIds.contains(o2.getWorkspaceEntityId());
        
        if (o1user && !o2user)
          return -1;
        if (o2user && !o1user)
          return 1;
        return 0;
      }
    });

    return announcementWorkspaces;
  }
  
  public void archive(Announcement announcement) {
    announcementDAO.updateArchived(announcement, Boolean.TRUE);
  }

  public void delete(Announcement announcement) {
    announcementDAO.delete(announcement);
  }
  
  public void deleteAnnouncementRecipientsByAnnouncement(Announcement announcement) {
    for (AnnouncementRecipient recipient : announcementRecipientDAO.listByAnnouncement(announcement)) {
      announcementRecipientDAO.delete(recipient);
    }
  }
  
  public void deleteAnnouncementTargetGroups(Announcement announcement) {
    for (AnnouncementUserGroup announcementUserGroup : announcementUserGroupDAO.listByAnnouncementAndArchived(announcement, Boolean.FALSE)) {
      announcementUserGroupDAO.delete(announcementUserGroup);
    }
  }
  
  public void clearAnnouncementTargetGroups(Announcement announcement) {
    for (AnnouncementUserGroup announcementUserGroup : announcementUserGroupDAO.listByAnnouncementAndArchived(announcement, Boolean.FALSE)) {
      announcementUserGroupDAO.updateArchived(announcementUserGroup, Boolean.TRUE);
    }
  }

  public void clearAnnouncementWorkspaces(Announcement announcement) {
    for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaceDAO.listByAnnouncementAndArchived(announcement, Boolean.FALSE)) {
      announcementWorkspaceDAO.updateArchived(announcementWorkspace, Boolean.TRUE);
    }
  }
  
  public void deleteAnnouncementWorkspaces(Announcement announcement) {
    for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaceDAO.listByAnnouncementAndArchived(announcement, Boolean.FALSE)) {
      announcementWorkspaceDAO.delete(announcementWorkspace);
    }
  }

  public AnnouncementAttachment createAttachement(String contentType, byte[] content) {
    return announcementAttachmentDAO.create(RandomStringUtils.randomAlphanumeric(64), contentType, content);
  }
  
  public AnnouncementAttachment findAttachmentByName(String name){
    return announcementAttachmentDAO.findByName(name);
  }
  
  public AnnouncementRecipient findAnnouncementRecipientByAnnouncementAndUserEntityId(Announcement announcement, Long userEntityId) {
    return announcementRecipientDAO.findByAnnouncementAndUserEntityId(announcement, userEntityId);
  }
  
  public AnnouncementRecipient createAnnouncementRecipient(Announcement announcement, Long userEntityId) {
    return announcementRecipientDAO.create(announcement, userEntityId);
  }
  
  public AnnouncementCategory createCategory(String category) {
    AnnouncementCategory categoryEntity = announcementCategoryDAO.findByName(category);
    if (categoryEntity == null) {
      categoryEntity = announcementCategoryDAO.create(category);
    }
    return categoryEntity;
  }
  
  public List<AnnouncementCategory> listAnnouncementCategories(){
    return announcementCategoryDAO.listAll();
  }
  
  public AnnouncementCategory findAnnouncementCategoryById(Long id) {
    return announcementCategoryDAO.findById(id);
  }
  
  public void deleteAnnouncementCategory(AnnouncementCategory announcementCategory) {
    announcementCategoryDAO.delete(announcementCategory);
  }
}
 
