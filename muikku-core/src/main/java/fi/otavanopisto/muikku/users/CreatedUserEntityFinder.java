package fi.otavanopisto.muikku.users;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;

@Stateless
public class CreatedUserEntityFinder {
  
  @Inject
  private UserEntityController userEntityController;

  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public UserEntity findCreatedUserEntity(String schoolDataSource, String identifier) {
    return userEntityController.findUserEntityByDataSourceAndIdentifier(schoolDataSource, identifier);
  }
  
}
