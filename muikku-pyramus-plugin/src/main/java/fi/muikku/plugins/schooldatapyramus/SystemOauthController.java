package fi.muikku.plugins.schooldatapyramus;

import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.schooldatapyramus.dao.SystemAccessTokenDAO;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;

@Dependent
public class SystemOauthController {

  @Inject
  private SystemAccessTokenDAO systemAccessTokenDAO;
  
  public SystemAccessToken createSystemAccessToken(String accessToken, Long expires, String refreshToken){
    return systemAccessTokenDAO.create(accessToken, expires, refreshToken);
  }
  
  public synchronized SystemAccessToken getSystemAccessToken(){
    List<SystemAccessToken> systemAccessTokens = systemAccessTokenDAO.listAll();
    if(systemAccessTokens.isEmpty()){
      return null;
    }
    return systemAccessTokens.get(systemAccessTokens.size() - 1);
  }
  
  public SystemAccessToken refreshSystemAccessToken(SystemAccessToken systemAccessToken, String accessToken, Long expires){
    systemAccessToken = systemAccessTokenDAO.updateAccessToken(systemAccessToken, accessToken);
    return systemAccessTokenDAO.updateExpires(systemAccessToken, expires);
  }
  
}
