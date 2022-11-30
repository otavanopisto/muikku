package fi.otavanopisto.muikku.auth;

import javax.servlet.http.HttpServletRequest;

import fi.otavanopisto.muikku.model.security.AuthSource;

/**
* Defines a base interface for all authentication interfaces
*/
public interface AuthenticationProvider {
  
  /**
   * Returns the name of this authentication provider.
   *
   * @return The name of this authentication provider
   */
  public String getName();
  
  /**
   * Returns the human readable descriptions of this authentication provider
   * 
   * @return The human readable description of this authentication provider
   */
  public String getDescription();
  
  /**
   * Returns whether this provider requires credentials, i.e. username and password
   *
   * @return <code>true</code> if the provider requires credentials, otherwise <code>false</code>
   */
  public boolean requiresCredentials();
  
  /**
   * Processes the login request.
   *
   * @throws AuthenticationException
   */
  public AuthenticationResult processLogin(HttpServletRequest request, AuthSource authSource);

  /**
   * Processes the logout request.
   *
   * @throws AuthenticationException
   */
  public AuthenticationResult processLogout(AuthSource authSource);

}
