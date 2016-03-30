package fi.otavanopisto.muikku.auth;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.AuthSourceDAO;
import fi.otavanopisto.muikku.dao.security.AuthSourceSettingDAO;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.model.security.AuthSourceSetting;

public class AuthSourceController {
  
  @Inject
  @Any
  private Instance<AuthenticationProvider> authenticationProviders;

  @Inject
  private AuthSourceDAO authSourceDAO;

  @Inject
  private AuthSourceSettingDAO authSourceSettingsDAO;
  
  // AuthSource
  
  public AuthSource findAuthSourceById(Long id) {
    return authSourceDAO.findById(id);
  }
 
  private AuthSource findAuthSourceByStrategy(String strategy) {
    return authSourceDAO.findByStrategy(strategy);
  }
  
  public List<AuthSource> listCredentialessAuthSources() {
    List<AuthSource> result = new ArrayList<>();
    
    List<AuthenticationProvider> authenticationProviders = listCredentialessAuthenticationProviders();
    for (AuthenticationProvider authenticationProvider : authenticationProviders) {
      AuthSource authSource = findAuthSourceByStrategy(authenticationProvider.getName());
      if (authSource != null) {
        result.add(authSource);
      }
    }
    
    return result;
  }
  
  public List<AuthSource> listCredentialAuthSources() {
    List<AuthSource> result = new ArrayList<>();
    
    List<AuthenticationProvider> authenticationProviders = listCredentialAuthenticationProviders();
    for (AuthenticationProvider authenticationProvider : authenticationProviders) {
      AuthSource authSource = findAuthSourceByStrategy(authenticationProvider.getName());
      if (authSource != null) {
        result.add(authSource);
      }
    }
    
    return result;
  }
  
  
  // AuthSourceSettings

  public AuthSourceSetting findAuthSourceSettingsByKey(AuthSource authSource, String key) {
    return authSourceSettingsDAO.findByAuthSourceAndKey(authSource, key);
  }
  
  public List<AuthSourceSetting> listAuthSourceSettings(AuthSource authSource) {
    return authSourceSettingsDAO.listByAuthSource(authSource);
  }
  
  // AuthenticationProvider
  
  public AuthenticationProvider findAuthenticationProvider(AuthSource authSource) {
    Iterator<AuthenticationProvider> providerIterator = authenticationProviders.iterator();
    while (providerIterator.hasNext()) {
      AuthenticationProvider provider = providerIterator.next();
      if (provider.getName().equals(authSource.getStrategy())) {
        return provider;
      }
    }
    
    return null;
  }
  
  public List<AuthenticationProvider> listCredentialAuthenticationProviders() {
    List<AuthenticationProvider> result = new ArrayList<>();
    
    Iterator<AuthenticationProvider> providerIterator = authenticationProviders.iterator();
    while (providerIterator.hasNext()) {
      AuthenticationProvider provider = providerIterator.next();
      if (provider.requiresCredentials()) {
        result.add(provider);
      }
    }
    
    return result;
  }

  public List<AuthenticationProvider> listCredentialessAuthenticationProviders() {
    List<AuthenticationProvider> result = new ArrayList<>();
    
    Iterator<AuthenticationProvider> providerIterator = authenticationProviders.iterator();
    while (providerIterator.hasNext()) {
      AuthenticationProvider provider = providerIterator.next();
      if (!provider.requiresCredentials()) {
        result.add(provider);
      }
    }
    
    return result;
  }
}
