package fi.muikku.servlet;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;

@RequestScoped
@Stateful
public class ServletObjectsContainer {

  public void setContextPath(String contextPath) {
    this.contextPath = contextPath;
  }
  
  public String getContextPath() {
    return contextPath;
  }

  private String contextPath;
}
