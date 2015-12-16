package fi.muikku.plugins.announcer;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.plugins.announcer.dao.AnnouncementDAO;
import fi.muikku.plugins.announcer.dao.AnnouncementUserGroupDAO;
import fi.muikku.plugins.announcer.model.Announcement;

public class AnnouncementController {
  
  @Inject
  private AnnouncementDAO announcementDAO;
  
  @Inject
  private AnnouncementUserGroupDAO announcementUserGroupDAO;
  
  public Announcement create(
      UserEntity publisher,
      String caption,
      String content,
      Date startDate,
      Date endDate
  ) {
    return announcementDAO.create(
        publisher.getId(),
        caption,
        content,
        new Date(),
        startDate,
        endDate,
        false
    );
  }
  
  public List<Announcement> listUnarchived() {
    return announcementDAO.listByArchived(false);
  }
  
  public List<Announcement> listAll() {
    return announcementDAO.listAll();
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
        true
    );
  }
  
  public List<Announcement> listByUserGroupEntities(
      List<UserGroupEntity> userGroupEntities
  ) {
    List<Long> userGroupEntityIds = new ArrayList<>();
    
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      userGroupEntityIds.add(userGroupEntity.getId());
    }
    
    return announcementDAO.listByArchivedAndUserGroupIds(false, userGroupEntityIds);
  }
}
