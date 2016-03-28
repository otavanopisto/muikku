package fi.otavanopisto.muikku.servlet;

import javax.enterprise.context.RequestScoped;

@RequestScoped
public class ServletObjectsContainer {

  /**
   * Sets the context path (e.g. /muikku) for the ContextPath annotation.
   *  
   * @param contextPath The context path
   */
  public void setContextPath(String contextPath) {
    this.contextPath = contextPath;
  }
  
  /**
   * Returns the context path (e.g. /muikku) for the ContextPath annotation.
   * 
   * @return The context path
   */
  public String getContextPath() {
    return contextPath;
  }

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

  /** Context path for the ContextPath annotation */
  private String contextPath;

  /** Base URL for the BaseUrl annotation */
  private String baseUrl;
}
