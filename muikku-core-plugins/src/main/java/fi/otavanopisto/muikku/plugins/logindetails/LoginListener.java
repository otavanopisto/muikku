package fi.otavanopisto.muikku.plugins.logindetails;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.events.LoginEvent;

public class LoginListener {
  
  @Inject
  private LoginDetailController loginDetailController;
  
  public void onLogin(@Observes LoginEvent loginEvent){
    loginDetailController.log(loginEvent);
  }
  
}
