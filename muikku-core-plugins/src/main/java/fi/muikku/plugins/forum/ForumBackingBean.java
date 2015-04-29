package fi.muikku.plugins.forum;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

import fi.muikku.plugins.forum.model.EnvironmentForumArea;

@Named
@Stateful
@RequestScoped
@Join (path = "/discussion", to = "/jsf/discussion/index.jsf")
public class ForumBackingBean {
  
  @Inject
  private ForumController forumController;
  
  public List<EnvironmentForumArea> listForumAreas() {
    return forumController.listEnvironmentForums();
  }
  
  public void setup() {
    forumController.createEnvironmentForumArea("Yleinen keskustelu", null);
  }
}
