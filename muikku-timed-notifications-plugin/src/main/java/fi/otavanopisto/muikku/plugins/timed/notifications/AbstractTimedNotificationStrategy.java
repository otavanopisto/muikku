package fi.otavanopisto.muikku.plugins.timed.notifications;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;

public abstract class AbstractTimedNotificationStrategy implements TimedNotificationStrategy{
  
  @Resource
  private TimerService timerService;
  
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
