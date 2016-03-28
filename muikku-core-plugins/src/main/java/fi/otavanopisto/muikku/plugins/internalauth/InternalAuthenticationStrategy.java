package fi.otavanopisto.muikku.plugins.internalauth;

import java.util.Arrays;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.auth.AbstractAuthenticationStrategy;
import fi.otavanopisto.muikku.auth.AuthenticationProvider;
import fi.otavanopisto.muikku.auth.AuthenticationResult;
import fi.otavanopisto.muikku.auth.AuthenticationResult.Status;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.internalauth.model.InternalAuth;
import fi.otavanopisto.muikku.users.UserEntityController;

public class InternalAuthenticationStrategy extends AbstractAuthenticationStrategy implements AuthenticationProvider {

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private InternalAuthController internalLoginController;

  @Override
  public String getName() {
    return "internalauth";
  }

  @Override
  public boolean requiresCredentials() {
    return true;
  }

  @Override
  public AuthenticationResult processLogin(AuthSource authSource, Map<String, String[]> requestParameters) {
    String email = StringUtils.lowerCase(getFirstRequestParameter(requestParameters, "email"));
    String password = getFirstRequestParameter(requestParameters, "password");
    
    InternalAuth internalAuth = internalLoginController.findInternalAuthByEmailAndPassword(email, password);
    
    if (internalAuth != null) {
      UserEntity userEntity = userEntityController.findUserEntityById(internalAuth.getUserEntityId());
      if (userEntity != null) {
        return processLogin(authSource, requestParameters, DigestUtils.md5Hex("INTERNAL-" + internalAuth.getId()), Arrays.asList(email), null, null);
      }
    }
    
    return new AuthenticationResult(Status.INVALID_CREDENTIALS);
  }

  @Override
  public String getDescription() {
    return "Muikku account";
  }

}