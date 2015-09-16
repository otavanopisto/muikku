package fi.muikku.plugins.search;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.search.SearchIndexer;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;

public class UserIndexer {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController; 

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private EnvironmentUserController environmentUserController;
  
  @Inject
  private SearchIndexer indexer;
  
  public void indexUser(String dataSource, String identifier) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByDataSourceAndIdentifier(dataSource, identifier);
      if (user != null) {
        EnvironmentRoleArchetype archetype = null;
        
        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(user.getSchoolDataSource(), user.getIdentifier());
        
        if (userEntity != null) {
          EnvironmentUser eu = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
          
          if ((eu != null) && (eu.getRole() != null))
            archetype = eu.getRole().getArchetype();
        }
        
        if ((archetype != null) && (userEntity != null)) {
          Map<String, Object> extra = new HashMap<>();
          extra.put("archetype", archetype);
          extra.put("userEntityId", userEntity.getId());
          
          indexer.index(User.class.getSimpleName(), user, extra);
        } else
          indexer.index(User.class.getSimpleName(), user);
      } else {
        logger.warning("could not index user because user '" + identifier + '/' + dataSource +  "' could not be found");
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void indexUser(UserEntity userEntity) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);

      for (UserSchoolDataIdentifier identifier : identifiers) {
        indexUser(identifier.getDataSource().getIdentifier(), identifier.getIdentifier());
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
}
