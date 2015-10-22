package fi.muikku.users;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserGroupEntityDAO;
import fi.muikku.dao.users.UserGroupUserEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupUserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;

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
  
  public UserGroupUserEntity createUserGroupUserEntity(UserGroupEntity userGroupEntity, String dataSource, String identifier, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupUserEntityDAO.create(userGroupEntity, schoolDataSource, identifier, userSchoolDataIdentifier, false);
  }
  
  public UserGroupEntity findUserGroupEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public Long getGroupUserCount(UserGroupEntity userGroupEntity) {
    return userGroupEntityDAO.countGroupUsers(userGroupEntity);
  }
  
  public void deleteUserGroupEntity(UserGroupEntity userGroupEntity) {
    // TODO: archive instead of delete? Though, identifier being unique is tough on implementation
    userGroupEntityDAO.delete(userGroupEntity);
  }

  public UserGroupUserEntity findUserGroupUserEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupUserEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public void deleteUserGroupUserEntity(UserGroupUserEntity userGroupUserEntity) {
    // TODO: archive instead of delete? Though, identifier being unique is tough on implementation
    userGroupUserEntityDAO.delete(userGroupUserEntity);
  }

  public List<UserGroupEntity> listUserGroupEntitiesByDataSource(String dataSource, int firstResult, int maxResults) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupEntityDAO.listByDataSource(schoolDataSource, firstResult, maxResults);
  }

  public List<UserGroupUserEntity> listUserGroupUserEntitiesByUserGroupEntity(UserGroupEntity userGroupEntity) {
    return userGroupUserEntityDAO.listByUserGroupEntity(userGroupEntity);
  }

  public List<UserGroupEntity> listUserGroupsByUser(UserEntity userEntity) {
    return userGroupEntityDAO.listByUser(userEntity);
  }

  public List<UserGroupEntity> listUserGroupEntities() {
    return userGroupEntityDAO.listAll();
  }

  public UserGroupEntity findUserGroupEntityById(Long groupId) {
    return userGroupEntityDAO.findById(groupId);
  }

  public UserGroupUserEntity findUserGroupUserEntityById(Long userGroupUserId) {
    return userGroupUserEntityDAO.findById(userGroupUserId);
  }

  public List<UserGroupUserEntity> listUserGroupUsersByUser(UserEntity userEntity) {
    return userGroupUserEntityDAO.listByUserEntity(userEntity);
  }

}
