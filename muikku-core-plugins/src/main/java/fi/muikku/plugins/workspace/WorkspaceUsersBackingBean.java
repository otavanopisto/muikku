package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

import fi.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/users", to = "/jsf/workspace/users.jsf")
public class WorkspaceUsersBackingBean {

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

}
