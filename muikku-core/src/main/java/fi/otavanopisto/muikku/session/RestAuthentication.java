package fi.otavanopisto.muikku.session;

public interface RestAuthentication {

  public boolean isLoggedIn();

  public String getActiveUserIdentifier();
  
  public String getActiveUserSchoolDataSource();
  
  public void setActiveUser(String dataSource, String identifier); 

  public void logout();

}
