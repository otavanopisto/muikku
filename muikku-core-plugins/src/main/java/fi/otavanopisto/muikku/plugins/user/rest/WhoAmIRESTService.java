package fi.otavanopisto.muikku.plugins.user.rest;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEmailEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.otavanopisto.muikku.plugins.worklist.WorklistController;
import fi.otavanopisto.muikku.rest.AbstractRESTService;
import fi.otavanopisto.muikku.rest.model.UserWhoAmIInfo;
import fi.otavanopisto.muikku.rest.model.UserWhoAmIInfoServices;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.CurrentUserSession;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@RequestScoped
@Path("/user")
@Produces("application/json")
@Consumes("application/json")
@RestCatchSchoolDataExceptions
public class WhoAmIRESTService extends AbstractRESTService {

  @Inject 
  @BaseUrl
  private String baseUrl;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private PermissionController permissionController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private CurrentUserSession currentUserSession;
  
  @Inject 
  private CourseMetaController courseMetaController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private ChatController chatController;

  @Inject
  private ForumController forumController;
  
  @Inject
  private WorklistController worklistController;

  @GET
  @Path("/whoami")
  @RESTPermit(handling = Handling.INLINE)
  public Response findWhoAmI(@Context Request request) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    SchoolDataIdentifier userIdentifier = userEntity == null ? null : sessionController.getLoggedUser();

    // User role
    
    Set<EnvironmentRoleArchetype> roles = new HashSet<>();
    if (userIdentifier != null) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.
          findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
      if (userSchoolDataIdentifier != null) {
        roles = userSchoolDataIdentifier.getRoles().stream().map(roleEntity -> roleEntity.getArchetype()).collect(Collectors.toSet());
      }
    }
    
    // Environment level permissions
    
    Set<String> permissionSet = new HashSet<String>();
    List<Permission> permissions = permissionController.listPermissionsByScope("ENVIRONMENT");
    for (Permission permission : permissions) {
      if (sessionController.hasEnvironmentPermission(permission.getName())) {
        permissionSet.add(permission.getName());
      }
    }
    
    // Response
    
    User user = userIdentifier == null ? null : userController.findUserByIdentifier(userIdentifier);

    SchoolDataIdentifier organizationIdentifier = user == null ? null : user.getOrganizationIdentifier();
    boolean isDefaultOrganization = user == null ? false : systemSettingsController.isDefaultOrganization(organizationIdentifier);
    boolean hasImage = userEntity == null ? false : userEntityFileController.hasProfilePicture(userEntity);
    
    // Study dates

    OffsetDateTime studyStartDate = user == null ? null : user.getStudyStartDate();
    OffsetDateTime studyEndDate = user == null ? null : user.getStudyEndDate();
    OffsetDateTime studyTimeEnd = user == null ? null : user.getStudyTimeEnd();
    String studyTimeLeftStr = userEntityController.getStudyTimeEndAsString(studyTimeEnd);
    
    // Curriculum 
    String curriculumName = null;
    
    if (user != null) {
      if (user.getCurriculumIdentifier() != null) {
        Curriculum curriculum = courseMetaController.findCurriculum(user.getCurriculumIdentifier());
        curriculumName = curriculum == null ? null : curriculum.getName();
      }
    }
    // Damn emails, addresses, and phoneNumbers as json
    
    String emails = null;
    if (userIdentifier != null) {
      List<String> foundEmails = userEmailEntityController.getUserEmailAddresses(userIdentifier).stream().map(UserEmailEntity::getAddress).collect(Collectors.toList());
      try {
        emails = new ObjectMapper().writeValueAsString(foundEmails);
      }
      catch (JsonProcessingException e) {
        emails = null;
      }
    }
    
    String addresses = null;
    if (userIdentifier != null) {
      List<UserAddress> userAddresses = userController.listUserAddresses(user);
      ArrayList<String> foundAddresses = new ArrayList<>();
      for (UserAddress userAddress : userAddresses) {
        foundAddresses.add(String.format("%s %s %s %s", userAddress.getStreet(), userAddress.getPostalCode(),
            userAddress.getCity(), userAddress.getCountry()));
      }
      try {
        addresses = new ObjectMapper().writeValueAsString(foundAddresses);
      } 
      catch (JsonProcessingException e) {
        addresses = null;
      }
    }
    
    String phoneNumbers = null;
    if (userIdentifier != null) {
      List<UserPhoneNumber> userPhoneNumbers = userIdentifier == null ? null :  userController.listUserPhoneNumbers(user);
      ArrayList<String> foundPhoneNumbers = new ArrayList<>();
      for (UserPhoneNumber userPhoneNumber : userPhoneNumbers) {
        foundPhoneNumbers.add(userPhoneNumber.getNumber());
      }
      try {
        phoneNumbers = new ObjectMapper().writeValueAsString(foundPhoneNumbers);
      }
      catch (JsonProcessingException e) {
        phoneNumbers = null;
      }
    }
    
    Locale localeObj = sessionController.getLocale();
    String locale = (localeObj == null || localeObj.getLanguage() == null) ? "fi" : localeObj.getLanguage().toLowerCase();

    /**
     * Chat
     */
    boolean chatAvailable = chatController.isChatEnabled(sessionController.getLoggedUserEntity());

    /**
     * Worklist
     */
    boolean worklistAvailable = worklistController.isWorklistAvailable() && sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_WORKLIST_BILLING);

    /**
     * Environment Forum
     */
    boolean environmentForumAvailable = forumController.isEnvironmentForumActive() && sessionController.hasEnvironmentPermission(ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM);

    UserWhoAmIInfoServices services = new UserWhoAmIInfoServices(
        chatAvailable,
        worklistAvailable,
        environmentForumAvailable
    );
    
    // Result object
    UserWhoAmIInfo whoamiInfo = new UserWhoAmIInfo(
        userEntity == null ? null : userEntity.getId(),
        userEntity == null ? null : userEntity.defaultSchoolDataIdentifier().toId(),
        user == null ? null : user.getFirstName(),
        user == null ? null : user.getLastName(),
        user == null ? null : user.getNickName(),
        user == null ? null : user.getStudyProgrammeName(),
        user == null || user.getStudyProgrammeIdentifier() == null ? null : user.getStudyProgrammeIdentifier().toId(),
        hasImage,
        user == null ? false : user.getHasEvaluationFees(),
        user == null || user.getCurriculumIdentifier() == null ? null : user.getCurriculumIdentifier().toId(),
        curriculumName,
        organizationIdentifier != null ? organizationIdentifier.toId() : null,
        isDefaultOrganization,
        currentUserSession.isActive(),
        permissionSet,
        roles,
        locale,
        user == null ? null : user.getDisplayName(),
        emails,
        addresses,
        phoneNumbers,
        studyTimeLeftStr,
        studyStartDate,
        studyEndDate,
        studyTimeEnd,
        services); 

    return Response.ok(whoamiInfo).build();
  }

}