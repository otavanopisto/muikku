package fi.muikku.rest;

import java.io.IOException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.oauth.AccessTokenDAO;
import fi.muikku.dao.oauth.ConsumerDAO;
import fi.muikku.dao.oauth.RequestTokenDAO;
import fi.muikku.model.oauth.Consumer;
import fi.muikku.model.oauth.RequestToken;
import fi.muikku.model.stub.users.UserEntity;

@Stateful
@Named ("oAuthController")
@RequestScoped
public class OAuthContorller {

  @Inject
  private ConsumerDAO consumerDAO;

  @Inject
  private RequestTokenDAO requestTokenDAO;
  
  @Inject
  private AccessTokenDAO accessTokenDAO;
  
  public String acceptRequestToken(String confirmUri, String consumerKey, String reqToken, UserEntity user) {
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    if (consumer != null) {
      RequestToken requestToken = requestTokenDAO.findByToken(reqToken);
      if (requestToken != null) {
        requestTokenDAO.updateUser(requestToken, user);
        String confirmUrl = confirmUri + "?oauth_token=" + reqToken + "&xoauth_end_user_decision=yes";
          FacesContext facesContext = FacesContext.getCurrentInstance();

          ExternalContext externalContext = facesContext.getExternalContext();
          try {
            externalContext.redirect(confirmUrl);
          } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }
          facesContext.responseComplete();  
      
      }
    } else {
      // TODO: Exception?
    }
    
    return null;
  }
  
  public String declineRequestToken(String confirmUri) {
    String confirmUrl = confirmUri + "?xoauth_end_user_decision=no";
    FacesContext facesContext = FacesContext.getCurrentInstance();

    ExternalContext externalContext = facesContext.getExternalContext();
    try {
      externalContext.redirect(confirmUrl);
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    
    facesContext.responseComplete(); 
    
    return null;
  }
}
