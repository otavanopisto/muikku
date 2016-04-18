package fi.otavanopisto.muikku.users;

import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.UserGroupEntityDAO;
import fi.otavanopisto.muikku.dao.users.UserGroupUserEntityDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class UserGroupEntityController {

  @Inject
  private Logger logger;
  
  @Inject
  private UserGroupEntityDAO userGroupEntityDAO;
  
  @Inject
  private UserGroupUserEntityDAO userGroupUserEntityDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
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

  public void deleteUserGroupUserEntity(UserGroupUserEntity userGroupUserEntity) {
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
    return userGroupUserEntityDAO.listByUserGroupEntityAndArchived(userGroupEntity, Boolean.FALSE);
  }

  public List<UserGroupEntity> listUserGroupsByUserEntity(UserEntity userEntity) {
    return userGroupEntityDAO.listByUserEntityExcludeArchived(userEntity);
  }

  public List<UserGroupEntity> listUserGroupsByUserIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return userGroupEntityDAO.listByUserIdentifierExcludeArchived(userSchoolDataIdentifier);
  }

  public List<UserGroupEntity> listUserGroupsByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    if (userSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find userSchoolDataIdentifier by userIdentifer %s", userIdentifier));
      return Collections.emptyList();
    }
    
    return userGroupEntityDAO.listByUserIdentifierExcludeArchived(userSchoolDataIdentifier);
  }
  
  public List<UserGroupEntity> listUserGroupEntities() {
    return userGroupEntityDAO.listByArchived(Boolean.FALSE);
  }

  public List<UserGroupEntity> listUserGroupEntitiesIncludeArchived() {
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
  
  public void deleteUserGroupEntity(UserGroupEntity userGroupEntity){
    userGroupEntityDAO.delete(userGroupEntity);
  }

}
