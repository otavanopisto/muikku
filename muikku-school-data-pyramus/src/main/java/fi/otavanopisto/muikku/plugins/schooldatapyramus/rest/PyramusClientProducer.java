package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import javax.enterprise.context.ContextNotActiveException;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.context.SessionScoped;
import javax.enterprise.inject.Instance;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.BeanManager;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.qualifier.PyramusSystem;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.qualifier.PyramusUser;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;

public class PyramusClientProducer {

  @Inject
  @PyramusUser
  private Instance<UserPyramusClient> userPyramusClient;
  
  @Inject
  @PyramusSystem
  private Instance<SystemPyramusClient> systemPyramusClient;
  
  @Inject
  private Instance<SchoolDataBridgeSessionController> schoolDataBridgeSessionController;
 
  @Inject
  private BeanManager beanManager;
  
  @Produces
  public PyramusClient producePyramusClient() {
    if (isSessionActive()) {
      if (isRequestActive() && schoolDataBridgeSessionController.get().isSystemSessionActive()) {
        return systemPyramusClient.get();
      } else {
        return userPyramusClient.get();
      }
    } else {
      return systemPyramusClient.get();
    }
  }
  
  private boolean isSessionActive() {
    try {
      return beanManager.getContext(SessionScoped.class).isActive();
    } catch (ContextNotActiveException ex) {
      return false;
    }
  }
  
  private boolean isRequestActive() {
    try {
      return beanManager.getContext(RequestScoped.class).isActive();
    } catch (ContextNotActiveException ex) {
      return false;
    }
  }
  
}
