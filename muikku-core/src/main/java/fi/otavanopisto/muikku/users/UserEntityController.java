package fi.otavanopisto.muikku.users;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.UserEmailEntityDAO;
import fi.otavanopisto.muikku.dao.users.UserEntityDAO;
import fi.otavanopisto.muikku.dao.users.UserEntityPropertyDAO;
import fi.otavanopisto.muikku.dao.users.UserIdentifierPropertyDAO;
import fi.otavanopisto.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEmailEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserIdentifierProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.session.SessionController;

public class UserEntityController implements Serializable {
  
  private static final long serialVersionUID = 4092377410747350817L;

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private LocaleController localeController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private UserProfilePictureController userProfilePictureController;

  @Inject
  private UserEntityDAO userEntityDAO;

  @Inject
  private UserEntityPropertyDAO userEntityPropertyDAO;

  @Inject
  private UserIdentifierPropertyDAO userIdentifierPropertyDAO;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;
  
  @Inject
  private UserEmailEntityDAO userEmailEntityDAO;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  public UserEntity createUserEntity(SchoolDataSource defaultSchoolDataSource, String defaultIdentifier, Locale locale) {
    return userEntityDAO.create(Boolean.FALSE, defaultSchoolDataSource, defaultIdentifier, locale != null ? locale.toString() : null);
  }
  
  public UserEntity createUserEntity(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return createUserEntity(schoolDataSource, identifier, null);
  }
  
  public UserEntityName getName(UserEntity userEntity, boolean guaranteeReturnObject) {
    return getName(userEntity == null ? null : userEntity.defaultSchoolDataIdentifier(), guaranteeReturnObject);
  }

  public UserEntityName getName(SchoolDataIdentifier identifier, boolean guaranteeReturnObject) {
    if (identifier != null) {
      for (SearchProvider searchProvider : searchProviders) {
        if (StringUtils.equals(searchProvider.getName(), "elastic-search")) {
          SearchResult searchResult = searchProvider.findUser(identifier, true);
          if (searchResult.getTotalHitCount() > 0) {
            List<Map<String, Object>> results = searchResult.getResults();
            // Settle for first match but prefer default identifier 
            Map<String, Object> match = results.get(0);
            if (searchResult.getTotalHitCount() >  1) {
              for (Map<String, Object> result : results) {
                String identifierString = (String) result.get("identifier");
                if (StringUtils.equals(identifier.getIdentifier(), identifierString)) {
                  match = result;
                  break;
                }
              }
            }
            return new UserEntityName((String) match.get("firstName"), (String) match.get("lastName"), (String) match.get("nickName"), (String) match.get("studyProgrammeName"));
          }
        }
      }
    }
    // #6458: (Optionally) return a skeleton object when search provider is having a bad day
    return guaranteeReturnObject ? new UserEntityName("?", "?", null, null) : null;
  }
  
  public String getStudyTimeEndAsString(OffsetDateTime studyTimeEnd) {
    StringBuffer sb = new StringBuffer();
    if (studyTimeEnd != null) {
      OffsetDateTime now = OffsetDateTime.now();
      Locale locale = sessionController.getLocale();
      if (now.isBefore(studyTimeEnd)) {

        long studyTimeLeftYears = now.until(studyTimeEnd, ChronoUnit.YEARS);
        now = now.plusYears(studyTimeLeftYears);
        if (studyTimeLeftYears > 0) {
          sb.append(studyTimeLeftYears);
          sb.append(" ");
          sb.append(localeController.getText(locale, "plugin.profile.studyTimeEndShort.y"));
        }

        long studyTimeLeftMonths = now.until(studyTimeEnd, ChronoUnit.MONTHS);
        now = now.plusMonths(studyTimeLeftMonths);
        if (studyTimeLeftMonths > 0) {
          if (sb.length() > 0) {
            sb.append(" ");
          }
          sb.append(studyTimeLeftMonths);
          sb.append(" ");
          sb.append(localeController.getText(locale, "plugin.profile.studyTimeEndShort.m"));
        }

        long studyTimeLeftDays = now.until(studyTimeEnd, ChronoUnit.DAYS);
        now = now.plusDays(studyTimeLeftDays);
        if (studyTimeLeftDays > 0) {
          if (sb.length() > 0) {
            sb.append(" ");
          }
          sb.append(studyTimeLeftDays);
          sb.append(" ");
          sb.append(localeController.getText(locale, "plugin.profile.studyTimeEndShort.d"));
        }
      }
    }
    return sb.length() == 0 ? null : sb.toString();
  }
  
  public UserEntity findUserEntityById(Long id) {
    return userEntityDAO.findById(id);
  }
  
  public UserEntityProperty getUserEntityPropertyByKey(UserEntity userEntity, String key) {
    return userEntityPropertyDAO.findByUserEntityAndKey(userEntity, key);
  }

  public UserIdentifierProperty getUserIdentifierPropertyByKey(String identifier, String key) {
    return userIdentifierPropertyDAO.findByIdentifierAndKey(identifier, key);
  }

  public List<UserEntityProperty> listUserEntityProperties(UserEntity userEntity) {
    return userEntityPropertyDAO.listByUserEntity(userEntity);
  }
  
  public void setUserEntityProperty(UserEntity userEntity, String key, String value) {
    UserEntityProperty userEntityProperty = getUserEntityPropertyByKey(userEntity, key);
    if (userEntityProperty == null) {
      if (StringUtils.isNotEmpty(value)) {
        userEntityPropertyDAO.create(userEntity, key, value);
      }
    }
    else {
      if (StringUtils.isEmpty(value)) {
        userEntityPropertyDAO.delete(userEntityProperty);
      }
      else {
        userEntityPropertyDAO.updateValue(userEntityProperty, value);
      }
    }
  }

  public void setUserIdentifierProperty(String identifier, String key, String value) {
    UserIdentifierProperty userIdentifierProperty = getUserIdentifierPropertyByKey(identifier, key);
    if (userIdentifierProperty == null) {
      if (StringUtils.isNotEmpty(value)) {
        userIdentifierPropertyDAO.create(identifier, key, value);
      }
    }
    else {
      if (StringUtils.isEmpty(value)) {
        userIdentifierPropertyDAO.delete(userIdentifierProperty);
      }
      else {
        userIdentifierPropertyDAO.updateValue(userIdentifierProperty, value);
      }
    }
  }

  public UserEntity findUserEntityByUser(User user) {
    return findUserEntityByDataSourceAndIdentifier(user.getSchoolDataSource(), user.getIdentifier());
  }
  
  public UserEntity findUserEntityByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifierAndArchived(dataSource, identifier, Boolean.FALSE);
    if (userSchoolDataIdentifier != null) {
      return userSchoolDataIdentifier.getUserEntity();
    }
    
    return null;
  }

  public UserEntity findUserEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    return findUserEntityByDataSourceAndIdentifier(schoolDataSource, identifier);
  }

  public UserEntity findUserEntityByUserIdentifier(SchoolDataIdentifier userIdentifier) {
    return findUserEntityByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
  }
  
  public UserEntity findUserEntityByEmailAddress(String emailAddress) {
    UserEntity result = null;
    Collection<String> emails = new HashSet<>();
    emails.add(emailAddress);
    List<UserEmailEntity> emailEntities = userEmailEntityDAO.listByAddresses(emails);
    for (UserEmailEntity emailEntity : emailEntities) {
      if (result == null) {
        result = emailEntity.getUserSchoolDataIdentifier().getUserEntity();
      }
      else if (!result.getId().equals(emailEntity.getUserSchoolDataIdentifier().getUserEntity().getId())) {
        logger.severe(String.format("Email %s resolves to multiple UserEntity instances", emailAddress));
        return null;
      }
    }
    return result;
  }

  public Collection<UserEntity> listUserEntitiesByEmails(Collection<String> emails) {
    if (emails == null || emails.isEmpty()) {
      return Collections.emptyList();
    }
    List<UserEmailEntity> userEmailEntities = userEmailEntityDAO.listByAddresses(emails);
    Map<Long, UserEntity> userEntities = new HashMap<>();
    for (UserEmailEntity userEmailEntity : userEmailEntities) {
      UserEntity userEntity = userEmailEntity.getUserSchoolDataIdentifier().getUserEntity();
      userEntities.put(userEntity.getId(), userEntity);
    }
    return userEntities.values();
  }

  public List<String> listUserEntityIdentifiersByDataSource(SchoolDataSource dataSource) {
    List<String> result = new ArrayList<>();

    List<UserSchoolDataIdentifier> identifiers = listUserSchoolDataIdentifiersByDataSource(dataSource);
    for (UserSchoolDataIdentifier indentifier : identifiers) {
      result.add(indentifier.getIdentifier());
    }

    return result;
  }

  public List<String> listUserEntityIdentifiersByDataSource(String dataSource) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource == null) {
      logger.severe("Could not find school data source: " + dataSource);
      return null;
    } else {
      return listUserEntityIdentifiersByDataSource(schoolDataSource);
    }
  }
  
  public List<UserSchoolDataIdentifier> listUserSchoolDataIdentifiersByDataSource(SchoolDataSource dataSource) {
    return userSchoolDataIdentifierDAO.listByDataSourceAndArchived(dataSource, Boolean.FALSE);
  }

  public boolean hasProfilePicture(UserEntity userEntity) {
    return userProfilePictureController.hasProfilePicture(userEntity);
  }
  
  public boolean isActiveUser(UserEntity userEntity) {
    return isActiveUser(userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userEntity.defaultSchoolDataIdentifier()));
  }
  
  private boolean isActiveUser(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    EnvironmentRoleArchetype[] staffRoles = {
        EnvironmentRoleArchetype.ADMINISTRATOR, 
        EnvironmentRoleArchetype.MANAGER, 
        EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER,
        EnvironmentRoleArchetype.STUDY_GUIDER,
        EnvironmentRoleArchetype.TEACHER
    };
    
    if (!userSchoolDataIdentifier.hasAnyRole(staffRoles)) {
      SearchProvider searchProvider = getProvider("elastic-search");
      if (searchProvider != null) {
        SearchResult searchResult = searchProvider.findUser(userSchoolDataIdentifier.schoolDataIdentifier(), false);
        return searchResult.getTotalHitCount() > 0;
      }
    }
    return true;
  }
  
  private SearchProvider getProvider(String name) {
    for (SearchProvider searchProvider : searchProviders) {
      if (name.equals(searchProvider.getName())) {
        return searchProvider;
      }
    }
    return null;
  }

  public boolean isStudent(UserEntity userEntity) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(userEntity);
    return userSchoolDataIdentifier == null || userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT);
  }
  
  public List<UserEntity> listUserEntities() {
    return userEntityDAO.listAll();
  }
  
  public Locale getLocale(UserEntity userEntity) {
    Locale result = null;
    try {
      String locale = userEntity.getLocale();
      if (StringUtils.isNotBlank(locale)) {
        try {
          result = LocaleUtils.toLocale(locale);
        } catch (Exception e) {
          logger.warning(String.format("UserEnity %d has invalid locale %s", userEntity.getId(), locale));
        }
      }
    
      if (result == null) {
        result = new Locale("fi");
      }
    } catch (Exception e) {
      result = Locale.getDefault();
    }
    
    return result;
  }
  
  /**
   * Updates the last login time of the given user entity to the current time.
   * 
   * @param userEntity The user entity to be updated
   * 
   *  @return The updated user entity
   */
  public UserEntity updateLastLogin(UserEntity userEntity) {
    return userEntityDAO.updateLastLogin(userEntity);
  }

  public UserEntity updateDefaultSchoolDataSource(UserEntity userEntity, SchoolDataSource defaultSchoolDataSource) {
    return userEntityDAO.updateDefaultSchoolDataSource(userEntity, defaultSchoolDataSource);
  }
  
  public UserEntity updateDefaultSchoolDataSource(UserEntity userEntity, String defaultSchoolDataSource) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(defaultSchoolDataSource);
    if (schoolDataSource != null) {
      return updateDefaultSchoolDataSource(userEntity, schoolDataSource);
    } else {
      logger.severe(String.format("Could not find school data source %s", defaultSchoolDataSource));
      return null;
    }
  }
  
  public UserEntity updateDefaultIdentifier(UserEntity userEntity, String defaultIdentifier) {
    return userEntityDAO.updateDefaultIdentifier(userEntity, defaultIdentifier);
  }

  public UserEntity updateLocale(UserEntity userEntity, Locale locale) {
    return userEntityDAO.updateLocale(userEntity, locale != null ? locale.toString() : null);
  }

  public UserEntity archiveUserEntity(UserEntity userEntity) {
    return userEntityDAO.updateArchived(userEntity, Boolean.TRUE);
  }
  
  public UserEntity unarchiveUserEntity(UserEntity userEntity) {
    return userEntityDAO.updateArchived(userEntity, Boolean.FALSE);
  }
  
  public UserEntity markAsUpdatedByStudent(UserEntity userEntity) {
    return userEntityDAO.updateUpdatedByStudent(userEntity, Boolean.TRUE);
  }

}