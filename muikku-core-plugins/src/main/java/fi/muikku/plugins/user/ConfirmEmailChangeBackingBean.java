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
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.internalauth.InternalAuthController;
import fi.muikku.plugins.internalauth.model.InternalAuth;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.UserController;
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
  
  @Inject
  private InternalAuthController internalLoginController;
  
  @Inject
  private UserController userController;
  
  @URLAction
  public void init() throws FileNotFoundException {
  }

  public void confirm() throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    UserPendingEmailChange change = getPendingEmailChange();
    
    if (!sessionController.isLoggedIn()) {
      InternalAuth auth = internalLoginController.findInternalAuthByEmailAndPassword(userName, passwordHash);
      UserEntity userEntity = userController.findUserEntityById(auth.getUserEntityId());
      
      userInfoController.confirmEmailChange(userEntity, passwordHash, change);
    } else
      userInfoController.confirmEmailChange(sessionController.getUser(), passwordHash, change);
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

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  private String userName;
  private String passwordHash;
  private String confirmationHash;
}
