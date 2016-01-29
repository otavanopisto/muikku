package fi.muikku.auth;

import javax.inject.Inject;

import fi.muikku.dao.security.UserIdentificationDAO;
import fi.muikku.model.security.AuthSource;
import fi.muikku.model.security.UserIdentification;
import fi.muikku.model.users.UserEntity;

public class UserIdentificationController {

  @Inject
  private UserIdentificationDAO userIdentificationDAO;

  // UserIdentifications
  
  public UserIdentification createUserIdentification(UserEntity userEntity, AuthSource authSource, String externalId) {
    return userIdentificationDAO.create(userEntity, authSource, externalId);
  }
 
  public UserIdentification findUserIdentificationByAuthSourceAndExternalId(AuthSource authSource, String externalId) {
    return userIdentificationDAO.findByAuthSourceAndExternalId(authSource, externalId);
  }
  
}
