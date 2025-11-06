package fi.otavanopisto.muikku.rest.user;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.UserPendingPasswordChangeDAO;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.FlagShare;
import fi.otavanopisto.muikku.model.users.FlagStudent;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserInfo;
import fi.otavanopisto.muikku.model.users.UserPendingPasswordChange;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.rest.AbstractRESTService;
import fi.otavanopisto.muikku.rest.model.GuardianRestModel;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.rest.model.StaffMemberBasicInfo;
import fi.otavanopisto.muikku.rest.model.Student;
import fi.otavanopisto.muikku.rest.model.StudentAddress;
import fi.otavanopisto.muikku.rest.model.StudentEmail;
import fi.otavanopisto.muikku.rest.model.StudentPhoneNumber;
import fi.otavanopisto.muikku.rest.model.UserContactRestModel;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.Guardian;
import fi.otavanopisto.muikku.schooldata.entity.StudyProgramme;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserContact;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.payload.StaffMemberPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentPayload;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchResults;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.CreatedUserEntityFinder;
import fi.otavanopisto.muikku.users.FlagController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@RequestScoped
@Path("/user")
@Produces("application/json")
@Consumes("application/json")
@RestCatchSchoolDataExceptions
public class UserRESTService extends AbstractRESTService {

  @Inject
  private Logger logger;
  
  @Inject 
  @BaseUrl
  private String baseUrl;
  
  @Inject
  private LocaleController localeController;

  @Inject
  private Mailer mailer;

  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private UserController userController;

  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private FlagController flagController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private GradingController gradingController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO;
  
  @Inject
  private CreatedUserEntityFinder createdUserEntityFinder;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private GuidanceCounselorRestModels guidanceCounselorRestModels;

  @GET
  @Path("/property/{KEY}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserEntityProperty(@PathParam("KEY") String key) {
    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
    UserEntityProperty property = userEntityController.getUserEntityPropertyByKey(loggedUserEntity, key);
    return Response.ok(new fi.otavanopisto.muikku.rest.model.UserEntityProperty(key, property == null ? null : property.getValue(), property == null ? null : property.getUserEntity().getId())).build();
  }

  @GET
  @Path("/properties/{USERENTITYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserEntityProperties(@PathParam("USERENTITYID") Long userEntityId, @QueryParam("properties") String keys) {
    // TODO Security (maybe via visibility in userEntityProperty?)
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    List<UserEntityProperty> storedProperties = new ArrayList<UserEntityProperty>();
    List<fi.otavanopisto.muikku.rest.model.UserEntityProperty> restProperties = new ArrayList<fi.otavanopisto.muikku.rest.model.UserEntityProperty>();
    if (StringUtils.isBlank(keys)) {
      storedProperties = userEntityController.listUserEntityProperties(userEntity);
      for (UserEntityProperty property : storedProperties) {
        restProperties.add(new fi.otavanopisto.muikku.rest.model.UserEntityProperty(property.getKey(), property.getValue(), userEntityId));
      }
    }
    else {
      UserEntityProperty storedProperty;
      String[] keyArray = keys.split(",");
      for (int i = 0; i < keyArray.length; i++) {
        storedProperty = userEntityController.getUserEntityPropertyByKey(userEntity, keyArray[i]);
        String value = storedProperty == null ? null : storedProperty.getValue();

        restProperties.add(new fi.otavanopisto.muikku.rest.model.UserEntityProperty(keyArray[i], value, userEntityId));
      }
    }
    return Response.ok(restProperties).build();
  }

  @POST
  @Path("/property")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response setUserEntityProperty(fi.otavanopisto.muikku.rest.model.UserEntityProperty payload) {
    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
    
    Boolean isLoggedUserStudent = userEntityController.isStudent(loggedUserEntity);
    
    if (payload.getUserEntityId() == null || payload.getUserEntityId().equals(loggedUserEntity.getId())) {
      if (StringUtils.equals(payload.getKey(), "hopsPhase") && isLoggedUserStudent) {
        return Response.status(Status.FORBIDDEN).build();
      }
      userEntityController.setUserEntityProperty(loggedUserEntity, payload.getKey(), payload.getValue());
      return Response.ok(payload).build();
    }
    else {
      
      if (isLoggedUserStudent) {
        return Response.status(Status.FORBIDDEN).build();
      }
      UserEntity userEntity = userEntityController.findUserEntityById(payload.getUserEntityId());
      
      if (!userEntityController.isStudent(userEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      userEntityController.setUserEntityProperty(userEntity, payload.getKey(), payload.getValue());
      return Response.ok(payload).build();
    }
  }
  
  @GET
  @Path("/userInfo/{USERENTITYID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserInfo(@PathParam("USERENTITYID") Long userEntityId, @QueryParam("data") Set<UserInfo> data) {
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    Boolean isStudent = userEntityController.isStudent(userEntity);
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && isStudent) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // "moreInfoForLoggedUser" is needed for checking if the logged user is able to get to student's guider view and then get more information about searchable user

    Map<String, String> result = new HashMap<>();
    if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      // Admins, study programme leaders, and managers always see extra info
      if (!isStudent || sessionController.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.MANAGER)) {
        result.put("moreInfoForLoggedUser", Boolean.toString(true));
      }
      else {
        // Extra info if staff and student share common courses
        UserSchoolDataIdentifier teacher = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(sessionController.getLoggedUserEntity());
        UserSchoolDataIdentifier student = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(userEntity);
        List<WorkspaceEntity> commonWorkspaces = workspaceEntityController.listCommonWorkspaces(teacher, student);
        if (!commonWorkspaces.isEmpty()) {
          result.put("moreInfoForLoggedUser", Boolean.toString(true));
        }
        else {
          // Extra info if staff is student's counselor
          result.put("moreInfoForLoggedUser", Boolean.toString(userSchoolDataController.amICounselor(userEntity.defaultSchoolDataIdentifier())));
        }
      }
    }
    else {
      // Extra info for students querying staff
      result.put("moreInfoForLoggedUser", Boolean.toString(!isStudent));
    }
    
    result.put("isStudent", isStudent.toString());
    result.put("userId", userEntity.getId().toString());
    result.put("schoolDataIdentifier", userEntity.defaultSchoolDataIdentifier().toId());
    UserEntityName name = userEntityController.getName(userEntity, true);
    
    if (name != null) {
      result.put("firstName", name.getFirstName());
      result.put("lastName", name.getLastName());
    }

    for (UserInfo d : data) {
       
      if (d.equals(UserInfo.AVATAR)) {
        Boolean hasAvatar = userEntityFileController.hasProfilePicture(userEntity);
        result.put("hasAvatar", hasAvatar.toString());
      }
        
      if (result.get("moreInfoForLoggedUser").equals("true")) {
      
        if (d.equals(UserInfo.EMAIL)) {
          String email = userEmailEntityController.getUserDefaultEmailAddress(userEntity, false);
          if (email != null) {
            result.put("email", email);
          }
        }
          
        if (d.equals(UserInfo.PHONENUMBER)) {
          UserEntityProperty phoneNumber = userEntityController.getUserEntityPropertyByKey(userEntity, "profile-phone");
          if (phoneNumber != null) {
            result.put("phoneNumber", phoneNumber.getValue());
          }
        } 
        
        if (d.equals(UserInfo.EXTRAINFO)) {
          UserEntityProperty extraInfo = userEntityController.getUserEntityPropertyByKey(userEntity, "profile-extrainfo");
          if (extraInfo != null) {
            result.put("extraInfo", extraInfo.getValue());
          }
        } 
        
        if (d.equals(UserInfo.APPOINTMENTCALENDAR)) {
          UserEntityProperty appointmentCalendar = userEntityController.getUserEntityPropertyByKey(userEntity, "profile-appointmentCalendar");
          if (appointmentCalendar != null) {
            result.put("appointmentCalendar", appointmentCalendar.getValue());
          }
        } 
        
        if (d.equals(UserInfo.WHATSAPP)) {
          UserEntityProperty whatsapp = userEntityController.getUserEntityPropertyByKey(userEntity, "profile-whatsapp");
          if (whatsapp != null) {
            result.put("whatsapp", whatsapp.getValue());
          }
        }
        
        if (d.equals(UserInfo.VACATIONS)) {
          UserEntityProperty vacationStart = userEntityController.getUserEntityPropertyByKey(userEntity, "profile-vacation-start");
          UserEntityProperty vacationEnd = userEntityController.getUserEntityPropertyByKey(userEntity, "profile-vacation-end");
          
          if (vacationStart != null) {
            result.put("vacationStart", vacationStart.getValue());
          }
            
          if (vacationEnd != null) {
            result.put("vacationEnd", vacationEnd.getValue());
          }
        }
      }
    }
    return Response.ok(result).build();
  }
  
  @GET
  @Path("/students/{ID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response findStudent(@Context Request request, @PathParam("ID") String id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.FIND_STUDENT)) {
                                                                          // Necessary?
      if (!sessionController.getLoggedUser().equals(studentIdentifier) && !userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    UserEntity userEntity = userSchoolDataIdentifier != null ? userSchoolDataIdentifier.getUserEntity() : null;
    if (userSchoolDataIdentifier == null || userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("UserEntity not found").build();
    }
    
    if (!canAccessOrganization(userSchoolDataIdentifier.getOrganization())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Bug fix #2966: REST endpoint should only return students
    if (!userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(userEntity.getVersion())));

    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }

    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);
    
    User user = userController.findUserByIdentifier(studentIdentifier);
    if (user == null) {
      return Response.status(Status.NOT_FOUND).entity("User not found").build();
    }
    
    String emailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, true); 
    Date studyStartDate = user.getStudyStartDate() != null ? Date.from(user.getStudyStartDate().toInstant()) : null;
    Date studyEndDate = user.getStudyEndDate() != null ? Date.from(user.getStudyEndDate().toInstant()) : null;
    Date studyTimeEnd = user.getStudyTimeEnd() != null ? Date.from(user.getStudyTimeEnd().toInstant()) : null;

    OrganizationEntity organizationEntity = userSchoolDataIdentifier.getOrganization();
    OrganizationRESTModel organizationRESTModel = null;
    if (organizationEntity != null) {
      organizationRESTModel = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
    }

    Student student = new Student(
        studentIdentifier.toId(), 
        user.getFirstName(), 
        user.getLastName(),
        user.getNickName(),
        user.getStudyProgrammeName(),
        user.getStudyProgrammeIdentifier() == null ? null : user.getStudyProgrammeIdentifier().toId(),
        false, 
        user.getNationality(), 
        user.getLanguage(), 
        user.getMunicipality(), 
        user.getSchool(), 
        emailAddress, 
        studyStartDate,
        studyEndDate,
        studyTimeEnd,
        userEntity == null ? null : userEntity.getLastLogin(),
        user.getCurriculumIdentifier() != null ? user.getCurriculumIdentifier().toId() : null,
        courseMetaController.getCurriculumName(user.getCurriculumIdentifier()),
        userEntity == null ? false : userEntity.getUpdatedByStudent(),
        userEntity == null ? -1 : userEntity.getId(),
        organizationRESTModel,
        false
    );
    
    return Response
        .ok(student)
        .cacheControl(cacheControl)
        .tag(tag)
        .build();
  }

  private boolean canAccessOrganization(OrganizationEntity organization) {
    if (organization != null) {
      Long organizationId = organization.getId();
      List<OrganizationEntity> loggedUserOrganizations = organizationEntityController.listLoggedUserOrganizations();
      return loggedUserOrganizations != null ? loggedUserOrganizations.stream().anyMatch(listOrganization -> Objects.equals(organizationId, listOrganization.getId())) : false;
    } else {
      return false;
    }
  }

  @PUT
  @Path("/students/{ID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response updateStudent(
      @PathParam("ID") String id,
      Student student) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUser();
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    if (!(Objects.equals(studentIdentifier.getIdentifier(), loggedUserIdentifier.getIdentifier()) &&
        Objects.equals(studentIdentifier.getDataSource(), loggedUserIdentifier.getDataSource()))) {
      return Response.status(Status.FORBIDDEN).entity("Trying to modify non-logged-in student").build();
    }
    
    User user = userController.findUserByIdentifier(studentIdentifier);
    
    UserEntity userEntity = userEntityController.findUserEntityByUser(user);
    
    userEntityController.markAsUpdatedByStudent(userEntity);
    
    // TODO: update other fields too
    
    user.setMunicipality(student.getMunicipality());
    
    userController.updateUser(user);
    
    return Response.ok().entity(student).build();
  }
  
  @GET
  @Path("/students/{ID}/flags")
  @RESTPermit (handling = Handling.INLINE)
  public Response listStudentFlags(@Context Request request, @PathParam("ID") String id, @QueryParam("ownerIdentifier") String ownerId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    if (StringUtils.isBlank(ownerId)) {
      return Response.status(Response.Status.NOT_IMPLEMENTED).entity("Listing student flags without owner is not implemented").build();
    }
    
    SchoolDataIdentifier ownerIdentifier = SchoolDataIdentifier.fromId(ownerId);
    if (ownerIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("ownerIdentifier is malformed").build();
    }

    if (!ownerIdentifier.equals(sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    List<FlagStudent> flags = flagController.listByOwnedAndSharedStudentFlags(studentIdentifier, ownerIdentifier);
    return Response.ok(createRestModel(flags.toArray(new FlagStudent[0]))).build();
  }
  
  @POST
  @Path("/students/{ID}/flags")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createStudentFlag(@Context Request request, @PathParam("ID") String id, fi.otavanopisto.muikku.rest.model.StudentFlag payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    if (payload.getFlagId() == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Missing flagId").build();
    }
     
    Flag flag = flagController.findFlagById(payload.getFlagId());
    if (flag == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag #%d not found", payload.getFlagId())).build();
    }
    
    if (!flagController.hasFlagPermission(flag, sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity(String.format("You do not have permission to flag students to flag %d", payload.getFlagId())).build();
    }
    
    return Response.ok(createRestModel(flagController.flagStudent(flag, studentIdentifier))).build();
  }
  
  @DELETE
  @Path("/students/{STUDENTID}/flags/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteStudentFlag(@Context Request request, @PathParam("STUDENTID") String studentId, @PathParam("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentId);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", studentId)).build();
    }
    
    FlagStudent flagStudent = flagController.findFlagStudentById(id);
    if (flagStudent == null) {
      return Response.status(Response.Status.NOT_FOUND).entity(String.format("Flag not found %d", id)).build();
    }
    
    if (!flagController.hasFlagPermission(flagStudent.getFlag(), sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity(String.format("You do not have permission to remove student flag %d", flagStudent.getId())).build();
    }

    flagController.unflagStudent(flagStudent);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path("/students/{ID}/phoneNumbers")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listStudentPhoneNumbers(@PathParam("ID") String id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (studentEntity == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Could not find user entity for identifier %s", id)).build();
    }
    User student = userController.findUserByUserEntityDefaults(studentEntity);
    if (!studentEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_STUDENT_PHONE_NUMBERS)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      if (Boolean.TRUE.equals(student.getHidden())) {
        return Response.ok(Collections.emptyList()).build();
      }
    }
    
    List<UserPhoneNumber> phoneNumbers = userController.listUserPhoneNumbers(studentIdentifier);
    if (!phoneNumbers.isEmpty()) {
      phoneNumbers.sort(Comparator.comparing(UserPhoneNumber::getDefaultNumber).reversed());
    }
    
    return Response.ok(createRestModel(phoneNumbers.toArray(new UserPhoneNumber[0]))).build();
  }
  
  @GET
  @Path("/studyProgrammes")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listStudyProgrammes() {
    List<StudyProgramme> studyProgrammes = userController.listStudyProgrammes();
    return Response.ok(createRestModel(studyProgrammes.toArray(new StudyProgramme[0]))).build();
  }
  
  @GET
  @Path("/students/{ID}/emails")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listStudentEmails(@PathParam("ID") String id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (studentEntity == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Could not find user entity for identifier %s", id)).build();
    }
    User student = userController.findUserByIdentifier(studentIdentifier);
    if (!studentEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_STUDENT_EMAILS)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      if (Boolean.TRUE.equals(student.getHidden())) {
        return Response.ok(Collections.emptyList()).build();
      }
    }
    
    List<UserEmail> emails = userController.listUserEmails(studentIdentifier);
    if (!emails.isEmpty()) {
      emails.sort(Comparator.comparing(UserEmail::getDefaultAddress).reversed());
    }
    
    return Response.ok(createRestModel(emails.toArray(new UserEmail[0]))).build();
  }
  
  @GET
  @Path("/students/{ID}/addresses")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listStudentAddressses(@PathParam("ID") String id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (studentEntity == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Could not find user entity for identifier %s", id)).build();
    }
    
    if (!studentEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_STUDENT_ADDRESSES)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<UserAddress> addresses = userController.listUserAddresses(studentIdentifier);
    Collections.sort(addresses, new Comparator<UserAddress>() {
      @Override
      public int compare(UserAddress o1, UserAddress o2) {
        return o1.getDefaultAddress() ? -1 : o2.getDefaultAddress() ? 1 : 0;
      }
    });
    
    return Response.ok(createRestModel(addresses.toArray(new UserAddress[0]))).build();
  }

  @GET
  @Path("/contacts/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listUserContacts(@PathParam("ID") String id) {
    
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(id);
    if (userIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid userIdentifier %s", id)).build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
    if (userEntity == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Could not find user entity for identifier %s", id)).build();
    }
   
    if (!userEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.FIND_STUDENT)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<UserContact> userContacts = userController.listUserContacts(userIdentifier);
    return Response.ok(createRestModel(userContacts.toArray(new UserContact[0]))).build();
  }
  
  @PUT
  @Path("/students/{ID}/addresses/{ADDRESSID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateStudentAddress(
      @PathParam("ID") String id,
      @PathParam("ADDRESSID") String addressId,
      StudentAddress studentAddress
  ) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (studentEntity == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Could not find user entity for identifier %s", id)).build();
    }
    
    if (!studentEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_STUDENT_ADDRESSES)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<UserAddress> addresses = userController.listUserAddresses(studentIdentifier);
    
    for (UserAddress address : addresses) {
      if (address.getIdentifier().toId().equals(studentAddress.getIdentifier())) {
        userEntityController.markAsUpdatedByStudent(studentEntity);

        userController.updateUserAddress(
            studentIdentifier,
            address.getIdentifier(),
            studentAddress.getStreet(),
            studentAddress.getPostalCode(),
            studentAddress.getCity(),
            studentAddress.getCountry());
        return Response.ok().entity(studentAddress).build();
      }
    }
    
    return Response.status(Status.NOT_FOUND).entity("address not found").build();
  }

  @GET
  @Path("/students/{ID}/transferCredits")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response searchStudentTransferCredits(
      @PathParam("ID") String id,
      @QueryParam("curriculumEmpty") @DefaultValue ("true") Boolean curriculumEmpty,
      @QueryParam("curriculumIdentifier") String curriculumIdentifier
      ) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (studentEntity == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Could not find user entity for identifier %s", id)).build();
    }
    
    if (!studentEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_STUDENT_TRANSFER_CREDITS)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<TransferCredit> transferCredits = new ArrayList<TransferCredit>(gradingController.listStudentTransferCredits(studentIdentifier));

    for (int i = transferCredits.size() - 1; i >= 0; i--) {
      TransferCredit tc = transferCredits.get(i);
      SchoolDataIdentifier tcCurriculum = tc.getCurriculumIdentifier();
      
      if (tcCurriculum != null) {
        if (!StringUtils.isEmpty(curriculumIdentifier) && !Objects.equals(tcCurriculum.toId(), curriculumIdentifier)) {
          transferCredits.remove(i);
        }
      } else {
        if (!curriculumEmpty)
          transferCredits.remove(i);
      }
    }
    
    return Response.ok(createRestModel(transferCredits.toArray(new TransferCredit[0]))).build();
  }

  @POST
  @Path("/flags/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createFlag(fi.otavanopisto.muikku.rest.model.Flag payload) {
    if (StringUtils.isBlank(payload.getOwnerIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("ownerIdentifier is missing").build();
    }
    
    if (StringUtils.isBlank(payload.getColor())) {
      return Response.status(Status.BAD_REQUEST).entity("color is missing").build();
    }

    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("name is missing").build();
    }
    
    SchoolDataIdentifier ownerIdentifier = SchoolDataIdentifier.fromId(payload.getOwnerIdentifier());
    if (ownerIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("ownerIdentifier is malformed").build();
    }

    Flag flag = flagController.createFlag(ownerIdentifier, payload.getName(), payload.getColor(), payload.getDescription());
    
    return Response.ok(createRestModel(flag)).build();
  }
  
  @GET
  @Path("/flags/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listFlags(@QueryParam("ownerIdentifier") String ownerId) {
    SchoolDataIdentifier ownerIdentifier = null;

    if (StringUtils.isNotBlank(ownerId)) {
      ownerIdentifier = SchoolDataIdentifier.fromId(ownerId);
      if (ownerIdentifier == null) {
        return Response.status(Status.BAD_REQUEST).entity("ownerIdentifier is malformed").build();
      }

      // TODO: Add permission to list flags owned by others
      if (!ownerIdentifier.equals(sessionController.getLoggedUser())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    List<Flag> flags = flagController.listByOwnedAndSharedFlags(ownerIdentifier);
    return Response.ok(createRestModel(flags.toArray(new Flag[0]))).build();
  }
  
  @GET
  @Path("/flags/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listFlags(@PathParam ("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    Flag flag = flagController.findFlagById(id);
    if (flag == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (flag.getArchived()) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (!flagController.hasFlagPermission(flag, sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity(String.format("You do not have permission to flag#%d", flag.getId())).build();
    }
    
    return Response.ok(createRestModel(flag)).build();
  }
  
  @PUT
  @Path("/flags/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateFlag(@PathParam ("ID") Long id, fi.otavanopisto.muikku.rest.model.Flag payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    Flag flag = flagController.findFlagById(id);
    if (flag == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (flag.getArchived()) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (!flagController.hasFlagPermission(flag, sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity(String.format("You do not have permission to flag#%d", flag.getId())).build();
    }
    
    if (StringUtils.isBlank(payload.getColor())) {
      return Response.status(Status.BAD_REQUEST).entity("color is missing").build();
    }

    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("name is missing").build();
    }

    return Response.ok(createRestModel(flagController.updateFlag(flag, payload.getName(), payload.getColor(), payload.getDescription()))).build();
  }

  @DELETE
  @Path("/flags/{ID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteFlag(@PathParam("ID") long flagId) {
    Flag flag = flagController.findFlagById(flagId);

    if (flag == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    boolean isOwner = false;
    UserSchoolDataIdentifier ownerIdentifier = flag.getOwnerIdentifier();
    SchoolDataIdentifier loggedIdentifier = sessionController.getLoggedUser();
    if (loggedIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Must be logged in.").build();
    }

    UserSchoolDataIdentifier loggedUserIdentifier =
        userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(
            loggedIdentifier);
    
    if (loggedUserIdentifier == null) {
      return Response
                .status(Status.BAD_REQUEST)
                .entity("No user school data identifier for logged user")
                .build();
    }
    
    if (Objects.equals(ownerIdentifier.getIdentifier(), loggedUserIdentifier.getIdentifier()) &&
        Objects.equals(ownerIdentifier.getDataSource().getIdentifier(),
                       loggedUserIdentifier.getDataSource().getIdentifier())) {
      isOwner = true;
    }
    
    if (!flagController.hasFlagPermission(flag, loggedIdentifier)) {
      return Response
                  .status(Status.FORBIDDEN)
                  .entity("You don't have the permission to delete this flag")
                  .build();
    }

    if (isOwner) {
      flagController.deleteFlagCascade(flag);
      return Response.noContent().build();
    } else {
      flagController.unshareFlag(flag, loggedUserIdentifier);
      return Response.noContent().build();
    }
  }
  
  @POST
  @Path("/flags/{ID}/shares")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createFlagShare(@PathParam ("ID") Long id, fi.otavanopisto.muikku.rest.model.FlagShare payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    Flag flag = flagController.findFlagById(id);
    if (flag == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (flag.getArchived()) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (!flagController.hasFlagPermission(flag, sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity(String.format("You do not have permission to flag#%d", flag.getId())).build();
    }
    
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(payload.getUserIdentifier());
    if (userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("userIdentifier is malformed").build();
    }
    
    return Response.ok(createRestModel(flagController.createFlagShare(flag, userIdentifier))).build();
  }
  
  @GET
  @Path("/flags/{ID}/shares")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listFlagShares(@PathParam ("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    Flag flag = flagController.findFlagById(id);
    if (flag == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (flag.getArchived()) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (!flagController.hasFlagPermission(flag, sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity(String.format("You do not have permission to flag#%d", flag.getId())).build();
    }
    
    return Response.ok(createRestModel(flagController.listShares(flag).toArray(new FlagShare[0]))).build();
  }
  
  @DELETE
  @Path("/flags/{FLAGID}/shares/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createFlagShare(@PathParam ("FLAGID") Long flagId, @PathParam ("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    Flag flag = flagController.findFlagById(flagId);
    if (flag == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (flag.getArchived()) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Flag#%d not found", id)).build();
    }
    
    if (!flagController.hasFlagPermission(flag, sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity(String.format("You do not have permission to flag#%d", flag.getId())).build();
    }
    
    FlagShare flagShare = flagController.findFlagShare(id);
    if (flagShare == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Could not find flag share %d", id)).build();
    }
    
    flagController.deleteFlagShare(flagShare);
    
    return Response.noContent().build();
  }
  
  /**
   * POST mApi().user.staffMembers
   * 
   * Creates a new staff member.
   * 
   * Payload:
   * {firstName: required; the first name of the staff member
   *  lastName: required; the last name of the staff member
   *  email: required; the email address of the staff member
   *  role: required; MANAGER|STUDY_PROGRAMME_LEADER|TEACHER|STUDY_GUIDER}
   * 
   * Output:
   * {identifier: identifier of the created staff member
   *  firstName: the first name of the staff member
   *  lastName: the last name of the staff member
   *  email: the email address of the staff member
   *  role: MANAGER|STUDY_PROGRAMME_LEADER|TEACHER|STUDY_GUIDER}
   * 
   * Errors:
   * 409 if the email address is already in use; response contains a localized error message 
   */
  @POST
  @Path("/staffMembers")
  @RESTPermit(MuikkuPermissions.CREATE_STAFF_MEMBER)
  public Response createStaffMember(StaffMemberPayload payload) {
    
    // Payload validation
    
    if (StringUtils.isAnyBlank(payload.getFirstName(), payload.getLastName(), payload.getEmail()) || CollectionUtils.isEmpty(payload.getRoles())) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid payload").build();
    }

    // User creation
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<StaffMemberPayload> response = userController.createStaffMember(dataSource, payload);
        
    if (response.ok()) {
      SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(response.getEntity().getIdentifier());
      UserEntity userEntity = findCreatedUserEntity(identifier);
      if (userEntity != null) {

        // Mail about credential creation

        schoolDataBridgeSessionController.startSystemSession();
        try {
          SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
          String confirmationHash = userSchoolDataController.requestCredentialReset(schoolDataSource, payload.getEmail());

          // Expires in 3 days
          Date expires = DateUtils.addDays(new Date(), 3);
          UserPendingPasswordChange passwordChange = userPendingPasswordChangeDAO.findByUserEntity(userEntity);
          if (passwordChange != null) {
            passwordChange = userPendingPasswordChangeDAO.updateHash(passwordChange, confirmationHash);
            passwordChange = userPendingPasswordChangeDAO.updateExpires(passwordChange, expires);
          }
          else {
            passwordChange = userPendingPasswordChangeDAO.create(userEntity, confirmationHash, expires);
          }

          String resetLink = String.format("%s/forgotpassword/reset?h=%s", baseUrl, confirmationHash);
          String mailSubject = localeController.getText(sessionController.getLocale(), "rest.user.createCredentials.mailSubject");
          String mailContent = localeController.getText(sessionController.getLocale(), "rest.user.createCredentials.mailContent", new String[] { resetLink });
          mailer.sendMail(systemSettingsController.getSystemEmailSenderAddress(), payload.getEmail(), mailSubject, mailContent);
        }
        finally {
          schoolDataBridgeSessionController.endSystemSession();
        }
      }
      else {
        logger.severe("Could not resolve UserEntity for identifier. Credential mail not sent.");
      }
      
      // Success resposne
      
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * PUT mApi().user.staffMembers
   * 
   * Updates a staff member.
   * 
   * Payload:
   * {identifier: required; identifier of the edited staff member
   *  firstName: required; the first name of the staff member
   *  lastName: required; the last name of the staff member
   *  email: required; the email address of the staff member
   *  role: required; MANAGER|STUDY_PROGRAMME_LEADER|TEACHER|STUDY_GUIDER}
   * 
   * Output:
   * {identifier: identifier of the staff member
   *  firstName: the first name of the staff member
   *  lastName: the last name of the staff member
   *  email: the email address of the staff member
   *  role: MANAGER|STUDY_PROGRAMME_LEADER|TEACHER|STUDY_GUIDER}
   * 
   * Errors:
   * 409 if the email address is already in use; response contains a localized error message 
   */
  @PUT
  @Path("/staffMembers/{ID}")
  @RESTPermit(MuikkuPermissions.UPDATE_STAFF_MEMBER)
  public Response updateStaffMember(@PathParam("ID") String id, StaffMemberPayload payload) {
    
    // Payload validation
    
    if (!StringUtils.equals(id, payload.getIdentifier()) ||
        CollectionUtils.isEmpty(payload.getRoles()) ||
        StringUtils.isAnyBlank(payload.getIdentifier(), payload.getFirstName(), payload.getLastName(), payload.getEmail())) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid payload").build();
    }

    // User update
    
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(id);
    BridgeResponse<StaffMemberPayload> response = userController.updateStaffMember(identifier.getDataSource(), payload);
        
    return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
  }

  /**
   * POST mApi().user.students
   * 
   * Creates a new student.
   * 
   * Payload:
   * {firstName: required; the first name of the student
   *  lastName: required; the last name of the student
   *  email: required; the email address of the student
   *  studyProgrammeIdentifier: required; student's study programme (e.g. PYRAMUS-STUDYPROGRAMME-42)
   *  gender: optional; student gender (MALE|FEMALE|OTHER)
   *  ssn: optional; student social security number
   * 
   * Output:
   * {identifier: identifier of the created student (e.g. PYRAMUS-STUDENT-123)
   *  firstName: the first name of the student
   *  lastName: the last name of the student
   *  email: the email address of the student
   *  studyProgrammeIdentifier: the study programme of the student
   *  gender: student gender, if originally sent
   *  ssn: student social security number, if originally sent
   * 
   * Errors:
   * 409 if the email address or (optional) SSN is already in use; response contains a localized error message 
   */
  @POST
  @Path("/students")
  @RESTPermit(MuikkuPermissions.CREATE_STUDENT)
  public Response createStudent(StudentPayload payload) {
    
    // Payload validation
    
    if (StringUtils.isAnyBlank(payload.getFirstName(), payload.getLastName(), payload.getEmail(), payload.getStudyProgrammeIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid payload").build();
    }

    // Student creation
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<StudentPayload> response = userController.createStudent(dataSource, payload);
        
    if (response.ok()) {
      SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(response.getEntity().getIdentifier());
      UserEntity userEntity = findCreatedUserEntity(identifier);
      if (userEntity != null) {

        // Mail about credential creation

        schoolDataBridgeSessionController.startSystemSession();
        try {
          SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
          String confirmationHash = userSchoolDataController.requestCredentialReset(schoolDataSource, payload.getEmail());
          
          // Expires in 3 days
          Date expires = DateUtils.addDays(new Date(), 3);
          UserPendingPasswordChange passwordChange = userPendingPasswordChangeDAO.findByUserEntity(userEntity);
          if (passwordChange != null) {
            passwordChange = userPendingPasswordChangeDAO.updateHash(passwordChange, confirmationHash);
            passwordChange = userPendingPasswordChangeDAO.updateExpires(passwordChange, expires);
          }
          else {
            passwordChange = userPendingPasswordChangeDAO.create(userEntity, confirmationHash, expires);
          }

          String resetLink = String.format("%s/forgotpassword/reset?h=%s", baseUrl, confirmationHash);
          String mailSubject = localeController.getText(sessionController.getLocale(), "rest.user.createCredentials.mailSubject");
          String mailContent = localeController.getText(sessionController.getLocale(), "rest.user.createCredentials.mailContent", new String[] { resetLink });
          mailer.sendMail(systemSettingsController.getSystemEmailSenderAddress(), payload.getEmail(), mailSubject, mailContent);
        }
        finally {
          schoolDataBridgeSessionController.endSystemSession();
        }
      }
      else {
        logger.severe("Could not resolve UserEntity for identifier. Credential mail not sent.");
      }
      
      // Success resposne
      
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }
  
  /**
   * PUT mApi().user.students.basicInfo
   * 
   * Updates a student.
   * 
   * Payload:
   * {firstName: required; the first name of the student
   *  lastName: required; the last name of the student
   *  email: required; the email address of the student
   *  studyProgrammeIdentifier: required; student's study programme (e.g. PYRAMUS-STUDYPROGRAMME-42)
   *  gender: optional; student gender (MALE|FEMALE|OTHER)
   *  ssn: optional; student social security number
   * 
   * Output:
   * {identifier: identifier of the created student (e.g. PYRAMUS-STUDENT-123)
   *  firstName: the first name of the student
   *  lastName: the last name of the student
   *  email: the email address of the student
   *  studyProgrammeIdentifier: the study programme of the student
   *  gender: student gender, if originally sent
   *  ssn: student social security number, if originally sent
   * 
   * Errors:
   * 409 if the email address or (optional) SSN is already in use; response contains a localized error message 
   */
  @PUT
  @Path("/students/{ID}/basicInfo")
  @RESTPermit(MuikkuPermissions.UPDATE_STUDENT)
  public Response updateStudent(@PathParam("ID") String id, StudentPayload payload) {
    
    // Payload validation
    
    if (!StringUtils.equals(id,  payload.getIdentifier()) ||
        StringUtils.isAnyBlank(payload.getFirstName(), payload.getLastName(), payload.getEmail(), payload.getStudyProgrammeIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid payload").build();
    }

    // Student update
    
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(id);
    BridgeResponse<StudentPayload> response = userController.updateStudent(identifier.getDataSource(), payload);
        
    return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
  }

  @GET
  @Path("/students/{IDENTIFIER}/guidanceCounselors")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listGuidanceCounselors(
      @PathParam("IDENTIFIER") String studentIdentifierStr,
      @QueryParam("properties") String properties) {

    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    UserSchoolDataIdentifier loggedUser = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (loggedUser == null || !loggedUser.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.getLoggedUser().equals(studentIdentifier) && !userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    String[] propertyArray = StringUtils.isEmpty(properties) ? new String[0] : properties.split(",");

    return Response.ok(guidanceCounselorRestModels.getGuidanceCounselorRestModels(studentIdentifier, propertyArray)).build();
  }
  
  @GET
  @Path("/students/{IDENTIFIER}/guardians")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listStudentsGuardians(
      @PathParam("IDENTIFIER") SchoolDataIdentifier studentIdentifier) {

    UserSchoolDataIdentifier loggedUser = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (loggedUser == null || !loggedUser.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.getLoggedUser().equals(studentIdentifier) && !userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    List<Guardian> studentsGuardians = userSchoolDataController.listStudentsGuardians(studentIdentifier);
    
    return Response.ok(createRestModel(studentsGuardians)).build();
  }
  
  @PUT
  @Path("/students/{IDENTIFIER}/guardians/{GUARDIANIDENTIFIER}/continuedViewPermission")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateStudentsGuardianContinuedViewPermission(
      @PathParam("IDENTIFIER") SchoolDataIdentifier studentIdentifier,
      @PathParam("IDENTIFIER") SchoolDataIdentifier guardianIdentifier,
      Boolean continuedViewPermission) {

    if (continuedViewPermission == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    UserSchoolDataIdentifier loggedUser = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (loggedUser == null || !loggedUser.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.getLoggedUser().equals(studentIdentifier) && !userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    BridgeResponse<Guardian> response = userSchoolDataController.updateStudentsGuardianContinuedViewPermission(studentIdentifier, guardianIdentifier, continuedViewPermission);
    if (response.ok()) {
      return Response.noContent().build();
    }
    else {
      return Response.status(Status.fromStatusCode(response.getStatusCode())).build();
    }
  }
  
  @GET
  @Path("/staffMembers")
  @RESTPermit (handling = Handling.INLINE)
  public Response searchStaffMembers(
      @QueryParam("q") String searchString,
      @QueryParam("properties") String properties,
      @QueryParam("workspaceEntityId") Long workspaceEntityId,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    List<fi.otavanopisto.muikku.rest.model.StaffMember> staffMembers = new ArrayList<>();
    Set<Long> userGroupFilters = null;
    Set<Long> workspaceFilters = workspaceEntityId == null ? null : Collections.singleton(workspaceEntityId); 
    List<SchoolDataIdentifier> userIdentifiers = null; 

    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    
    if (elasticSearchProvider == null) {
    	return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Search provider not found").build();
    }

      String[] fields;
      if (StringUtils.isNumeric(searchString)) {
        fields = new String[] { "firstName", "lastName", "userEntityId", "email" };
      } else {
        fields = new String[] { "firstName", "lastName", "email" };
      }
      List<EnvironmentRoleArchetype> nonStudentArchetypes = new ArrayList<>(Arrays.asList(EnvironmentRoleArchetype.values()));
      nonStudentArchetypes.remove(EnvironmentRoleArchetype.STUDENT);

      // #4917: When listing workspace staff members, search across all organizations (TODO: Would be better via WorkspaceRESTService.listWorkspaceStaffMembers)
      
      List<OrganizationEntity> organizations;
      if (workspaceEntityId == null) {
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
        OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();
        organizations = Arrays.asList(organization);
      }
      else {
        organizations = organizationEntityController.listUnarchived();
      }
      
      SearchResult result = elasticSearchProvider.searchUsers(
          organizations,
          null, // study programme identifiers
          searchString, 
          fields, 
          nonStudentArchetypes, 
          userGroupFilters, 
          workspaceFilters, 
          userIdentifiers, 
          false, 
          false,
          false,
          firstResult, 
          maxResults,
          false);
      
      List<Map<String, Object>> results = result.getResults();

      if (results != null && !results.isEmpty()) {
        WorkspaceEntity workspaceEntity = workspaceEntityId == null ? null : workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
        String[] propertyArray = StringUtils.isEmpty(properties) ? new String[0] : properties.split(",");
        for (Map<String, Object> o : results) {
          String studentId = (String) o.get("id");
          if (StringUtils.isBlank(studentId)) {
            logger.severe("Could not process user found from search index because it had a null id");
            continue;
          }
          
          String[] studentIdParts = studentId.split("/", 2);
          SchoolDataIdentifier studentIdentifier = studentIdParts.length == 2 ? new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]) : null;
          if (studentIdentifier == null) {
            logger.severe(String.format("Could not process user found from search index with id %s", studentId));
            continue;
          }
          
          if (studentIdentifier.getIdentifier().startsWith("STUDENT-")) {
            // When the users are indexed, the archetype is resolved from EnvironmentUser,
            // so there's 1 archetype per *UserEntity*, not 1 archetype per *User*.
            // That means that if a userentity has both "student" users and "staffmember" users
            // the elasticsearch query returns both. We need to filter them after the fact.
            continue;
          }
          
          String email = userEmailEntityController.getUserDefaultEmailAddress(studentIdentifier, false);
          
          Long userEntityId = Long.valueOf((Integer) o.get("userEntityId"));
          UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
          Map<String, String> propertyMap = new HashMap<String, String>();
          if (userEntity != null) {
            for (int i = 0; i < propertyArray.length; i++) {
              UserEntityProperty userEntityProperty = userEntityController.getUserEntityPropertyByKey(userEntity, propertyArray[i]);
              propertyMap.put(propertyArray[i], userEntityProperty == null ? null : userEntityProperty.getValue());
            }
          }
          
          // #3111: Workspace staff members should be limited to teachers only. A better implementation would support specified workspace roles
          
          if (workspaceEntity != null) {
            WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userEntity.defaultSchoolDataIdentifier());
            if (workspaceUserEntity == null || workspaceUserEntity.getWorkspaceUserRole().getArchetype() != WorkspaceRoleArchetype.TEACHER) {
              continue;
            }
          }

          UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
          OrganizationEntity organizationEntity = usdi.getOrganization();
          OrganizationRESTModel organizationRESTModel = null;
          if (organizationEntity != null) {
            organizationRESTModel = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
          }
          boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);          

          Set<String> roles = new HashSet<>();
          if (usdi.getRoles() != null) {
            usdi.getRoles().forEach(roleEntity -> roles.add(roleEntity.getArchetype().name()));
          }
          
          staffMembers.add(new fi.otavanopisto.muikku.rest.model.StaffMember(
            studentIdentifier.toId(),
            Long.valueOf((Integer) o.get("userEntityId")),
            (String) o.get("firstName"),
            (String) o.get("lastName"), 
            email,
            propertyMap,
            organizationRESTModel,
            roles,
            hasImage));
        }
      }

    SearchResults<List<fi.otavanopisto.muikku.rest.model.StaffMember>> responseStaffMembers = new SearchResults<List<fi.otavanopisto.muikku.rest.model.StaffMember>>(result.getFirstResult(), staffMembers, result.getTotalHitCount());
    return Response.ok(responseStaffMembers).build();
  }
  
  private fi.otavanopisto.muikku.rest.model.StudentFlag createRestModel(FlagStudent flagStudent) {
    SchoolDataIdentifier studentIdentifier = flagStudent.getStudentIdentifier().schoolDataIdentifier();
    return new fi.otavanopisto.muikku.rest.model.StudentFlag(
        flagStudent.getId(),
        flagStudent.getFlag().getId(),
        flagStudent.getFlag().getName(),
        flagStudent.getFlag().getColor(),
        studentIdentifier.toId()
    );
  }

  private List<fi.otavanopisto.muikku.rest.model.StudentFlag> createRestModel(FlagStudent[] flagStudents) {
    List<fi.otavanopisto.muikku.rest.model.StudentFlag> result = new ArrayList<>();
    
    for (FlagStudent flagStudent : flagStudents) {
      result.add(createRestModel(flagStudent));
    }
    
    return result;
  }
  
  private fi.otavanopisto.muikku.rest.model.FlagShare createRestModel(FlagShare flagShare) {
    SchoolDataIdentifier userIdentifier = flagShare.getUserIdentifier().schoolDataIdentifier();
    
    StaffMemberBasicInfo staffMemberBasicInfo = createUserBasicInfoRestModel(userIdentifier);
    return new fi.otavanopisto.muikku.rest.model.FlagShare(flagShare.getId(), flagShare.getFlag().getId(), userIdentifier.toId(), staffMemberBasicInfo);
  }

  private List<fi.otavanopisto.muikku.rest.model.FlagShare> createRestModel(FlagShare[] flagShares) {
    List<fi.otavanopisto.muikku.rest.model.FlagShare> result = new ArrayList<>();
    
    for (FlagShare flagShare : flagShares) {
      result.add(createRestModel(flagShare));
    }
    
    return result;
  }
  
  private List<fi.otavanopisto.muikku.rest.model.TransferCredit> createRestModel(TransferCredit[] transferCredits) {
    List<fi.otavanopisto.muikku.rest.model.TransferCredit> result = new ArrayList<>();
    
    if (transferCredits != null) {
      for (TransferCredit transferCredit : transferCredits) {
        result.add(createRestModel(transferCredit));
      }
    }
    
    return result;
  }
  
  private fi.otavanopisto.muikku.rest.model.TransferCredit createRestModel(TransferCredit transferCredit) {
    GradingScale gradingScale = null;
    SchoolDataIdentifier identifier = transferCredit.getGradingScaleIdentifier();
    if (identifier != null && !StringUtils.isBlank(identifier.getDataSource()) && !StringUtils.isBlank(identifier.getIdentifier())) {
      gradingScale = gradingController.findGradingScale(identifier); 
    }
  
    GradingScaleItem grade = null;
    if (gradingScale != null) {
      identifier = transferCredit.getGradeIdentifier();
      if (identifier != null && !StringUtils.isBlank(identifier.getDataSource()) && !StringUtils.isBlank(identifier.getIdentifier())) {
        grade = gradingController.findGradingScaleItem(gradingScale, identifier);
      }
    }
    
    return new fi.otavanopisto.muikku.rest.model.TransferCredit(
        toId(transferCredit.getIdentifier()), 
        toId(transferCredit.getStudentIdentifier()), 
        transferCredit.getDate(), 
        toId(transferCredit.getGradeIdentifier()), 
        toId(transferCredit.getGradingScaleIdentifier()), 
        grade == null ? null : grade.getName(),
        gradingScale == null ? null : gradingScale.getName(),
        grade == null ? null : grade.isPassingGrade(),
        transferCredit.getVerbalAssessment(), 
        toId(transferCredit.getAssessorIdentifier()), 
        transferCredit.getCourseName(), 
        transferCredit.getCourseNumber(), 
        transferCredit.getLength(), 
        toId(transferCredit.getLengthUnitIdentifier()), 
        toId(transferCredit.getSchoolIdentifier()), 
        toId(transferCredit.getSubjectIdentifier()),
        toId(transferCredit.getCurriculumIdentifier()));
  }
  
  private List<UserContactRestModel> createRestModel(UserContact[] userContacts) {
    List<fi.otavanopisto.muikku.rest.model.UserContactRestModel> result = new ArrayList<>();
    
    if (userContacts != null) {
      for (UserContact userContact : userContacts) {
        result.add(createRestModel(userContact));
      }
    }
    
    return result;
  }
  
  private UserContactRestModel createRestModel(UserContact userContact) {
    return new fi.otavanopisto.muikku.rest.model.UserContactRestModel(
        userContact.getId(),
        userContact.getName(), 
        userContact.getPhoneNumber(), 
        userContact.getEmail(), 
        userContact.getStreetAddress(),
        userContact.getPostalCode(),
        userContact.getCity(),
        userContact.getCountry(),
        userContact.getContactType(),
        userContact.isDefaultContact());
  }
  
  private String toId(SchoolDataIdentifier identifier) {
    if (identifier == null) {
      return null;
    }
    
    return identifier.toId();
  }
  
  private SearchProvider getProvider(String name) {
    Iterator<SearchProvider> i = searchProviders.iterator();
    while (i.hasNext()) {
      SearchProvider provider = i.next();
      if (name.equals(provider.getName())) {
        return provider;
      }
    }
    return null;
  }
  
  private List<fi.otavanopisto.muikku.rest.model.StudyProgramme> createRestModel(StudyProgramme[] entities) {
    List<fi.otavanopisto.muikku.rest.model.StudyProgramme> result = new ArrayList<>();
    for (StudyProgramme entity : entities) {
      result.add(new fi.otavanopisto.muikku.rest.model.StudyProgramme(toId(entity.getIdentifier()), entity.getName()));
    }
    return result;
  }

  private List<StudentPhoneNumber> createRestModel(UserPhoneNumber[] entities) {
    List<StudentPhoneNumber> result = new ArrayList<>();
    
    for (UserPhoneNumber entity : entities) {
      result.add(new StudentPhoneNumber(toId(entity.getUserIdentifier()), entity.getType(), entity.getNumber(), entity.getDefaultNumber()));
    }

    return result;
  }

  private List<StudentEmail> createRestModel(UserEmail[] entities) {
    List<StudentEmail> result = new ArrayList<>();
    
    for (UserEmail entity : entities) {
      result.add(new StudentEmail(toId(entity.getUserIdentifier()), entity.getType(), entity.getAddress(), entity.getDefaultAddress()));
    }

    return result;
  }

  private List<StudentAddress> createRestModel(UserAddress[] entities) {
    List<StudentAddress> result = new ArrayList<>();
    
    for (UserAddress entity : entities) {
      result.add(new StudentAddress(
          toId(entity.getIdentifier()),
          toId(entity.getUserIdentifier()), 
          entity.getStreet(),
          entity.getPostalCode(),
          entity.getCity(),
          entity.getRegion(),
          entity.getCountry(),
          entity.getType(),
          entity.getDefaultAddress())
      );
    }

    return result;
  }

  private fi.otavanopisto.muikku.rest.model.Flag createRestModel(Flag flag) {
    SchoolDataIdentifier ownerIdentifier = flag.getOwnerIdentifier().schoolDataIdentifier();
    return new fi.otavanopisto.muikku.rest.model.Flag(flag.getId(), flag.getName(), flag.getColor(), flag.getDescription(), ownerIdentifier.toId());
  }
  
  private List<fi.otavanopisto.muikku.rest.model.Flag> createRestModel(Flag... flags) {
    List<fi.otavanopisto.muikku.rest.model.Flag> result = new ArrayList<>(flags.length);
    
    for (Flag flag : flags) {
      result.add(createRestModel(flag));
    }
    
    return result;
  }
  
  private StaffMemberBasicInfo createUserBasicInfoRestModel(SchoolDataIdentifier userIdentifier) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByIdentifier(userIdentifier);
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(userIdentifier);
      
      if (user == null) {
        return null;
      }

      boolean hasPicture = userEntityFileController.hasProfilePicture(userEntity);
      return new StaffMemberBasicInfo(userEntity.getId(), userIdentifier, user.getFirstName(), user.getLastName(), 
          user.getNickName(), hasPicture);
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  private UserEntity findCreatedUserEntity(SchoolDataIdentifier identifier) {
    UserEntity userEntity = null;
    long timeoutTime = System.currentTimeMillis() + 30000;    
    while (userEntity == null) {
      userEntity = createdUserEntityFinder.findCreatedUserEntity(identifier);
      if (System.currentTimeMillis() > timeoutTime) {
        logger.severe(String.format("Timeout waiting for created UserEntity for identifier %s", identifier));
        return null;
      }
      if (userEntity == null) {
        try {
          Thread.sleep(500);
        }
        catch (InterruptedException e) {
        }
      }
      else {
        return userEntity;
      }
    }
    return userEntity;
  }
  
  private List<GuardianRestModel> createRestModel(List<Guardian> studentsGuardians) {
    return studentsGuardians.stream()
        .map(guardian -> createRestModel(guardian))
        .collect(Collectors.toList());
  }

  private GuardianRestModel createRestModel(Guardian studentsGuardian) {
    return new GuardianRestModel(
        studentsGuardian.getIdentifier().toId(),
        studentsGuardian.getFirstName(), 
        studentsGuardian.getLastName(),
        studentsGuardian.isContinuedViewPermission()
    );
  }

}