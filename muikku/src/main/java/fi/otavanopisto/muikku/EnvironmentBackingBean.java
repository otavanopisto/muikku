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
  
  private static final String ANALYTICS_GOOGLEANALYTICS_KEY_SETTING = "analytics.googleAnalytics.trackingID";
  
  @Inject
  private SystemSettingsController systemSettingsController;

  @PostConstruct
  public void init() {
    helpWorkspaceUrlName = systemSettingsController.getHelpWorkspaceUrlName();
    hasWorkspaceUrlName = StringUtils.isNotBlank(helpWorkspaceUrlName);
    
    googleAnalyticsTrackingId = systemSettingsController.getSetting(ANALYTICS_GOOGLEANALYTICS_KEY_SETTING);
  }
  
  public String getHelpWorkspaceUrlName() {
    return helpWorkspaceUrlName;
  }
  
  public boolean getHasWorkspaceUrlName() {
    return hasWorkspaceUrlName;
  }
  
  public String getGoogleAnalyticsTrackingId() {
    return googleAnalyticsTrackingId;
  }
  
  public boolean getHasGoogleAnalyticsTrackingId() {
    return StringUtils.isNotBlank(googleAnalyticsTrackingId);
  }

  private String helpWorkspaceUrlName;
  private boolean hasWorkspaceUrlName;
  private String googleAnalyticsTrackingId;
}
