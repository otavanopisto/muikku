package fi.otavanopisto.muikku.plugins.workspace;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

public abstract class AbstractWorkspaceBackingBean {

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private NavigationController navigationController;
  
  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String checkAccess() {
    String urlName = getWorkspaceUrlName();
    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    switch (workspaceEntity.getAccess()) {
      case ANYONE:
      break;
      case LOGGED_IN:
        if (!sessionController.isLoggedIn()) {
          return navigationController.requireLogin();
        }
      break;
      case MEMBERS_ONLY:
        if (!sessionController.isLoggedIn()) {
          return navigationController.requireLogin();
        }
        
        if (workspaceController.findWorkspaceUserByWorkspaceEntityAndUser(workspaceEntity, sessionController.getLoggedUser()) == null) {
          if (!sessionController.hasCoursePermission(MuikkuPermissions.ACCESS_MEMBERS_ONLY_WORKSPACE, workspaceEntity)) {
            return NavigationRules.ACCESS_DENIED;
          }
        }
      break;
    }
    
    return null;
  }
  
  public abstract String getWorkspaceUrlName();
  
}
