package fi.muikku.plugins.user.rest;

public class ConfirmResetPassword {

  public ConfirmResetPassword() {
    super();
  }
  
  public ConfirmResetPassword(String resetCode, String newPassword) {
    this.resetCode = resetCode;
    this.newPassword = newPassword;
  }

  public String getResetCode() {
    return resetCode;
  }

  public void setResetCode(String resetCode) {
    this.resetCode = resetCode;
  }

  public String getNewPassword() {
    return newPassword;
  }

  public void setNewPassword(String newPassword) {
    this.newPassword = newPassword;
  }

  public String resetCode;
  public String newPassword;
}
