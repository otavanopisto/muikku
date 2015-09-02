package fi.muikku.plugins.forgotpassword;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.i18n.LocaleController;
import fi.muikku.mail.Mailer;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.forgotpassword.model.PasswordResetRequest;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.servlet.BaseUrl;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserEntityController;

@Path("/forgotpassword")
@RequestScoped
@Stateful
@Produces ("application/json")
public class ForgotPasswordRESTService extends PluginRESTService {

  private static final long serialVersionUID = 54782585369977492L;

  @Inject
  private Logger logger;
  
  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Inject
  private Mailer mailer;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private ForgotPasswordController forgotPasswordController;

  @Inject 
  @BaseUrl
  private String baseUrl;

  @GET
  @Path ("/reset")
  @RESTPermitUnimplemented
  public Response createPasswordResetRequest(@QueryParam ("email") String email) {
    if (StringUtils.isEmpty(email)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(email);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    else {
      try {
        PasswordResetRequest resetRequest = forgotPasswordController.findPasswordResetRequestByUser(userEntity);
        
        if (resetRequest == null) {
          resetRequest = forgotPasswordController.createPasswordResetRequest(userEntity);
        }
        else {
          resetRequest = forgotPasswordController.updateResetHash(resetRequest);
        }
        
        // TODO Email could be added to the reset link for added security (email+hash rather than just hash)
        String resetLink = baseUrl + "/forgotpassword/reset?h=" + resetRequest.getResetHash();
        String mailSubject = localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.forgotPassword.mailSubject");
        String mailContent = localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.forgotPassword.mailContent", new String[] { resetLink });
  
        // TODO System sender address needs to be configurable
        mailer.sendMail(null, email, mailSubject, mailContent);
  
        return Response.noContent().build();
      } catch (Exception ex) {
        logger.log(Level.SEVERE, "Password Reset Request failed", ex);

        return Response.status(Status.INTERNAL_SERVER_ERROR).build();
      }
    }
  }
  
}
