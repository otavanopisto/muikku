package fi.otavanopisto.muikku.servlet;

import javax.enterprise.context.RequestScoped;

@RequestScoped
public class ServletObjectsContainer {

  /**
   * Sets the base URL (e.g. http://muikku.dev:8080/muikku) for the BaseUrl annotation.
   *  
   * @param baseUrl The base URL
   */
  public void setBaseUrl(String baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Returns the base URL (e.g. http://muikku.dev:8080/muikku) for the BaseUrl annotation.
   *  
   * @param baseUrl The base URL
   */
  public String getBaseUrl() {
    return baseUrl;
  }

  /** Base URL for the BaseUrl annotation */
  private String baseUrl;
}
