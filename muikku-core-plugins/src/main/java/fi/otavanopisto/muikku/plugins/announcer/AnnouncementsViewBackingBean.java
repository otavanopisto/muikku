package fi.otavanopisto.muikku.plugins.announcer;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementEnvironmentRestriction;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementTimeFrame;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@LoggedIn
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
    AnnouncementEnvironmentRestriction environment = 
        sessionController.hasEnvironmentPermission(AnnouncerPermissions.LIST_ENVIRONMENT_GROUP_ANNOUNCEMENTS) ? 
            AnnouncementEnvironmentRestriction.PUBLICANDGROUP : AnnouncementEnvironmentRestriction.PUBLIC;
    AnnouncementTimeFrame timeFrame = AnnouncementTimeFrame.CURRENT;
    activeAnnouncements = announcementController.listAnnouncements(true, true, environment, timeFrame, loggedUserEntity, false);
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
