package fi.muikku.plugins.announcer;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.announcer.model.Announcement;
import fi.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join (path = "/announcements", to = "/jsf/announcements/index.jsf")
public class AnnouncementsViewBackingBean {
  
  @Parameter("announcementId")
  private Long announcementId;
  
  @Inject
  private AnnouncementController announcementController;
  
  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {
    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
    
    if (announcementId != null) {
      currentAnnouncement = announcementController.findById(announcementId);
    }
    activeAnnouncements = announcementController.listActiveByTargetedUserEntity(loggedUserEntity);
    
    return null;
  }

  public Announcement getCurrentAnnouncement() {
    return currentAnnouncement;
  }
  
  public List<Announcement> getActiveAnnouncements() {
    return activeAnnouncements;
  }
  
  public void setAnnouncementId(Long announcementId) {
    this.announcementId = announcementId;
  }
  
  private Announcement currentAnnouncement = null;
  private List<Announcement> activeAnnouncements = null; 
}
