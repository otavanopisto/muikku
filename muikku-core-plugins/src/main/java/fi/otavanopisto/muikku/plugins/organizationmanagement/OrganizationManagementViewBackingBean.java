package fi.otavanopisto.muikku.plugins.organizationmanagement;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join(path = "/organization", to = "/jsf/organization/index.jsf")
public class OrganizationManagementViewBackingBean {

  @Inject
  private SessionController sessionController;

  @RequestAction
  public String init() {
    if (!sessionController.hasEnvironmentPermission(OrganizationManagementPermissions.ORGANIZATION_VIEW)) {
      return NavigationRules.ACCESS_DENIED;
    }
    return null;
  }
}