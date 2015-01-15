package fi.muikku.plugins.schooldatapyramus.rest;

import javax.enterprise.context.ContextNotActiveException;
import javax.enterprise.context.SessionScoped;
import javax.enterprise.inject.Instance;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.BeanManager;
import javax.inject.Inject;

import fi.muikku.plugins.schooldatapyramus.rest.qualifier.PyramusSystem;
import fi.muikku.plugins.schooldatapyramus.rest.qualifier.PyramusUser;

public class PyramusClientProducer {

  @Inject
  @PyramusUser
  private Instance<UserPyramusClient> userPyramusClient;
  
  @Inject
  @PyramusSystem
  private Instance<SystemPyramusClient> systemPyramusClient;
 
  @Inject
  private BeanManager beanManager;
  
  private boolean isSessionActive() {
    try {
      return beanManager.getContext(SessionScoped.class).isActive();
    } catch (ContextNotActiveException ex) {
      return false;
    }
  }
  
  @Produces
  public PyramusClient producePyramusClient() {
    if (isSessionActive()) {
      return userPyramusClient.get();
    } else {
      return systemPyramusClient.get();
    }
  }
}
