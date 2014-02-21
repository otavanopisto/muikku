package fi.muikku.auth;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.security.AuthSourceDAO;
import fi.muikku.dao.security.AuthSourceSettingDAO;
import fi.muikku.model.security.AuthSource;
import fi.muikku.model.security.AuthSourceSetting;

@Dependent
@Stateless
public class AuthSourceController {

  @Inject
  private AuthSourceDAO authSourceDAO;

  @Inject
  private AuthSourceSettingDAO authSourceSettingsDAO;
  
  // AuthSource
  
  public AuthSource findAuthSourceById(Long id) {
    return authSourceDAO.findById(id);
  }
  
  // AuthSourceSettings
 
  public AuthSourceSetting findAuthSourceSettingsByKey(AuthSource authSource, String key) {
    return authSourceSettingsDAO.findByAuthSourceAndKey(authSource, key);
  }
  
  public List<AuthSourceSetting> listAuthSourceSettings(AuthSource authSource) {
    return authSourceSettingsDAO.listByAuthSource(authSource);
  }
  
}
