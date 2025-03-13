package fi.otavanopisto.muikku.plugins.announcer;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceBackingBean;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join(path = "/workspace/{workspaceUrlName}/announcements", to = "/jsf/workspace/workspace_announcements.jsf")
public class WorkspaceAnnouncementsViewBackingBean {

  @Parameter
  private String workspaceUrlName;
  
  @Parameter
  private Long announcementId;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private NavigationController navigationController;

  @Inject
  private AnnouncementController announcementController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceBackingBean workspaceBackingBean;
  
  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController
        .findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }

    if (!workspaceEntity.getPublished()) {
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_UNPUBLISHED_WORKSPACE, workspaceEntity)) {
        return NavigationRules.NOT_FOUND;
      }
    }

    if (workspaceEntity.getAccess() != WorkspaceAccess.ANYONE) {
      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.LIST_WORKSPACE_ANNOUNCEMENTS, workspaceEntity)) {
        if (!sessionController.isLoggedIn()) {
          return navigationController.requireLogin();
        } else {
          return NavigationRules.ACCESS_DENIED;
        }
      }
    }

    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
    workspaceName = workspaceBackingBean.getWorkspaceName();
    workspaceNameExtension = workspaceBackingBean.getWorkspaceNameExtension();

    if (sessionController.isLoggedIn()) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
      OrganizationEntity organizationEntity = userSchoolDataIdentifier.getOrganization();
      
      if (organizationEntity != null) {
        if (announcementId != null) {
          Announcement announcement = announcementController.findById(announcementId);
          if (announcement != null && Objects.equals(organizationEntity.getId(), announcement.getOrganizationEntityId())) {
            currentAnnouncement = announcement;
          }
        }
        
        activeAnnouncements = announcementController
            .listActiveByWorkspaceEntities(organizationEntity, Collections.singletonList(workspaceEntity));
      }
    } else {
      currentAnnouncement = null;
      activeAnnouncements = Collections.emptyList();
    }
    
    return null;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }
  
  public String getWorkspaceNameExtension() {
    return workspaceNameExtension;
  }
  
  public void setWorkspaceNameExtension(String workspaceNameExtension) {
    this.workspaceNameExtension = workspaceNameExtension;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Long getAnnouncementId() {
    return announcementId;
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

  private String workspaceName;
  private String workspaceNameExtension;
  private Long workspaceEntityId;
  private Announcement currentAnnouncement = null;
  private List<Announcement> activeAnnouncements = null; 

}
