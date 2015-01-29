package fi.muikku.schooldata;

import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

@RequestScoped
public class SchoolSessionDataController {
  
  @Inject
  private Logger logger;
  
  @PostConstruct
  public void init() {
    systemSessionActive = false;
  }
  
  @PreDestroy
  public void deinit() {
    if (systemSessionActive) {
      logger.severe("System session active leak detected!");
    }
  }
  
  /**
   * Forces school data bridge to use system bridge instead of user bridge. 
   * 
   * Use with caution because incorrect usage may lead to security leaks
   */
  public void startSystemSession() {
    systemSessionActive = true;
  }
  
  /**
   * Ends system session forcing
   */
  public void endSystemSession() {
    systemSessionActive = false;
  }

  /**
   * Returns whether school data bridge should be forced to be used as system user
   * 
   * @return whether school data bridge should be forced to be used as system user
   */
  public boolean isSystemSessionActive() {
    return systemSessionActive;
  }
  
  private boolean systemSessionActive;
}
