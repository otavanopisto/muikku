package fi.muikku.auth;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import fi.muikku.model.security.AuthSource;
import fi.muikku.model.security.AuthSourceSetting;

public abstract class AbstractAuthenticationStrategy implements AuthenticationProvider {
  
  @Inject
  private AuthSourceController authSourceController; 
  
  protected String getFirstRequestParameter(Map<String, String[]> requestParameters, String key) {
    String[] value = requestParameters.get(key);
    if (value != null && value.length == 1) {
      return value[0];
    }
    
    return null;
  }
  
  protected String getAuthSourceSetting(AuthSource authSource, String key) {
    AuthSourceSetting authSourceSetting = authSourceController.findAuthSourceSettingsByKey(authSource, key);
    if (authSourceSetting != null) {
      return authSourceSetting.getValue();
    }
    
    return null;
  }

  protected AuthenticationResult processExternalLogin(AuthSource authSource, Map<String, String[]> requestParameters, String externalId, List<String> emails, String firstName, String lastName) {
    // TODO: This method should check whether user exists by finding existing user by externalId and given email addresses
    //   > If just one user exists, login the user 
    //   > If more than one user is found, it should raise a conflict exception
    //   > If no users are found, register it as a new user
    // After successful identification missing names and emails should be added
    return null;
  }

}