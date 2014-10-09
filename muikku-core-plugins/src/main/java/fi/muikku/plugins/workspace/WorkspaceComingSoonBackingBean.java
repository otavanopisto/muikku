package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/comingsoon", to = "/workspaces/comingsoon.jsf")
public class WorkspaceComingSoonBackingBean {
  
}