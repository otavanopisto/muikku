package fi.muikku.plugins.announcer.dao;

import java.util.Date;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.announcer.model.Announcement;

public class AnnouncementDAO extends CorePluginsDAO<Announcement> {
	
  private static final long serialVersionUID = -8721990589622544635L;
  
  public Announcement create(
      String caption,
      String content,
      Date created,
      Long publisherUserEntityId
  ) {
    Announcement announcement = new Announcement();
    announcement.setCaption(caption);
    announcement.setContent(content);
    announcement.setCreated(created);
    announcement.setPublisherUserEntityId(publisherUserEntityId);
    
    getEntityManager().persist(announcement);
    return announcement;
  }
}
