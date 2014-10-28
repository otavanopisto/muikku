package fi.muikku.schooldata.events;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.users.UserEmailEntityController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;

public class DefaultSchoolDataUserListener {
  
  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  public void onSchoolDataUserDiscoveredEvent(@Observes SchoolDataUserDiscoveredEvent event) {
    if (userEntityController.findUserEntityByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()) == null) {
      // User does not yet exist on the database
      
      List<UserEntity> emailUsers = userEntityController.listUserEntitiesByEmails(event.getEmails());
      if (emailUsers.size() > 1) {
        // TODO: Better exception handling
        throw new RuntimeException("Multiple users found by emails");
      }
      
      UserEntity userEntity = null;
      if (emailUsers.size() == 1) {
        // Matching user found, attach identity
        userEntity = emailUsers.get(0);
        userSchoolDataIdentifierController.createUserSchoolDataIdentifier(event.getDataSource(), event.getIdentifier(), userEntity);
      } else {
        userEntity = userEntityController.createUserEntity(event.getDataSource(), event.getIdentifier());
        userSchoolDataIdentifierController.createUserSchoolDataIdentifier(event.getDataSource(), event.getIdentifier(), userEntity);
      }
      
      List<String> existingAddresses = userEmailEntityController.listAddressesByUserEntity(userEntity);
      for (String email : event.getEmails()) {
        if (!existingAddresses.contains(email)) {
          userEmailEntityController.addUserEmail(userEntity, email);
        }
      }
    }
  }
  
  
  
}
