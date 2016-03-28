package fi.otavanopisto.muikku.schooldata;

import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

@RequestScoped
public class SchoolDataBridgeSessionController {
  
  @Inject
  private Logger logger;
  
  @PostConstruct
  public void init() {
    systemSessionsActive = 0;
  }
  
  @PreDestroy
  public void deinit() {
    if (systemSessionsActive > 0) {
      logger.severe("System session active leak detected!");
    }
  }
  
  /**
   * Forces school data bridge to use system bridge instead of user bridge. 
   * 
   * Use with caution because incorrect usage may lead to security leaks
   */
  public void startSystemSession() {
    systemSessionsActive++;
  }
  
  /**
   * Ends system session forcing
   */
  public void endSystemSession() {
    systemSessionsActive--;
  }

  /**
   * Returns whether school data bridge should be forced to be used as system user
   * 
   * @return whether school data bridge should be forced to be used as system user
   */
  public boolean isSystemSessionActive() {
    return systemSessionsActive > 0;
  }
  
  private int systemSessionsActive = 0;

}