package fi.muikku.users;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserGroupEntityDAO;
import fi.muikku.dao.users.UserGroupUserEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupUserEntity;

public class UserGroupEntityController {

  @Inject
  private Logger logger;
  
  @Inject
  private UserGroupEntityDAO userGroupEntityDAO;
  
  @Inject
  private UserGroupUserEntityDAO userGroupUserEntityDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  public UserGroupEntity createUserGroupEntity(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupEntityDAO.create(schoolDataSource, identifier, false);
  }
  
  public UserGroupUserEntity createUserGroupUserEntity(UserGroupEntity userGroupEntity, String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupUserEntityDAO.create(userGroupEntity, schoolDataSource, identifier, false);
  }
  
  public UserGroupEntity findUserGroupEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public void archiveUserGroupEntity(UserGroupEntity userGroupEntity) {
    userGroupEntityDAO.archive(userGroupEntity);
  }

  public UserGroupUserEntity findUserGroupUserEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupUserEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public void archiveUserGroupUserEntity(UserGroupUserEntity userGroupUserEntity) {
    userGroupUserEntityDAO.archive(userGroupUserEntity);
  }

  public List<UserGroupEntity> listUserGroupEntitiesByDataSource(String dataSource, int firstResult, int maxResults) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupEntityDAO.listByDataSource(schoolDataSource, firstResult, maxResults);
  }

}
