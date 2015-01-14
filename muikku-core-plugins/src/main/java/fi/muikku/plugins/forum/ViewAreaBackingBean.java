package fi.muikku.plugins.forum;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;

import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumThread;

@Named
@Stateful
@RequestScoped
@Join (path = "/forum/a/{forumIdStr}", to = "/forum/viewarea.jsf")
public class ViewAreaBackingBean {
  
  @Parameter
  private String forumIdStr;

  @Inject
  private ForumController forumController;
  
  public Long getForumId() {
    return Long.parseLong(getForumIdStr());
  }

  public ForumArea getForumArea() {
    return forumController.getForumArea(getForumId());
  }
  
  public List<ForumThread> listForumThreads() {
    return forumController.listForumThreads(getForumArea());
  }

  public String getForumIdStr() {
    return forumIdStr;
  }

  public void setForumIdStr(String forumIdStr) {
    this.forumIdStr = forumIdStr;
  }
}
