package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import de.neuland.jade4j.JadeConfiguration;
import de.neuland.jade4j.exceptions.JadeException;
import fi.otavanopisto.muikku.jade.JadeController;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.plugins.timed.notifications.TimedNotificationsJadeTemplateLoader;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.users.OrganizationEntityController;

public abstract class AbstractTimedNotificationStrategy implements TimedNotificationStrategy {
  
  private static final String ENABLED_ORGANIZATIONS = System.getProperty("muikku.timednotifications.enabledorganizations");
  
  @Resource
  private TimerService timerService;
  
  @Inject
  private JadeController jadeController;
  
  @Inject
  private TimedNotificationsJadeTemplateLoader timedNotificationsJadeTemplateLoader;
  
  @Inject
  private Logger logger;
  
  @Inject
  private OrganizationEntityController organizationEntityController;
  
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
  
  protected String renderNotificationTemplate(String templateName, Map<String, Object> templateModel) {
    JadeConfiguration jadeConfiguration = new JadeConfiguration();
    jadeConfiguration.setTemplateLoader(timedNotificationsJadeTemplateLoader);
    try {
      return jadeController.renderTemplate(jadeConfiguration, templateName, templateModel);
    } catch (JadeException | IOException e) {
      logger.log(Level.SEVERE, "Error rendering notification template", e);
    }
    return null;
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
    
    if (StringUtils.isNotBlank(ENABLED_ORGANIZATIONS)) {
      String[] organizationIdentifiers = StringUtils.split(ENABLED_ORGANIZATIONS, ",");

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
