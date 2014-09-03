package fi.muikku.auth;

import java.util.List;
import java.util.Map;

import javax.enterprise.event.Event;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import fi.muikku.auth.AuthenticationResult.ConflictReason;
import fi.muikku.auth.AuthenticationResult.Status;
import fi.muikku.controller.SchoolBridgeController;
import fi.muikku.controller.UserEntityController;
import fi.muikku.events.LoginEvent;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.security.AuthSource;
import fi.muikku.model.security.AuthSourceSetting;
import fi.muikku.model.security.UserIdentification;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;

public abstract class AbstractAuthenticationStrategy implements AuthenticationProvider {

  @Inject
  @LocalSession
  private LocalSessionController sessionController;

  @Inject
  private AuthSourceController authSourceController;

  @Inject
  private UserIdentificationController userIdentificationController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserController userController;

  @Inject
  private SchoolBridgeController schoolBridgeController;

  @Inject
  private Event<LoginEvent> loginEvent;

  @Inject
  private Event<LoginEvent> userLoggedInEvent;

  protected String getFirstRequestParameter(Map<String, String[]> requestParameters, String key) {
    String[] value = requestParameters.get(key);
    if (value != null && value.length == 1) {
      return value[0];
    }

    return null;
  }

  protected String getAuthSourceSetting(AuthSource authSource, String key) {
    AuthSourceSetting authSourceSetting = authSourceController.findAuthSourceSettingsByKey(authSource, key);
    if (authSourceSetting != null) {
      return authSourceSetting.getValue();
    }

    return null;
  }

  protected AuthenticationResult processLogin(AuthSource authSource, Map<String, String[]> requestParameters, String externalId, List<String> emails, String firstName, String lastName) {
    List<UserEntity> emailUsers = userEntityController.listUsersByEmails(emails);
    if (emailUsers.size() > 1) {
      return new AuthenticationResult(Status.CONFLICT, ConflictReason.SEVERAL_USERS_BY_EMAILS);
    }

    UserEntity emailUser = emailUsers.size() == 1 ? emailUsers.get(0) : null;
    boolean newAccount = false;

    UserIdentification userIdentification = userIdentificationController.findUserIdentificationByAuthSourceAndExternalId(authSource, externalId);
    if (userIdentification != null) {
      // User has identified by this auth source before
      if (emailUser != null && emailUser.getId() != userIdentification.getUser().getId()) {
        return new AuthenticationResult(Status.CONFLICT, ConflictReason.EMAIL_BELONGS_TO_ANOTHER_USER);
      }
    } else {
      // User has not used this auth source before
      if (emailUser != null) {
        // But has existing user in the system, so we attach the identification into the same user
        userIdentification = userIdentificationController.createUserIdentification(emailUser, authSource, externalId);
      } else {
        // New user account
        // TODO: How to determine where this user should be created?

        SchoolDataSource schoolDataSource = schoolBridgeController.findSchoolDataSourceByIdentifier("LOCAL");
        User user = userController.createUser(schoolDataSource, firstName, lastName);
        UserEntity userEntity = userController.findUserEntity(user);
        userIdentification = userIdentificationController.createUserIdentification(userEntity, authSource, externalId);
        newAccount = true;
      }
    }

    List<String> existingAddresses = userEntityController.listUserEmailAddresses(userIdentification.getUser());
    for (String email : emails) {
      if (!existingAddresses.contains(email)) {
        userEntityController.addUserEmail(userIdentification.getUser(), email);
      }
    }

    return login(userIdentification, newAccount);
  }

  private AuthenticationResult login(UserIdentification userIdentification, boolean newAccount) {
    UserEntity user = userIdentification.getUser();
    UserEntity loggedUser = sessionController.getLoggedUser();
    if ((loggedUser == null) || loggedUser.getId().equals(user.getId())) {
      sessionController.login(user.getId());
      userController.updateLastLogin(user);
      HttpServletRequest req = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();
      userLoggedInEvent.fire(new LoginEvent(user.getId(), this, req.getRemoteAddr()));
      return new AuthenticationResult(newAccount ? Status.NEW_ACCOUNT : Status.LOGIN);
    } else {
      return new AuthenticationResult(Status.CONFLICT, ConflictReason.LOGGED_IN_AS_DIFFERENT_USER);
    }
  }


}