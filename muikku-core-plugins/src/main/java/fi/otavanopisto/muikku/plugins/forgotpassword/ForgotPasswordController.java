package fi.otavanopisto.muikku.plugins.forgotpassword;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChangeDAO;

@Dependent
public class ForgotPasswordController {

  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO;
  
  public boolean isValidPasswordChangeHash(String confirmationHash) {
    return userPendingPasswordChangeDAO.findByConfirmationHash(confirmationHash) != null;
  }

}
