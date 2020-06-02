package fi.otavanopisto.muikku.session;

public interface RestAuthentication {

  public boolean isLoggedIn();

  public String getActiveUserIdentifier();
  
  public String getActiveUserSchoolDataSource();
  
  public boolean isActiveUser();
  
  public void setActiveUser(String dataSource, String identifier, boolean isActive); 

  public void logout();

}
