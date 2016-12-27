package fi.otavanopisto.muikku.plugins.announcer;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementDAO;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementEnvironmentRestriction;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementTimeFrame;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementUserGroupDAO;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementWorkspaceDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
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
  
  public Announcement createAnnouncement(UserEntity publisher, String caption, String content, Date startDate, Date endDate, boolean publiclyVisible) {
    return announcementDAO.create(
        publisher.getId(),
        caption,
        content,
        new Date(),
        startDate,
        endDate,
        Boolean.FALSE,
        publiclyVisible);
  }

  public AnnouncementUserGroup addAnnouncementTargetGroup(Announcement announcement, UserGroupEntity userGroupEntity) {
    return announcementUserGroupDAO.create(announcement, userGroupEntity.getId(), Boolean.FALSE);
  }
  
  public AnnouncementWorkspace addAnnouncementWorkspace(Announcement announcement, WorkspaceEntity workspaceEntity) {
    return announcementWorkspaceDAO.create(announcement, workspaceEntity.getId(), Boolean.FALSE);
  }

  public Announcement updateAnnouncement(Announcement announcement, String caption, String content, Date startDate, Date endDate, boolean publiclyVisible) {
    announcementDAO.updateCaption(announcement, caption);
    announcementDAO.updateContent(announcement, content);
    announcementDAO.updateStartDate(announcement, startDate);
    announcementDAO.updateEndDate(announcement, endDate);
    announcementDAO.updatePubliclyVisible(announcement, publiclyVisible);
    return announcement;
  }
  
  public List<Announcement> listAnnouncements(boolean includeGroups, boolean includeWorkspaces, 
      AnnouncementEnvironmentRestriction environment, AnnouncementTimeFrame timeFrame, UserEntity user, 
      boolean userAsOwner, boolean onlyArchived) {
    List<UserGroupEntity> userGroupEntities = includeGroups ? userGroupEntityController.listUserGroupsByUserEntity(user) : Collections.emptyList();
    List<WorkspaceEntity> workspaceEntities = includeWorkspaces ? workspaceEntityController.listWorkspaceEntitiesByWorkspaceUser(user) : Collections.emptyList();
    
    List<Announcement> announcements = announcementDAO.listAnnouncements(
        userGroupEntities,
        workspaceEntities,
        environment, 
        timeFrame, 
        userAsOwner ? user : null,
        onlyArchived);
    
    return announcements;
  }

  public List<Announcement> listWorkspaceAnnouncements(List<WorkspaceEntity> workspaceEntities, 
      AnnouncementEnvironmentRestriction environment, AnnouncementTimeFrame timeFrame, UserEntity user, 
      boolean userAsOwner, boolean onlyArchived) {
    List<Announcement> announcements = announcementDAO.listAnnouncements(
        Collections.emptyList(),
        workspaceEntities, 
        environment, 
        timeFrame, 
        userAsOwner ? user : null,
        onlyArchived);
    
    return announcements;
  }
  
  public List<Announcement> listAll() {
    return announcementDAO.listAll();
  }
  
  public Announcement findById(Long id) {
    return announcementDAO.findById(id);
  }
  
  public List<Announcement> listActiveByWorkspaceEntities(List<WorkspaceEntity> workspaceEntities) {
    List<Long> workspaceEntityIds = new ArrayList<>(workspaceEntities.size());
    
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      workspaceEntityIds.add(workspaceEntity.getId());
    }
    
    List<Announcement> result = new ArrayList<>(announcementDAO.listAnnouncements(
        Collections.emptyList(), workspaceEntities, AnnouncementEnvironmentRestriction.NONE, AnnouncementTimeFrame.CURRENT, false));
    
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
   * Lists announcement workspaces that are published to workspaces the user is part of
   * 
   * @param announcement
   * @param userEntity
   * @return
   */
  public List<AnnouncementWorkspace> listAnnouncementWorkspaces(Announcement announcement, UserEntity userEntity) {
    List<WorkspaceEntity> workspaces = workspaceEntityController.listWorkspaceEntitiesByWorkspaceUser(userEntity);
    return announcementWorkspaceDAO.listByAnnouncementAndWorkspacesAndArchived(announcement, workspaces, Boolean.FALSE);
  }
  
  public void archive(Announcement announcement) {
    announcementDAO.updateArchived(announcement, Boolean.TRUE);
  }

  public void delete(Announcement announcement) {
    announcementDAO.delete(announcement);
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
  
}
 
