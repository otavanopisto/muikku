package fi.otavanopisto.muikku.plugins.forgotpassword;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChange;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChangeDAO;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.payload.CredentialResetPayload;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Path("/forgotpassword")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
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
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO; 
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private Mailer mailer;
  
  @Inject 
  @BaseUrl
  private String baseUrl;

  /**
   * GET mApi().forgotpassword.reset
   * 
   * Used to request a credential reset for the account corresponding to the given email address. 
   * 
   * Query parameters:
   * email: the email address of the user requesting a password reset
   * 
   * Output:
   * 204 for a successful reset request; user receives an email with a link to change the credentials 
   */
  @Path("/reset")
  @GET
  @RESTPermitUnimplemented
  public Response requestCredentialReset(@QueryParam("email") String email) {
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(email); 
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    UserPendingPasswordChange passwordChange = userPendingPasswordChangeDAO.findByUserEntity(userEntity);
      
    schoolDataBridgeSessionController.startSystemSession();
    try {
      String confirmationHash = userSchoolDataController.requestCredentialReset(userEntity.getDefaultSchoolDataSource(), email);

      if (passwordChange != null) {
        passwordChange = userPendingPasswordChangeDAO.updateHash(passwordChange, confirmationHash);
      }
      else {
        passwordChange = userPendingPasswordChangeDAO.create(userEntity, confirmationHash);
      }

      // TODO Email could be added to the reset link for added security (email+hash rather than just hash)
      String resetLink = baseUrl + "/forgotpassword/reset?h=" + passwordChange.getConfirmationHash();
      String mailSubject = localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.mailSubject");
      String mailContent = localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.mailContent", new String[] { resetLink });

      // TODO System sender address needs to be configurable
      mailer.sendMail(systemSettingsController.getSystemEmailSenderAddress(), email, mailSubject, mailContent);
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

    return Response.noContent().build();
  }

  /**
   * GET mApi().forgotpassword.credentialReset
   * 
   * For a valid credential reset hashcode, returns a credential reset entity containing the current
   * username of the user requesting credential reset. 
   * 
   * Path parameters:
   * Hashcode of the reset request
   * 
   * Output:
   * {secret: always empty
   *  username: user's current username, if any
   *  password: always empty}
   */
  @Path("/credentialReset/{HASH}")
  @GET
  @RESTPermitUnimplemented
  public Response getCredentialReset(@PathParam("HASH") String hash) {
    
    // Validate active credential change request
    
    UserPendingPasswordChange passwordChange = userPendingPasswordChangeDAO.findByConfirmationHash(hash);
    if (passwordChange == null) {
      return Response.status(Status.NOT_FOUND).build(); 
    }
    UserEntity userEntity = userEntityController.findUserEntityById(passwordChange.getUserEntity());
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Retrieve request payload
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      BridgeResponse<CredentialResetPayload> response = userSchoolDataController.getCredentialReset(userEntity.getDefaultSchoolDataSource(), hash);
      if (response.ok()) {
        return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
      }
      else {
        return Response.status(response.getStatusCode()).entity(response.getError()).build();
      }
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  /**
   * POST mApi().forgotpassword.credentialReset
   * 
   * Changes the username and password of the account corresponding to the credential reset hashcode.
   * 
   * Payload:
   * {secret: required; hashcode of the original credential reset request
   *  username: required; account username
   *  password: required; account password}
   * 
   * Output:
   * 204 if credential reset succeeds
   * 
   * Errors:
   * 409 if chosen username is in use; response contains a localized error message 
   */
  @Path("/credentialReset")
  @POST
  @RESTPermitUnimplemented
  public Response resetCredentials(CredentialResetPayload payload) {
    
    // Validate active credential change request
    
    UserPendingPasswordChange passwordChange = userPendingPasswordChangeDAO.findByConfirmationHash(payload.getSecret());
    if (passwordChange == null) {
      return Response.status(Status.NOT_FOUND).build(); 
    }
    UserEntity userEntity = userEntityController.findUserEntityById(passwordChange.getUserEntity());
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Retrieve request payload
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      BridgeResponse<CredentialResetPayload> response = userSchoolDataController.resetCredentials(userEntity.getDefaultSchoolDataSource(), payload);
      if (response.ok()) {
        return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
      }
      else {
        return Response.status(response.getStatusCode()).entity(response.getError()).build();
      }
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
}
