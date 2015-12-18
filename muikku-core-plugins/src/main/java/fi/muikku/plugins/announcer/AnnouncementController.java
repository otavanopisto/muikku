package fi.muikku.plugins.announcer;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.plugins.announcer.dao.AnnouncementDAO;
import fi.muikku.plugins.announcer.dao.AnnouncementUserGroupDAO;
import fi.muikku.plugins.announcer.model.Announcement;
import fi.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.muikku.users.UserGroupEntityController;

public class AnnouncementController {
  
  @Inject
  private AnnouncementDAO announcementDAO;
  
  @Inject
  private AnnouncementUserGroupDAO announcementUserGroupDAO;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  public Announcement create(
      UserEntity publisher,
      String caption,
      String content,
      Date startDate,
      Date endDate,
      boolean publiclyVisible
  ) {
    return announcementDAO.create(
        publisher.getId(),
        caption,
        content,
        new Date(),
        startDate,
        endDate,
        false,
        publiclyVisible
    );
  }

  public Announcement update(
      Announcement announcement,
      String caption,
      String content,
      Date startDate,
      Date endDate,
      boolean publiclyVisible
  ) {
    announcementDAO.updateCaption(announcement, caption);
    announcementDAO.updateContent(announcement, content);
    announcementDAO.updateStartDate(announcement, startDate);
    announcementDAO.updateEndDate(announcement, endDate);
    announcementDAO.updatePubliclyVisible(announcement, publiclyVisible);
    return announcement;
  }
  
  public List<Announcement> listUnarchived() {
    return announcementDAO.listByArchived(false);
  }
  
  public List<Announcement> listAll() {
    return announcementDAO.listAll();
  }
  
  public List<Announcement> listActive() {
    return announcementDAO.listByArchivedAndDate(false, new Date());
  }
  
  public Announcement findById(Long id) {
    return announcementDAO.findById(id);
  }
  
  public void archive(Announcement announcement) {
    announcementDAO.archive(announcement);
  }
  
  public void addAnnouncementTargetGroup(
      Announcement announcement,
      UserGroupEntity userGroupEntity
  ) {
    announcementUserGroupDAO.create(
        announcement,
        userGroupEntity.getId(),
        false
    );
  }
  
  public void clearAnnouncementTargetGroups(
      Announcement announcement
  ) {
    for (AnnouncementUserGroup announcementUserGroup :
        announcementUserGroupDAO.listByAnnouncementAndArchived(announcement, false)) {
      announcementUserGroupDAO.archive(announcementUserGroup);
    }
  }
  
  public List<Announcement> listActiveByUserGroupEntities(
      List<UserGroupEntity> userGroupEntities
  ) {
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
    result.addAll(announcementDAO.listByArchivedAndDateAndPubliclyVisible(
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
  
  public List<Announcement> listActiveByTargetedUserEntity(
      UserEntity targetedUserEntity
  ) {
    List<UserGroupEntity> userGroupEntities = 
        userGroupEntityController.listUserGroupsByUser(targetedUserEntity);
    
    return listActiveByUserGroupEntities(userGroupEntities);
  }
  
  public List<AnnouncementUserGroup> listUserGroups(Announcement announcement) {
    return announcementUserGroupDAO.listByAnnouncementAndArchived(
        announcement,
        false);
  }
}
 
