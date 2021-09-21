package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.users.OrganizationEntityController;

public abstract class AbstractTimedNotificationStrategy implements TimedNotificationStrategy {
  
  @Resource
  private TimerService timerService;
  
  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @PostConstruct
  public void init(){
    startTimer(getDuration());
  }
  
  @Timeout
  public void handleTimeout(){
    if (isActive()) {
      schoolDataBridgeSessionController.startSystemSession();
      try {
        sendNotifications();
      } finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
    }
    startTimer(getDuration());
  }
   
  @Override
  public boolean isActive(){
    return true;
  }
  
  private void startTimer(long duration) {
    if (this.timer != null) {
      this.timer.cancel();
      this.timer = null;
    }
    
    TimerConfig timerConfig = new TimerConfig();
    timerConfig.setPersistent(false);
    
    this.timer = timerService.createSingleActionTimer(duration, timerConfig);
  }
  
  protected List<OrganizationEntity> getActiveOrganizations() {
    List<OrganizationEntity> result = new ArrayList<>();
    
    String enabledOrganizations = pluginSettingsController.getPluginSetting("timed-notifications", "enabledOrganizations");
    
    if (StringUtils.isNotBlank(enabledOrganizations)) {
      String[] organizationIdentifiers = StringUtils.split(enabledOrganizations, ",");

      for (String organizationIdentifierStr : organizationIdentifiers) {
        if (StringUtils.isNotBlank(organizationIdentifierStr)) {
          SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(organizationIdentifierStr);
          
          if (identifier != null) {
            OrganizationEntity organizationEntity = organizationEntityController.findByDataSourceAndIdentifierAndArchived(
                identifier.getDataSource(), identifier.getIdentifier(), Boolean.FALSE);
            if (organizationEntity != null) {
              result.add(organizationEntity);
            }
          }
        }
      }
    }

    return result;
  }
  
  private Timer timer;
}
