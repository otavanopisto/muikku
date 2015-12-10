package fi.muikku.plugins.announcer;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.announcer.dao.AnnouncementDAO;
import fi.muikku.plugins.announcer.model.Announcement;

public class AnnouncementController {
  
  @Inject
  private AnnouncementDAO announcementDAO;
  
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
        endDate
    );
  }

  public Announcement update(
      Announcement announcement,
      String caption,
      String content,
      Date startDate,
      Date endDate
  ) {
    return announcementDAO.update(
        announcement,
        caption,
        content,
        startDate,
        endDate
    );
  }
  
  public List<Announcement> listUnArchived() {
    return announcementDAO.listUnArchived();
  }
  
  public List<Announcement> listAll() {
    return announcementDAO.listAll();
  }
  
  public Announcement findById(Long id) {
    return announcementDAO.findById(id);
  }
  
  public void archiveById(Long id) {
    announcementDAO.archiveById(id);
  }
}
