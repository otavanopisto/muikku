package fi.muikku.plugins.announcer;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.plugins.announcer.model.Announcement;

@Named
@Stateful
@RequestScoped
@Join (path = "/announcements", to = "/jsf/announcement/index.jsf")
public class AnnouncementsViewBackingBean {
  
  @Parameter("announcementId")
  private Long announcementId;
  
  @Inject
  private AnnouncementController announcementController;
  
  @RequestAction
  public String init() {
    
    currentAnnouncement = announcementController.findById(announcementId);
    
    return null;
  }

  public Announcement getCurrentAnnouncement() {
    return currentAnnouncement;
  }
  
  private Announcement currentAnnouncement = null;
  private List<Announcement> announcements = null; 
}
