package fi.otavanopisto.muikku.plugins.schooldatapyramus.dao;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusDAO;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.model.SystemAccessToken;

public class SystemAccessTokenDAO extends SchoolDataPyramusDAO<SystemAccessToken>{

  private static final long serialVersionUID = 5972049521006927888L;

  public SystemAccessToken create(String accessToken, Long expires, String refreshToken){
    SystemAccessToken systemAccessToken = new SystemAccessToken();
    systemAccessToken.setAccessToken(accessToken);
    systemAccessToken.setExpires(expires);
    systemAccessToken.setRefreshToken(refreshToken);
    return persist(systemAccessToken);
  }
  
  public SystemAccessToken updateExpires(SystemAccessToken systemAccessToken, Long expires){
    systemAccessToken.setExpires(expires);
    return persist(systemAccessToken);
  }
  
  public SystemAccessToken updateAccessToken(SystemAccessToken systemAccessToken, String accessToken){
    systemAccessToken.setAccessToken(accessToken);
    return persist(systemAccessToken);
  }
  
  public void delete(SystemAccessToken e) {
    super.delete(e);
  }
  
}
