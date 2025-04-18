package fi.otavanopisto.muikku.users;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.UserGroupEntityDAO;
import fi.otavanopisto.muikku.dao.users.UserGroupUserEntityDAO;
import fi.otavanopisto.muikku.model.base.Archived;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

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
  private OrganizationEntityController organizationEntityController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  public UserGroupEntityName getName(UserGroupEntity userGroupEntity) {
    if (!searchProviders.isUnsatisfied()) {
      SearchProvider searchProvider = searchProviders.get();
    
      SearchResult searchResult = searchProvider.findUserGroup(userGroupEntity.schoolDataIdentifier());
      if (searchResult.getTotalHitCount() == 1) {
        List<Map<String, Object>> results = searchResult.getResults();
        Map<String, Object> match = results.get(0);
        return new UserGroupEntityName((String) match.get("name"), (Boolean) match.get("isGuidanceGroup"));
      }
      else {
        throw new RuntimeException(String.format("Search provider couldn't find a unique user group. %d results.", searchResult.getTotalHitCount()));
      }
    }
    else {
      throw new RuntimeException("Search provider is not present in application.");
    }
  }
  
  public UserGroupEntity createUserGroupEntity(String dataSource, String identifier, OrganizationEntity organization) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupEntityDAO.create(schoolDataSource, identifier, organization, false);
  }
  
  public UserGroupUserEntity createUserGroupUserEntity(UserGroupEntity userGroupEntity, String dataSource, String identifier, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return userGroupUserEntityDAO.create(userGroupEntity, schoolDataSource, identifier, userSchoolDataIdentifier, false);
  }
  
  public UserGroupEntity findUserGroupEntityByDataSourceAndIdentifier(SchoolDataIdentifier schoolDataIdentifier) {
    return findUserGroupEntityByDataSourceAndIdentifier(schoolDataIdentifier.getDataSource(), schoolDataIdentifier.getIdentifier(), false);
  }
  
  public UserGroupEntity findUserGroupEntityByIdentifier(SchoolDataIdentifier identifier) {
    return findUserGroupEntityByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
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
  
  public UserGroupUserEntity findUserGroupUserEntityBySchoolDataIdentifier(SchoolDataIdentifier schoolDataIdentifier) {
    return findUserGroupUserEntityByDataSourceAndIdentifier(schoolDataIdentifier.getDataSource(), schoolDataIdentifier.getIdentifier(), false);
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
  
  public List<UserGroupEntity> listUserGroupsByUserIdentifiers(Collection<SchoolDataIdentifier> userIdentifiers) {
    Set<UserSchoolDataIdentifier> userSchoolDataIdentifiers = new HashSet<>();
    
    for (SchoolDataIdentifier userIdentifier : userIdentifiers) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
      if (userSchoolDataIdentifier == null) {
        logger.severe(String.format("Could not find userSchoolDataIdentifier by userIdentifer %s", userIdentifier));
        return Collections.emptyList();
      }
      
      if (!userSchoolDataIdentifiers.stream().anyMatch(usdi -> usdi.getId().equals(userSchoolDataIdentifier.getId()))) {
        userSchoolDataIdentifiers.add(userSchoolDataIdentifier);
      }
    }

    return userGroupEntityDAO.listByUserIdentifiersExcludeArchived(userSchoolDataIdentifiers);
  }
  
  public List<UserGroupUserEntity> listUserGroupStaffMembers(UserGroupEntity userGroupEntity) {
    return userGroupUserEntityDAO.listUserGroupStaffMembers(userGroupEntity, Archived.UNARCHIVED);
  }

  public List<UserGroupEntity> listAllUserGroupEntities() {
    return userGroupEntityDAO.listAll();
  }
  
  public List<UserGroupEntity> listUserGroupEntities() {
    List<UserGroupEntity> userGroups = userGroupEntityDAO.listByArchived(Boolean.FALSE);
    if (!organizationEntityController.canCurrentUserAccessAllOrganizations()) {
      OrganizationEntity organizationEntity = organizationEntityController.getCurrentUserOrganization();
      if (organizationEntity == null) {
        return Collections.emptyList();
      }
      else {
        userGroups = userGroups.stream().filter(group -> group.getOrganization().getId().equals(organizationEntity.getId())).collect(Collectors.toList());
      }
    }
    return userGroups;
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

  public List<UserGroupUserEntity> listUserGroupUsersByUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return userGroupUserEntityDAO.listByUserSchoolDataIdentifier(userSchoolDataIdentifier);
  }

  public UserGroupUserEntity updateUserSchoolDataIdentifier(UserGroupUserEntity userGroupUserEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    return userGroupUserEntityDAO.updateUserSchoolDataIdentifier(userGroupUserEntity, userSchoolDataIdentifier);
  }

  public UserGroupUserEntity updateUserGroupEntity(UserGroupUserEntity userGroupUserEntity, UserGroupEntity userGroupEntity) {
    return userGroupUserEntityDAO.updateUserGroupEntity(userGroupUserEntity, userGroupEntity);
  }
  
  public UserGroupEntity updateUserGroupEntityOrganization(UserGroupEntity userGroupEntity, OrganizationEntity organizationEntity) {
    return userGroupEntityDAO.updateOrganization(userGroupEntity, organizationEntity);
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

  public boolean haveSharedUserGroups(UserEntity user1, UserEntity user2) {
    return userGroupUserEntityDAO.haveSharedUserGroups(user1, user2);
  }

  public boolean isMember(SchoolDataIdentifier userIdentifier, UserGroupEntity userGroupEntity) {
    return userGroupUserEntityDAO.findByGroupAndUser(userGroupEntity, userIdentifier, Archived.UNARCHIVED) != null;
  }

}
