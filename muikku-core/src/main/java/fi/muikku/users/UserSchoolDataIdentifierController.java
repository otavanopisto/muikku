package fi.muikku.users;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;

public class UserSchoolDataIdentifierController {
  
  @Inject
  private Logger logger;

  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  public UserSchoolDataIdentifier createUserSchoolDataIdentifier(SchoolDataSource dataSource, String identifier, UserEntity userEntity) {
    return userSchoolDataIdentifierDAO.create(dataSource, identifier, userEntity);
  }

  public UserSchoolDataIdentifier createUserSchoolDataIdentifier(String schoolDataSource, String identifier, UserEntity userEntity) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      logger.severe("Could not find dataSource '" + schoolDataSource + "'");
      return null;
    }
    
    return createUserSchoolDataIdentifier(dataSource, identifier, userEntity);
  }
  
  public UserSchoolDataIdentifier findUserSchoolDataIdentifierByDataSourceAndIdentifier(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      logger.severe("Could not find dataSource '" + schoolDataSource + "'");
      return null;
    }
    
    return findUserSchoolDataIdentifierByDataSourceAndIdentifier(dataSource, identifier);
  }
  
  public UserSchoolDataIdentifier findUserSchoolDataIdentifierByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    return userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, identifier);
  }

  public List<UserSchoolDataIdentifier> listUserSchoolDataIdentifiersByUserEntity(UserEntity userEntity) {
    return userSchoolDataIdentifierDAO.listByUserEntity(userEntity);
  }

  public void deleteUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    userSchoolDataIdentifierDAO.delete(userSchoolDataIdentifier);
  }
  
  
}
