package fi.otavanopisto.muikku.session.local;

import javax.enterprise.context.RequestScoped;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.session.RestAuthentication;

@RequestScoped
@LocalSessionAuthentication
public class LocalSessionRestAuthentication implements RestAuthentication {
  
  @Override
  public String getActiveUserIdentifier() {
    return activeUserIdentifier;
  }
  
  public String getActiveUserSchoolDataSource() {
    return activeUserSchoolDataSource;
  }
  
  @Override
  public void setActiveUser(String dataSource, String identifier) {
    activeUserSchoolDataSource = dataSource;
    activeUserIdentifier = identifier;
  }
  
  @Override
  public boolean isLoggedIn() {
    return !StringUtils.isBlank(activeUserIdentifier) && !StringUtils.isBlank(activeUserSchoolDataSource);
  }
  
  @Override
  public void logout() {
    activeUserSchoolDataSource = null;
    activeUserIdentifier = null;
  }

  private String activeUserIdentifier;
  private String activeUserSchoolDataSource; 
}
