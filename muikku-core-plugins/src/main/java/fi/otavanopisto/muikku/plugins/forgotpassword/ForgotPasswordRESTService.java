package fi.otavanopisto.muikku.plugins.forgotpassword;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.controller.EnvironmentSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChange;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChangeDAO;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeUnauthorizedException;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;

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
  private UserEntityController userEntityController;

  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO; 
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @Inject
  private Mailer mailer;
  
  @Inject 
  @BaseUrl
  private String baseUrl;

  @Path("/reset")
  @GET
  @RESTPermitUnimplemented
  public Response resetPassword(@QueryParam("email") String email) {
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(email); 
    
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
        mailer.sendMail(environmentSettingsController.getSystemEmailSenderAddress(), email, mailSubject, mailContent);
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
    
    UserEntity userEntity = userEntityController.findUserEntityById(passwordChange.getUserEntity());
    
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
