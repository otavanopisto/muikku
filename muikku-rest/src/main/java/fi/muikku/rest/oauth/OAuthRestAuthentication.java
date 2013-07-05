package fi.muikku.rest.oauth;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.dao.oauth.AccessTokenDAO;
import fi.muikku.dao.oauth.ConsumerDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.model.oauth.AccessToken;
import fi.muikku.model.oauth.Consumer;
import fi.muikku.model.users.UserEntity;
import fi.muikku.session.RestAuthentication;

@RequestScoped
@OAuthAuthentication
public class OAuthRestAuthentication implements RestAuthentication {
  
  @Inject
  private UserEntityDAO userDAO;

  @Inject
  private ConsumerDAO consumerDAO;

  @Inject
  private AccessTokenDAO accessTokenDAO;

  public void login(String consumerKey, String token) {
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    if (consumer == null) {
      // TODO: Exception?
    } else {
      AccessToken accessToken = accessTokenDAO.findByConsumerAndToken(consumer, token);
      if (accessToken != null) {
        userId = accessToken.getUser().getId();
      } else {
        // TODO: Exception?
      }
    }
  }
  
  @Override
  public boolean isLoggedIn() {
    return userId != null;
  }

  @Override
  public UserEntity getUser() {
    return userDAO.findById(userId);
  }

  @Override
  public void logout() {
    userId = null;
  }

  private Long userId = null;
}
