package fi.otavanopisto.muikku;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;

@ApplicationScoped
@Named
@Stateful
public class EnvironmentBackingBean {
  
  @Inject
  private SystemSettingsController systemSettingsController;

  @PostConstruct
  public void init() {
    helpWorkspaceUrlName = systemSettingsController.getHelpWorkspaceUrlName();
    hasWorkspaceUrlName = StringUtils.isNotBlank(helpWorkspaceUrlName);
  }
  
  public String getHelpWorkspaceUrlName() {
    return helpWorkspaceUrlName;
  }
  
  public boolean getHasWorkspaceUrlName() {
    return hasWorkspaceUrlName;
  }
  
  private String helpWorkspaceUrlName;
  private boolean hasWorkspaceUrlName;
}
