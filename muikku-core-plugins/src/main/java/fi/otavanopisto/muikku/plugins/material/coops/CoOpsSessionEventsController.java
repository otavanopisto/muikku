package fi.otavanopisto.muikku.plugins.material.coops;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.material.coops.model.CoOpsSession;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Stateless
public class CoOpsSessionEventsController {
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;

  public List<Object> createSessionEvents(List<CoOpsSession> sessions, String status) {
    List<Object> result = new ArrayList<Object>();
    String email = null;
    // TODO: Localize
    String displayName = "Anonymous";
    
    for (CoOpsSession session : sessions) {
      String sessionId = session.getSessionId();
      Long userEntityId = session.getUserEntityId();
      if (userEntityId != null) {
        UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
        if (userEntity != null) {
          List<String> addresses = userEmailEntityController.listAddressesByUserEntity(userEntity);
          if (!addresses.isEmpty()) {
            email = addresses.get(0);
          }
          
          User user = userController.findUserByDataSourceAndIdentifier(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
          if (user != null) {
            displayName = user.getFirstName() + ' ' + user.getLastName();
          }
        }
      }
      
      if (StringUtils.isBlank(email)) {
        email = sessionId + "@nomail.invalid"; 
      }
      
      result.add(new CoOpsSessionEvent(sessionId, displayName, email, status));
    }
    
    return result;
  }
  
}
