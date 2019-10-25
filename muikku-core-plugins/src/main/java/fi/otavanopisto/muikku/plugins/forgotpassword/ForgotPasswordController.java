package fi.otavanopisto.muikku.plugins.forgotpassword;

import java.util.Date;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChange;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChangeDAO;

@Dependent
public class ForgotPasswordController {

  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO;
  
  public boolean isValidPasswordChangeHash(String confirmationHash) {
    UserPendingPasswordChange userPendingPasswordChange = userPendingPasswordChangeDAO.findByConfirmationHash(confirmationHash);
    return userPendingPasswordChange != null && new Date().before(userPendingPasswordChange.getExpires());
  }

}
