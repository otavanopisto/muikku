package fi.muikku.plugins.logindetails;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.events.LoginEvent;

@Stateless
public class LoginListener {
  
  @Inject
  LoginDetailController loginDetailController;
  
  public void onLogin(@Observes LoginEvent loginEvent){
    loginDetailController.log(loginEvent);
  }
  
}
