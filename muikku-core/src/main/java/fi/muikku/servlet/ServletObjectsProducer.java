package fi.muikku.servlet;

import javax.enterprise.inject.Produces;
import javax.inject.Inject;

public class ServletObjectsProducer {

  @Inject
  private ServletObjectsContainer servletObjectsContainer;

  @Produces 
  @ContextPath
  public String produceContextPath() {
    return servletObjectsContainer.getContextPath();
  }
  
}
