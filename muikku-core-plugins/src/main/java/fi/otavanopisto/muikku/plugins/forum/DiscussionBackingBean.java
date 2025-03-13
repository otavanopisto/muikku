package fi.otavanopisto.muikku.plugins.forum;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.session.CurrentUserSession;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join (path = "/discussion", to = "/jsf/discussion/index.jsf")
@LoggedIn
public class DiscussionBackingBean {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private ForumController forumController;

  @Inject
  private CurrentUserSession currentUserSession;
  
  @RequestAction
  public String init() {
    if (!forumController.isEnvironmentForumActive() || !sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM) || !currentUserSession.isActive()) {
      return NavigationRules.ACCESS_DENIED;
    }
    return null;
  }
  
}
