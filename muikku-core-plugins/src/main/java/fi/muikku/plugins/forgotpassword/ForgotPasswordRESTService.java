package fi.muikku.plugins.forgotpassword;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.i18n.LocaleController;
import fi.muikku.mail.Mailer;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.user.UserPendingPasswordChange;
import fi.muikku.plugins.user.UserPendingPasswordChangeDAO;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.SchoolDataBridgeUnauthorizedException;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.servlet.BaseUrl;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserEntityController;

@Path("/forgotpassword")
@RequestScoped
@Stateful
@Produces ("application/json")
public class ForgotPasswordRESTService extends PluginRESTService {

  private static final long serialVersionUID = -3009238121067011985L;

  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private UserEntityController userController;
  
  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO; 
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private Mailer mailer;
  
  @Inject 
  @BaseUrl
  private String baseUrl;

  @Path("/reset")
  @GET
  @RESTPermitUnimplemented
  public Response resetPassword(@QueryParam("email") String email) {
    // TODO: this might not be optimal, but we have to find the datasource for the user
    
    UserEntity userEntity = userController.findUserEntityByEmailAddress(email);
    
    if (userEntity == null)
      return Response.status(Status.NOT_FOUND).build();
    
    try {
      UserPendingPasswordChange passwordChange = userPendingPasswordChangeDAO.findByUserEntity(userEntity);
      
      schoolDataBridgeSessionController.startSystemSession();
      try {
        String confirmationHash = userSchoolDataController.requestPasswordResetByEmail(userEntity.getDefaultSchoolDataSource(), email);

        if (passwordChange != null)
          passwordChange = userPendingPasswordChangeDAO.updateHash(passwordChange, confirmationHash);
        else
          passwordChange = userPendingPasswordChangeDAO.create(userEntity, confirmationHash);
  
        // TODO Email could be added to the reset link for added security (email+hash rather than just hash)
        String resetLink = baseUrl + "/forgotpassword/reset?h=" + passwordChange.getConfirmationHash();
        String mailSubject = localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.mailSubject");
        String mailContent = localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.mailContent", new String[] { resetLink });
  
        // TODO System sender address needs to be configurable
        mailer.sendMail(null, email, mailSubject, mailContent);
      } finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
      
      return Response.noContent().build();
    } catch (SchoolDataBridgeUnauthorizedException e) {
      return Response.status(Status.FORBIDDEN).build();
    }
  }

  @Path("/confirm")
  @GET
  @RESTPermitUnimplemented
  public Response confirmResetPassword(ConfirmResetPassword crp) {
    UserPendingPasswordChange passwordChange = userPendingPasswordChangeDAO.findByConfirmationHash(crp.getResetCode());
    
    UserEntity userEntity = userController.findUserEntityById(passwordChange.getUserEntity());
    
    // TODO: tis a guesstimate of the datasource
    SchoolDataSource schoolDataSource = userEntity.getDefaultSchoolDataSource();

    try {
      userSchoolDataController.confirmResetPassword(schoolDataSource, crp.getResetCode(), crp.getNewPassword());
      
      return Response.noContent().build();
    } catch (SchoolDataBridgeUnauthorizedException e) {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
  
}
