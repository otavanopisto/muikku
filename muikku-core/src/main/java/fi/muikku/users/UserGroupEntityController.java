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
    return findUserGroupEntityByDataSourceAndIdentifier(dataSource, identifier, false);
  }
  
  public UserGroupEntity findUserGroupEntityByDataSourceAndIdentifier(String dataSource, String identifier, boolean includeArchived) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }

    if (includeArchived) {
      return userGroupEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
    } else {
      return userGroupEntityDAO.findByDataSourceAndIdentifierAndArchived(schoolDataSource, identifier, false);
    }
  }

  public Long getGroupUserCount(UserGroupEntity userGroupEntity) {
    return userGroupEntityDAO.countGroupUsers(userGroupEntity);
  }
  
  public UserGroupUserEntity findUserGroupUserEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    return findUserGroupUserEntityByDataSourceAndIdentifier(dataSource, identifier, false);
  }
  
  public UserGroupUserEntity findUserGroupUserEntityByDataSourceAndIdentifier(String dataSource, String identifier, Boolean includeArchived) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    if (includeArchived) {
      return userGroupUserEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
    } else {
      return userGroupUserEntityDAO.findByDataSourceAndIdentifierAndArchived(schoolDataSource, identifier, Boolean.FALSE);
    }
    
  }

  public void archiveUserGroupUserEntity(UserGroupUserEntity userGroupUserEntity) {
    userGroupUserEntityDAO.updateArchived(userGroupUserEntity, Boolean.TRUE);
  }

  public void unarchiveUserGroupUserEntity(UserGroupUserEntity userGroupUserEntity) {
    userGroupUserEntityDAO.updateArchived(userGroupUserEntity, Boolean.FALSE);
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

  public UserGroupUserEntity updateUserSchoolDataIdentifier(UserGroupUserEntity userGroupUserEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return userGroupUserEntityDAO.updateUserSchoolDataIdentifier(userGroupUserEntity, userSchoolDataIdentifier);
  }

  public UserGroupEntity archiveUserGroupEntity(UserGroupEntity userGroupEntity) {
    return userGroupEntityDAO.updateArchived(userGroupEntity, Boolean.TRUE);
  }

  public UserGroupEntity unarchiveUserGroupEntity(UserGroupEntity userGroupEntity) {
    return userGroupEntityDAO.updateArchived(userGroupEntity, Boolean.FALSE);
  }

}
