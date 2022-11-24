package fi.otavanopisto.muikku.servlet;

import javax.enterprise.inject.Produces;
import javax.inject.Inject;

public class ServletObjectsProducer {

  @Inject
  private ServletObjectsContainer servletObjectsContainer;

  /**
   * Producer for the BaseUrl annotation.
   * 
   * @return The current base URL (including context path)
   */
  @Produces 
  @BaseUrl
  public String produceBaseUrl() {
    return servletObjectsContainer.getBaseUrl();
  }
  
}
