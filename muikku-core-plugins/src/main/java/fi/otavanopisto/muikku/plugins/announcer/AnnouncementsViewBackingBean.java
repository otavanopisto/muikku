package fi.otavanopisto.muikku.plugins.announcer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementEnvironmentRestriction;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementTimeFrame;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceBasicInfo;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRESTModelController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
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
  
  @Inject
  private WorkspaceRESTModelController workspaceRESTModelController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @RequestAction
  public String init() {
    if (sessionController.isLoggedIn()) {
      SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
      OrganizationEntity organizationEntity = userSchoolDataIdentifier.getOrganization();
      
      if (announcementId != null) {
        Announcement announcement = announcementController.findById(announcementId);
        
        if (announcement != null && Objects.equals(organizationEntity.getId(), announcement.getOrganizationEntityId())) {
          currentAnnouncement = announcement;
          
          if (currentAnnouncement != null) {
            List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspacesSortByUserFirst(currentAnnouncement, loggedUser);
            currentAnnouncementWorkspaces = new ArrayList<WorkspaceBasicInfo>();
            for (AnnouncementWorkspace aw : announcementWorkspaces) {
              currentAnnouncementWorkspaces.add(workspaceRESTModelController.workspaceBasicInfo(aw.getWorkspaceEntityId()));
            }
          }
        }
      }
    
      AnnouncementEnvironmentRestriction environment = 
          sessionController.hasEnvironmentPermission(AnnouncerPermissions.LIST_ENVIRONMENT_GROUP_ANNOUNCEMENTS) ? 
              AnnouncementEnvironmentRestriction.PUBLICANDGROUP : AnnouncementEnvironmentRestriction.PUBLIC;
      AnnouncementTimeFrame timeFrame = AnnouncementTimeFrame.CURRENT;
      
      activeAnnouncements = announcementController.listAnnouncements(loggedUser, organizationEntity, true, true, environment, timeFrame, null, false);
    } else {
      currentAnnouncement = null;
      activeAnnouncements = Collections.emptyList();
    }
    return null;
  }

  public Announcement getCurrentAnnouncement() {
    return currentAnnouncement;
  }
  
  public List<WorkspaceBasicInfo> getCurrentAnnouncementWorkspaces() {
    return currentAnnouncementWorkspaces;
  }

  public List<Announcement> getActiveAnnouncements() {
    return activeAnnouncements;
  }
  
  public void setAnnouncementId(Long announcementId) {
    this.announcementId = announcementId;
  }
  
  private Announcement currentAnnouncement = null;
  private List<WorkspaceBasicInfo> currentAnnouncementWorkspaces = null; 
  private List<Announcement> activeAnnouncements = null; 
}
