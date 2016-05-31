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
  
  public Announcement create(UserEntity publisher, String caption, String content, Date startDate, Date endDate, boolean publiclyVisible) {
    return announcementDAO.create(
        publisher.getId(),
        caption,
        content,
        new Date(),
        startDate,
        endDate,
        false,
        publiclyVisible);
  }

  public AnnouncementUserGroup addAnnouncementTargetGroup(Announcement announcement, UserGroupEntity userGroupEntity) {
    return announcementUserGroupDAO.create(
      announcement,
      userGroupEntity.getId(),
      false);
  }
  
  public AnnouncementWorkspace addAnnouncementWorkspace(Announcement announcement, WorkspaceEntity workspaceEntity) {
    return announcementWorkspaceDAO.create(announcement, workspaceEntity.getId(), false);
  }

  public Announcement update(Announcement announcement, String caption, String content, Date startDate, Date endDate, boolean publiclyVisible) {
    announcementDAO.updateCaption(announcement, caption);
    announcementDAO.updateContent(announcement, content);
    announcementDAO.updateStartDate(announcement, startDate);
    announcementDAO.updateEndDate(announcement, endDate);
    announcementDAO.updatePubliclyVisible(announcement, publiclyVisible);
    return announcement;
  }
  
  public List<Announcement> listUnarchivedEnvironmentAnnouncements() {
    return announcementDAO.listByArchivedWithNoWorkspaces(false);
  }

  public List<Announcement> listUnarchivedAnnouncements() {
    return announcementDAO.listByArchived(false);
  }
  
  public List<Announcement> listUnarchivedByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    return announcementDAO.listByArchivedAndWorkspaceEntityId(false, workspaceEntity.getId());
  }

  public List<Announcement> listActiveByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    return announcementDAO.listByArchivedAndDateAndWorkspaceEntityId(false, new Date(), workspaceEntity.getId());
  }
  
  public List<Announcement> listAll() {
    return announcementDAO.listAll();
  }
  
  public List<Announcement> listActiveEnvironmentAnnouncements() {
    return announcementDAO.listByArchivedAndDateWithNoWorkspaces(false, new Date());
  }

  public List<Announcement> listActiveAnnouncements() {
    return announcementDAO.listByArchivedAndDate(false, new Date());
  }
  
  public Announcement findById(Long id) {
    return announcementDAO.findById(id);
  }
  
  public List<Announcement> listActiveByUserGroupEntities(List<UserGroupEntity> userGroupEntities) {
    List<Long> userGroupEntityIds = new ArrayList<>();
    
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      userGroupEntityIds.add(userGroupEntity.getId());
    }
    
    Date currentDate = new Date();
    List<Announcement> result = new ArrayList<>();
    
    result.addAll(announcementDAO.listByArchivedAndDateAndUserGroupEntityIdsAndPubliclyVisible(
        false,
        currentDate,
        userGroupEntityIds,
        false));
    
    result.addAll(announcementDAO.listByArchivedAndDateAndPubliclyVisibleWithNoWorkspaces(
        false,
        currentDate,
        true));
    
    Collections.sort(result, new Comparator<Announcement>() {
      public int compare(Announcement o1, Announcement o2) {
        return o2.getStartDate().compareTo(o1.getStartDate());
      }
    });
    
    return result;
  }

  public List<Announcement> listActiveByWorkspaceEntities(List<WorkspaceEntity> workspaceEntities) {
    List<Long> workspaceEntityIds = new ArrayList<>(workspaceEntities.size());
    
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      workspaceEntityIds.add(workspaceEntity.getId());
    }
    
    Date currentDate = new Date();
    List<Announcement> result = new ArrayList<>(announcementDAO.listByArchivedAndDateAndWorkspaceEntityIds(
        false,
        currentDate,
        workspaceEntityIds));
    
    Collections.sort(result, new Comparator<Announcement>() {
      public int compare(Announcement o1, Announcement o2) {
        return o2.getStartDate().compareTo(o1.getStartDate());
      }
    });
    
    return result;
  }
  
  public List<Announcement> listActiveEnvironmentAnnouncementsByTargetedUserEntity(UserEntity targetedUserEntity) {
    List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupsByUserEntity(targetedUserEntity);
    return listActiveByUserGroupEntities(userGroupEntities);
  }
  
  public List<Announcement> listActiveEnvironmentAndWorkspaceAnnouncementsByTargetedUserEntity(UserEntity targetedUserEntity) {
    List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupsByUserEntity(targetedUserEntity);
    List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntitiesByWorkspaceUser(targetedUserEntity);
    List<Announcement> result = new ArrayList<>();
    
    result.addAll(listActiveByUserGroupEntities(userGroupEntities));
    result.addAll(listActiveByWorkspaceEntities(workspaceEntities));
    
    Collections.sort(result, new Comparator<Announcement>() {
      public int compare(Announcement o1, Announcement o2) {
        return o2.getStartDate().compareTo(o1.getStartDate());
      }
    });
    
    return result;
  }
  
  public List<AnnouncementUserGroup> listUserGroups(Announcement announcement) {
    return announcementUserGroupDAO.listByAnnouncementAndArchived(
        announcement,
        false);
  }

  public List<AnnouncementWorkspace> listWorkspaces(Announcement announcement) {
    return announcementWorkspaceDAO.listByAnnouncementAndArchived(
        announcement,
        false);
  }

  public void archive(Announcement announcement) {
    announcementDAO.updateArchived(announcement, Boolean.TRUE);
  }

  public void delete(Announcement announcement) {
    announcementDAO.delete(announcement);
  }
  
  public void deleteAnnouncementTargetGroups(Announcement announcement) {
    for (AnnouncementUserGroup announcementUserGroup : announcementUserGroupDAO.listByAnnouncementAndArchived(announcement, false)) {
      announcementUserGroupDAO.delete(announcementUserGroup);
    }
  }
  
  public void clearAnnouncementTargetGroups(Announcement announcement) {
    for (AnnouncementUserGroup announcementUserGroup : announcementUserGroupDAO.listByAnnouncementAndArchived(announcement, false)) {
      announcementUserGroupDAO.updateArchived(announcementUserGroup, Boolean.TRUE);
    }
  }

  public void clearAnnouncementWorkspaces(Announcement announcement) {
    for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaceDAO.listByAnnouncementAndArchived(announcement, false)) {
      announcementWorkspaceDAO.updateArchived(announcementWorkspace, Boolean.TRUE);
    }
  }
  
}
 
