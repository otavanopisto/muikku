package fi.otavanopisto.muikku.users;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class UserSchoolDataIdentifierController {
  
  @Inject
  private Logger logger;

  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  public UserSchoolDataIdentifier createUserSchoolDataIdentifier(SchoolDataSource dataSource, String identifier, UserEntity userEntity, EnvironmentRoleEntity environmentRoleEntity, OrganizationEntity organizationEntity) {
    return userSchoolDataIdentifierDAO.create(dataSource, identifier, userEntity, environmentRoleEntity, organizationEntity, Boolean.FALSE);
  }

  public UserSchoolDataIdentifier createUserSchoolDataIdentifier(String schoolDataSource, String identifier, UserEntity userEntity, EnvironmentRoleEntity environmentRoleEntity, OrganizationEntity organizationEntity) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      logger.severe("Could not find dataSource '" + schoolDataSource + "'");
      return null;
    }
    
    return createUserSchoolDataIdentifier(dataSource, identifier, userEntity, environmentRoleEntity, organizationEntity);
  }
  
  public UserSchoolDataIdentifier findUserSchoolDataIdentifierByDataSourceAndIdentifier(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      logger.severe(String.format("Could not find dataSource %s", schoolDataSource));
      return null;
    }
    
    return findUserSchoolDataIdentifierByDataSourceAndIdentifier(dataSource, identifier);
  }

  public UserSchoolDataIdentifier findUserSchoolDataIdentifierByDataSourceAndIdentifierIncludeArchived(String schoolDataSource, String identifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSource);
    if (dataSource == null) {
      logger.severe(String.format("Could not find dataSource %s", schoolDataSource));
      return null;
    }
    
    return findUserSchoolDataIdentifierByDataSourceAndIdentifierIncludeArchived(dataSource, identifier);
  }

  public UserSchoolDataIdentifier findUserSchoolDataIdentifierBySchoolDataIdentifier(SchoolDataIdentifier schoolDataIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(schoolDataIdentifier.getDataSource());
    if (dataSource == null) {
      logger.severe(String.format("Could not find dataSource %s", schoolDataIdentifier.getDataSource()));
      return null;
    }
    return findUserSchoolDataIdentifierByDataSourceAndIdentifier(schoolDataIdentifier.getDataSource(), schoolDataIdentifier.getIdentifier());
  }
  
  public UserSchoolDataIdentifier findUserSchoolDataIdentifierByUserEntity(UserEntity userEntity) {
    if (userEntity == null) {
      return null;
    }
    SchoolDataSource schoolDataSource = userEntity.getDefaultSchoolDataSource();
    String identifier = userEntity.getDefaultIdentifier();
    return findUserSchoolDataIdentifierByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public EnvironmentRoleEntity findUserSchoolDataIdentifierRole(SchoolDataIdentifier schoolDataIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
    return userSchoolDataIdentifier != null ? findUserSchoolDataIdentifierRole(userSchoolDataIdentifier) : null;
  }
  
  public EnvironmentRoleEntity findUserSchoolDataIdentifierRole(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return userSchoolDataIdentifier != null ? userSchoolDataIdentifier.getRole() : null;
  }

  public EnvironmentRoleEntity findUserSchoolDataIdentifierRole(UserEntity userEntity) {
    return findUserSchoolDataIdentifierRole(new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier()));
  }
  
  public UserSchoolDataIdentifier findUserSchoolDataIdentifierByDataSourceAndIdentifierIncludeArchived(SchoolDataSource dataSource, String identifier) {
    return userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, identifier);
  }
  
  public UserSchoolDataIdentifier findUserSchoolDataIdentifierByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    return userSchoolDataIdentifierDAO.findByDataSourceAndIdentifierAndArchived(dataSource, identifier, Boolean.FALSE);
  }

  public List<UserSchoolDataIdentifier> listUserSchoolDataIdentifiersByUserEntity(UserEntity userEntity) {
    return userSchoolDataIdentifierDAO.listByUserEntityAndArchived(userEntity, Boolean.FALSE);
  }

  public void archiveUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    userSchoolDataIdentifierDAO.updateArchived(userSchoolDataIdentifier, Boolean.TRUE);
  }

  public void unarchiveUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    userSchoolDataIdentifierDAO.updateArchived(userSchoolDataIdentifier, Boolean.FALSE);
  }

  public void setUserIdentifierRole(UserSchoolDataIdentifier userSchoolDataIdentifier, EnvironmentRoleEntity environmentRoleEntity) {
    userSchoolDataIdentifierDAO.updateRole(userSchoolDataIdentifier, environmentRoleEntity);
  }

  public void setUserIdentifierOrganization(UserSchoolDataIdentifier userSchoolDataIdentifier,
      OrganizationEntity organizationEntity) {
    userSchoolDataIdentifierDAO.updateOrganization(userSchoolDataIdentifier, organizationEntity);
  }
  
}