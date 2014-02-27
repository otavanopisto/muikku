package fi.muikku.plugins.user;

import java.io.FileNotFoundException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.controller.UserEntityController;
import fi.muikku.session.SessionController;


@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
  @URLMapping(
      id = "user-confirmEmailChange", 
      pattern = "/user-confirmEmailChange/h/#{confirmEmailChangeBackingBean.confirmationHash}", 
      viewId = "/user/confirmemailchange.jsf")
})
public class ConfirmEmailChangeBackingBean {
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserInfoController userInfoController;
  
  @Inject
  private SessionController sessionController;
  
  @URLAction
  public void init() throws FileNotFoundException {
  }

  public void confirm() {
    UserPendingEmailChange change = getPendingEmailChange();
    
    if (sessionController.isLoggedIn())
      userInfoController.confirmEmailChange(change);
  }
  
  public UserPendingEmailChange getPendingEmailChange() {
    return userInfoController.findPendingEmailChangeByHash(confirmationHash);
  }

  public String getConfirmationHash() {
    return confirmationHash;
  }

  public void setConfirmationHash(String confirmationHash) {
    this.confirmationHash = confirmationHash;
  }

  private String confirmationHash;
}
