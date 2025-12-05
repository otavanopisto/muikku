package fi.otavanopisto.muikku.users;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.EnumUtils;
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
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriodType;
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
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

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

  public boolean hasProfilePicture(UserEntity userEntity) {
    return userProfilePictureController.hasProfilePicture(userEntity);
  }
  
  /**
   * Returns true if given UserEntity is an active user. Essentially
   * checks if the default UserSchoolDataIdentifier of the UserEntity
   * is active or not.
   * 
   * @param userEntity UserEntity
   * @return true if userEntity is an active user
   * @throws IllegalArgumentException if userEntity is null
   */
  public boolean isActiveUserEntity(UserEntity userEntity) throws IllegalArgumentException {
    if (userEntity == null) {
      throw new IllegalArgumentException("UserEntity was not specified");
    }
    
    if (Boolean.TRUE.equals(userEntity.getArchived())) {
      // Archived UserEntity can never be active
      return false;
    }

    // Find the currently active UserSchoolDataIdentifier
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userEntity.defaultSchoolDataIdentifier());
    
    // findUserSchoolDataIdentifierBySchoolDataIdentifier returns only unarchived UserSchoolDataIdentifiers, so if we get null, return false.
    return userSchoolDataIdentifier != null ? isActiveUserSchoolDataIdentifier(userSchoolDataIdentifier) : false;
  }
  
  /**
   * Returns true if the given UserSchoolDataIdentifier is considered to be active.
   * 
   * Requirements:
   * - UserSchoolDataIdentifier cannot be archived
   * - UserEntity the UserSchoolDataIdentifier points to must exist and cannot be archived
   * - The given UserSchoolDataIdentifier must be the default identifier of the UserEntity
   * 
   * @param userSchoolDataIdentifier
   * @return true if userSchoolDataIdentifier is considered to be active
   * @throws IllegalArgumentException if userSchoolDataIdentifier is null
   */
  public boolean isActiveUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    if (userSchoolDataIdentifier == null) {
      throw new IllegalArgumentException("UserSchoolDataIdentifier was not specified");
    }
    
    UserEntity userEntity = userSchoolDataIdentifier.getUserEntity();
    
    // Return false if userEntity is missing or either are archived
    if (Boolean.TRUE.equals(userSchoolDataIdentifier.getArchived()) || userEntity == null || Boolean.TRUE.equals(userEntity.getArchived())) {
      return false;
    }

    // Return false if identifier is not default identifier
    if (!userSchoolDataIdentifier.schoolDataIdentifier().equals(userEntity.defaultSchoolDataIdentifier())) {
      return false;
    }

    // Guardians have additional check to determine if they are acive or not. To be 
    // active, they need to have active dependents (students) they are a guardian of.
    // Sadly this information is only availabe through a bridge.
    if (userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT_PARENT)) {
      schoolDataBridgeSessionController.startSystemSession();
      try {
        return userSchoolDataController.isActiveGuardian(userSchoolDataIdentifier.schoolDataIdentifier());
      } finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
    }
    
    if (!userSchoolDataIdentifier.hasAnyRole(EnvironmentRoleArchetype.STAFF_ROLES)) {
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
  
  /**
   * Returns true, if the student is under 18 years old and
   * part of compulsory education system.
   * 
   * @param studentIdentifier Student's identifier
   * @return true if yes
   */
  public boolean isUnder18CompulsoryEducationStudent(SchoolDataIdentifier studentIdentifier) {
    if (studentIdentifier == null) {
      logger.log(Level.WARNING, "Called with null studentIdentifier.");
      return false;
    }
    
    for (SearchProvider searchProvider : searchProviders) {
      if (StringUtils.equals(searchProvider.getName(), "elastic-search")) {
        SearchResult searchResult = searchProvider.findUser(studentIdentifier, true);
        
        if (searchResult.getTotalHitCount() != 1) {
          logger.log(Level.WARNING, String.format("Couldn't find unique result for identifier %s, %d results.", studentIdentifier.toId(), searchResult.getTotalHitCount()));
          return false;
        }
        
        List<Map<String, Object>> results = searchResult.getResults();
        Map<String, Object> match = results.get(0);

        try {
          String birthdayStr = (String) match.get("birthday");

          if (StringUtils.isNotBlank(birthdayStr)) {
            LocalDate birthday = LocalDate.parse(birthdayStr);
            
            if (birthday == null || birthday.plusYears(18).isBefore(LocalDate.now())) {
              // Student is 18 years old or older, return false
              return false;
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> studyPeriods = (List<Map<String, Object>>) match.get("studyPeriods");

            if (CollectionUtils.isNotEmpty(studyPeriods)) {
              EnumSet<UserStudyPeriodType> states = EnumSet.of(
                  UserStudyPeriodType.COMPULSORY_EDUCATION, 
                  UserStudyPeriodType.NON_COMPULSORY_EDUCATION, 
                  UserStudyPeriodType.EXTENDED_COMPULSORY_EDUCATION
              );
              LocalDate now = LocalDate.now();
              LocalDate date = null;
              UserStudyPeriodType state = null;
    
              /*
               * Loop through study periods and for the periods
               * that are active, check that they are one of the
               * states that correspond to the compulsory state.
               * After the loop is done, we should have the state
               * in state variable that is the currently active one.
               */
              for (Map<String, Object> studyPeriod : studyPeriods) {
                UserStudyPeriodType periodType = EnumUtils.getEnum(UserStudyPeriodType.class, (String) studyPeriod.get("type"));
                if (states.contains(periodType)) {
                  String periodBeginStr = (String) studyPeriod.get("begin");
                  String periodEndStr = (String) studyPeriod.get("end");

                  LocalDate periodBegin = StringUtils.isNotBlank(periodBeginStr) ? LocalDate.parse(periodBeginStr) : null;
                  LocalDate periodEnd = StringUtils.isNotBlank(periodEndStr) ? LocalDate.parse(periodEndStr) : null;

                  boolean isActivePeriod = 
                      (periodBegin == null || periodBegin.equals(now) || periodBegin.isBefore(now)) &&
                      (periodEnd == null || periodEnd.equals(now) || periodEnd.isAfter(now));

                  if (isActivePeriod && (date == null || periodBegin.isAfter(date))) {
                    date = periodBegin;
                    state = periodType;
                  }
                }
              }
              
              EnumSet<UserStudyPeriodType> activeStates = EnumSet.of(
                  UserStudyPeriodType.COMPULSORY_EDUCATION, 
                  UserStudyPeriodType.EXTENDED_COMPULSORY_EDUCATION
              );
              
              if (activeStates.contains(state)) {
                return true;
              }
            }
          }
        }
        catch (DateTimeParseException ex) {
          return false;
        }
      }
    }

    return false;
  }

}