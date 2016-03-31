package fi.otavanopisto.muikku.environment;

import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.EnvironmentDefaultsDAO;
import fi.otavanopisto.muikku.model.base.EnvironmentDefaults;

@Dependent
public class EnvironmentSettingsProducer {

  @Inject
  private Logger logger;
  
  @Inject
  private EnvironmentDefaultsDAO environmentDefaultsDAO;

  @Produces 
  @HttpPort
  public Integer produceHttpPort() {
    EnvironmentDefaults environmentDefaults = environmentDefaultsDAO.find();
    if (environmentDefaults == null) {
      logger.warning("Environment default http port is not defined falling back to default 8080");
      return 8080;
    }
    
    return environmentDefaults.getHttpPort();
  }
  
  @Produces 
  @HttpsPort
  public Integer produceHttpsPort() {
    EnvironmentDefaults environmentDefaults = environmentDefaultsDAO.find();
    if (environmentDefaults == null) {
      logger.warning("Environment default http port is not defined falling back to default 8443");
      return 8443;
    }
    
    return environmentDefaults.getHttpsPort();
  }
  
}
