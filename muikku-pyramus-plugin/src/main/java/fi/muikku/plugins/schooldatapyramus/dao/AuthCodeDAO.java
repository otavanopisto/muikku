package fi.muikku.plugins.schooldatapyramus.dao;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusDAO;
import fi.muikku.plugins.schooldatapyramus.model.AuthCode;

public class AuthCodeDAO extends SchoolDataPyramusDAO<AuthCode>{

  private static final long serialVersionUID = 6641254472859224402L;
  
  public AuthCode create(String authCode){
    AuthCode code = new AuthCode();
    code.setAuthCode(authCode);
    return persist(code);
  }

}
