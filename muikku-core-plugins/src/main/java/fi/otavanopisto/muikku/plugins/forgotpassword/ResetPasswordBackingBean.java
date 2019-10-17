package fi.otavanopisto.muikku.plugins.forgotpassword;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationController;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped  
@Join (path = "/forgotpassword/reset", to = "/jsf/forgotpassword/reset.jsf")
public class ResetPasswordBackingBean {

  @Parameter ("h")
  private String urlHash;

  @Inject
  private SessionController sessionController;

  @Inject
  private ForgotPasswordController forgotPasswordController;
  
  @Inject
  private NavigationController navigationController;
  
  @RequestAction
  public String init() {
    if (sessionController.isLoggedIn()) {
      // Already logged in...
      return "/index.jsf?faces-redirect=true";
    }
    if (!forgotPasswordController.isValidPasswordChangeHash(urlHash)) {
      return navigationController.accessDenied();
    }
    return null;
  }

}
