package fi.muikku.plugins.announcer.dao;

import org.joda.time.LocalDate;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.announcer.model.Announcement;

public class AnnouncementDAO extends CorePluginsDAO<Announcement> {
	
  private static final long serialVersionUID = -8721990589622544635L;
  
  public Announcement create(
      String caption,
      String content,
      LocalDate created,
      Long publisherUserEntityId
  ) {
    Announcement announcement = new Announcement();
    announcement.setCaption(caption);
    announcement.setContent(content);
    announcement.setCreated(created.toDateTimeAtStartOfDay().toDate());
    announcement.setPublisherUserEntityId(publisherUserEntityId);
    
    getEntityManager().persist(announcement);
    return announcement;
  }
}
