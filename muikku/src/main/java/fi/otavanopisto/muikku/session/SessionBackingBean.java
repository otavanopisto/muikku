package fi.otavanopisto.muikku.session;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.otavanopisto.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.otavanopisto.muikku.plugins.worklist.WorklistController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceBackingBean;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

@RequestScoped
@Named
@Stateful
public class SessionBackingBean {

  @Inject
  private SessionController sessionController;

  @Inject
  private LocaleController localeController;

  @Inject
  private UserController userController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SystemSettingsController systemSettingsController;

  @Inject
  private WorkspaceBackingBean workspaceBackingBean;

  @Inject
  private ForumController forumController;
  
  @Inject
  private ChatController chatController;
  
  @Inject
  private WorklistController worklistController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private CurrentUserSession currentUserSession;

  @PostConstruct
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void init() {
    loggedUserRoleArchetype = null;
    loggedUserName = null;
    testsRunning = StringUtils.equals("true", System.getProperty("tests.running"));
    bugsnagApiKey = systemSettingsController.getSetting("bugsnagApiKey");
    bugsnagEnabled = StringUtils.isNotBlank(bugsnagApiKey);
    loggedUserId = null;
    loggedUser = null;
    canAccessEnvironmentForum = forumController.isEnvironmentForumActive() && hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM);
    canAccessChat = chatController.isChatActive();
    canAccessWorklist = worklistController.isWorklistActive();

    if (sessionController.isLoggedIn()) {
      UserEntity loggedUser = sessionController.getLoggedUserEntity();
      if (loggedUser != null) {
        String activeSchoolDataSource = sessionController.getLoggedUserSchoolDataSource();
        String activeUserIdentifier = sessionController.getLoggedUserIdentifier();
        
        EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(sessionController.getLoggedUser());
        if (roleEntity != null) {
          loggedUserRoleArchetype = roleEntity.getArchetype();
        }

        User user = userController.findUserByDataSourceAndIdentifier(activeSchoolDataSource, activeUserIdentifier);
        if (user != null) {        	
          if (!loggedUserRoleArchetype.equals(EnvironmentRoleArchetype.STUDENT)) {
            loggedUserName = String.format("%s %s (%s)", user.getFirstName(), user.getLastName(),
                resolveLoggedUserRoleText());
          }
          else if (user.getNickName() != null) {
            loggedUserName = String.format("%s %s (%s)", user.getNickName(), user.getLastName(),
                user.getStudyProgrammeName());
          }
          else {
            loggedUserName = user.getDisplayName();
          }
        }
      }

      this.loggedUserId = sessionController.getLoggedUserEntity().getId();
      this.loggedUser = sessionController.getLoggedUser().toId();

      if (!sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM)
          || !currentUserSession.isActive()) {
        this.areaPermissions = null;
      }
      else {
        List<EnvironmentForumArea> forumAreas = forumController.listEnvironmentForums();
        Map<Long, AreaPermission> areaPermissions = new HashMap<>();

        for (EnvironmentForumArea forumArea : forumAreas) {
          AreaPermission areaPermission = new AreaPermission(
              sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_EDIT_ENVIRONMENT_MESSAGES,
                  forumArea),
              sessionController.hasPermission(ForumResourcePermissionCollection.FORUM_DELETE_ENVIRONMENT_MESSAGES,
                  forumArea));
          areaPermissions.put(forumArea.getId(), areaPermission);
        }

        try {
          this.areaPermissions = new ObjectMapper().writeValueAsString(areaPermissions);
        }
        catch (JsonProcessingException e) {
          this.areaPermissions = null;
        }
      }
    }
    else {
      this.areaPermissions = null;
    }

    if (sessionController.isLoggedIn()) {
      UserEntity userEntity = sessionController.getLoggedUserEntity();
      User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserSchoolDataSource(), sessionController.getLoggedUserIdentifier());
      List<UserAddress> userAddresses = userController.listUserAddresses(user);
      List<UserPhoneNumber> userPhoneNumbers = userController.listUserPhoneNumbers(user);
        
      displayName = user.getNickName() == null ? user.getDisplayName() : String.format("%s %s (%s)", user.getNickName(), user.getLastName(), user.getStudyProgrammeName());
        
      studyStartDate = user.getStudyStartDate();
      studyEndDate = user.getStudyEndDate();
      studyTimeEnd = user.getStudyTimeEnd();
      studyTimeLeftStr = "";

      if (studyTimeEnd != null) {
        OffsetDateTime now = OffsetDateTime.now();
        Locale locale = sessionController.getLocale();
          
        if (now.isBefore(studyTimeEnd)) {
          long studyTimeLeftYears = now.until(studyTimeEnd, ChronoUnit.YEARS);
          now = now.plusYears(studyTimeLeftYears);
          if (studyTimeLeftYears > 0) {
            studyTimeLeftStr += studyTimeLeftYears + " " + localeController.getText(locale, "plugin.profile.studyTimeEndShort.y");
          }
            
          long studyTimeLeftMonths = now.until(studyTimeEnd, ChronoUnit.MONTHS);
          now = now.plusMonths(studyTimeLeftMonths);
          if (studyTimeLeftMonths > 0) {
            if (studyTimeLeftStr.length() > 0)
              studyTimeLeftStr += " ";
            studyTimeLeftStr += studyTimeLeftMonths + " " + localeController.getText(locale, "plugin.profile.studyTimeEndShort.m");
          }
          
          long studyTimeLeftDays = now.until(studyTimeEnd, ChronoUnit.DAYS);
          now = now.plusDays(studyTimeLeftDays);
          if (studyTimeLeftDays > 0) {
            if (studyTimeLeftStr.length() > 0)
              studyTimeLeftStr += " ";
            studyTimeLeftStr += studyTimeLeftDays + " " + localeController.getText(locale, "plugin.profile.studyTimeEndShort.d");
          }
        }

        long studyTimeLeftMonths = now.until(studyTimeEnd, ChronoUnit.MONTHS);
        now = now.plusMonths(studyTimeLeftMonths);
        if (studyTimeLeftMonths > 0) {
          if (studyTimeLeftStr.length() > 0)
            studyTimeLeftStr += " ";
          studyTimeLeftStr += studyTimeLeftMonths + " "
              + localeController.getText(locale, "plugin.profile.studyTimeEndShort.m");
        }

        long studyTimeLeftDays = now.until(studyTimeEnd, ChronoUnit.DAYS);
        now = now.plusDays(studyTimeLeftDays);
        if (studyTimeLeftDays > 0) {
          if (studyTimeLeftStr.length() > 0)
            studyTimeLeftStr += " ";
          studyTimeLeftStr += studyTimeLeftDays + " "
            + localeController.getText(locale, "plugin.profile.studyTimeEndShort.d");
        }
      }

      ArrayList<String> foundAddresses = new ArrayList<>();
      for (UserAddress userAddress : userAddresses) {
        foundAddresses.add(String.format("%s %s %s %s", userAddress.getStreet(), userAddress.getPostalCode(),
            userAddress.getCity(), userAddress.getCountry()));
      }
      try {
        this.addresses = new ObjectMapper().writeValueAsString(foundAddresses);
      } catch (JsonProcessingException e) {
        this.addresses = null;
      }

      ArrayList<String> foundPhoneNumbers = new ArrayList<>();
      for (UserPhoneNumber userPhoneNumber : userPhoneNumbers) {
        foundPhoneNumbers.add(userPhoneNumber.getNumber());
      }

      try {
        this.phoneNumbers = new ObjectMapper().writeValueAsString(foundPhoneNumbers);
      } catch (JsonProcessingException e) {
        this.phoneNumbers = null;
      }

      SchoolDataIdentifier identifier = userEntity.defaultSchoolDataIdentifier();
      List<String> foundEmails = userEmailEntityController.getUserEmailAddresses(identifier);
      try {
        this.emails = new ObjectMapper().writeValueAsString(foundEmails);
      } catch (JsonProcessingException e) {
        this.emails = null;
      }
    }
  }

  public boolean getLoggedIn() {
    return sessionController.isLoggedIn();
  }

  public boolean getIsStudent() {
    return loggedUserRoleArchetype != null && loggedUserRoleArchetype.equals(EnvironmentRoleArchetype.STUDENT);
  }

  public boolean getIsActiveUser() {
    return currentUserSession.isActive();
  }

  public Long getLoggedUserId() {
    return loggedUserId;
  }

  public String getLoggedUser() {
    return loggedUser;
  }

  public String getResourceLibrary() {
    return "theme-muikku";
  }

  public boolean hasEnvironmentPermission(String permissions) {
    if (StringUtils.isBlank(permissions)) {
      return false;
    }

    for (String permission : StringUtils.split(permissions, ',')) {
      if (sessionController.hasEnvironmentPermission(permission)) {
        return true;
      }
    }

    return false;
  }

  public boolean hasWorkspacePermission(String permissions) {
    if (StringUtils.isBlank(permissions)) {
      return false;
    }

    WorkspaceEntity workspaceEntity = workspaceBackingBean.getWorkspaceEntity();

    for (String permission : StringUtils.split(permissions, ',')) {
      if (hasWorkspacePermission(permission, workspaceEntity)) {
        return true;
      }
    }

    return false;
  }

  public boolean hasWorkspacePermission(String permission, Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceEntityId != null
        ? workspaceEntityController.findWorkspaceEntityById(workspaceEntityId)
        : null;
    return hasWorkspacePermission(permission, workspaceEntity);
  }

  private boolean hasWorkspacePermission(String permission, WorkspaceEntity workspaceEntity) {
    return sessionController.hasWorkspacePermission(permission, workspaceEntity);
  }

  public String getLoggedUserName() {
    return loggedUserName != null ? loggedUserName : "";
  }

  public Locale getLocale() {
    return localeController.resolveLocale(sessionController.getLocale());
  }

  public String getCurrentCountry() {
    return sessionController.getLocale().getCountry();
  }

  public boolean getTestsRunning() {
    return testsRunning;
  }

  public String getBugsnagApiKey() {
    return bugsnagApiKey;
  }

  public boolean getBugsnagEnabled() {
    return bugsnagEnabled;
  }

  private String resolveLoggedUserRoleText() {
    Locale locale = localeController.resolveLocale(sessionController.getLocale());
    switch (loggedUserRoleArchetype) {
    case ADMINISTRATOR:
      return localeController.getText(locale, "role.administrator");
    case MANAGER:
      return localeController.getText(locale, "role.manager");
    case STUDENT:
      return localeController.getText(locale, "role.student");
    case STUDY_PROGRAMME_LEADER:
      return localeController.getText(locale, "role.studyProgrammeLeader");
    case TEACHER:
      return localeController.getText(locale, "role.teacher");
    case STUDY_GUIDER:
      return localeController.getText(locale, "role.studyguider");
    default:
      return localeController.getText(locale, "role.custom");
    }
  }

  private String loggedUser;
  private Long loggedUserId;
  private EnvironmentRoleArchetype loggedUserRoleArchetype;
  private String loggedUserName;
  private boolean testsRunning;
  private String bugsnagApiKey;
  private boolean bugsnagEnabled;

  public String getAreaPermissions() {
    return areaPermissions != null ? areaPermissions : "null";
  }

  public Boolean getUserPropertyAsBoolean(String propertyKey) {
    String userProperty = this.getUserProperty(propertyKey);
    return userProperty != null && "1".equals(userProperty);
  }

  public String getUserProperty(String propertyKey) {
    if (!sessionController.isLoggedIn()) {
      return null;
    }

    SchoolDataIdentifier userIdentifier = sessionController.getLoggedUser();
    if (userIdentifier == null) {
      return null;
    }
    User user = userController.findUserByIdentifier(userIdentifier);
    if (user == null) {
      return null;
    }
    UserProperty userProperty = userSchoolDataController.getUserProperty(user, propertyKey);
    if (userProperty == null) {
      return null;
    }
    return userProperty.getValue();
  }

  private String areaPermissions;

  public static class AreaPermission {

    public AreaPermission(Boolean editMessages, Boolean removeThread) {
      this.editMessages = editMessages;
      this.removeThread = removeThread;
    }

    public Boolean getRemoveThread() {
      return removeThread;
    }

    public Boolean getEditMessages() {
      return editMessages;
    }

    private final Boolean editMessages;
    private final Boolean removeThread;
  }

  public String getDisplayName() {
    return displayName != null ? displayName : "";
  }

  public String getAddresses() {
    return addresses != null ? addresses : "[]";
  }

  public String getEmails() {
    return emails != null ? emails : "[]";
  }

  public String getPhoneNumbers() {
    return phoneNumbers != null ? phoneNumbers : "[]";
  }

  public String getStudyStartDate() {
    return studyStartDate != null ? Date.from(studyStartDate.toInstant()).toString() : "";
  }

  public String getStudyEndDate() {
  return studyEndDate != null ? Date.from(studyEndDate.toInstant()).toString() : "";
  }

  public String getStudyTimeEnd() {
    return studyTimeEnd != null ? Date.from(studyTimeEnd.toInstant()).toString() : "";
  }

  public String getStudyTimeLeftStr() {
    return studyTimeLeftStr != null ? studyTimeLeftStr : "";
  }

  public boolean isCanAccessEnvironmentForum() {
    return canAccessEnvironmentForum;
  }

  public boolean isCanAccessWorklist() {
    return canAccessWorklist;
  }

  public boolean isCanAccessChat() {
    return canAccessChat;
  }

  private String displayName;
  private String emails;
  private String addresses;
  private String phoneNumbers;
  private OffsetDateTime studyStartDate;
  private OffsetDateTime studyEndDate;
  private OffsetDateTime studyTimeEnd;
  private String studyTimeLeftStr;
  private boolean canAccessEnvironmentForum;
  private boolean canAccessWorklist;
  private boolean canAccessChat;

}