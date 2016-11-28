package fi.otavanopisto.muikku.plugins.forum;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/discussion", to = "/jsf/discussion/index.jsf")
@LoggedIn
public class DiscussionBackingBean {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private ForumController forumController;

  @RequestAction
  public String init() {
    List<EnvironmentForumArea> forumAreas = forumController.listEnvironmentForums();
    lockStickyPermission = sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_LOCK_OR_STICKIFY_MESSAGES);
    showFullNamePermission = sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_SHOW_FULL_NAMES);
        
    Map<Long, AreaPermission> areaPermissions = new HashMap<>();
    
    for (EnvironmentForumArea forumArea : forumAreas) {
      areaPermissions.put(forumArea.getId(), new AreaPermission(sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_DELETE_ENVIRONMENT_MESSAGES, forumArea)));
    }
    
    try {
      this.areaPermissions = new ObjectMapper().writeValueAsString(areaPermissions);
    } catch (JsonProcessingException e) {
      return NavigationRules.INTERNAL_ERROR;
    }
    
    return null;
  }
  
  public Boolean getLockStickyPermission() {
    return lockStickyPermission;
  }
  
  public Boolean getShowFullNamePermission() {
    return showFullNamePermission;
  }
  
  public String getAreaPermissions() {
    return areaPermissions;
  }
  
  private String areaPermissions;
  private Boolean lockStickyPermission;
  private Boolean showFullNamePermission;
  
  public static class AreaPermission {
    
    public AreaPermission(Boolean removeThread) {
      this.removeThread = removeThread;
    }

    public Boolean getRemoveThread() {
      return removeThread;
    }
    
    private Boolean removeThread;
  }
  
}
