package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.io.IOException;
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

import de.neuland.jade4j.JadeConfiguration;
import de.neuland.jade4j.exceptions.JadeException;
import fi.otavanopisto.muikku.jade.JadeController;

public abstract class AbstractTimedNotificationStrategy implements TimedNotificationStrategy{
  
  @Resource
  private TimerService timerService;
  
  @Inject
  private JadeController jadeController;
  
  @Inject
  private TimedNotificationsJadeTemplateLoader timedNotificationsJadeTemplateLoader;
  
  @Inject
  private Logger logger;
  
  @PostConstruct
  public void init(){
    startTimer(getDuration());
  }
  
  @Timeout
  public void handleTimeout(){
    if(isActive()){
      sendNotifications();
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
  
  private Timer timer;
}
