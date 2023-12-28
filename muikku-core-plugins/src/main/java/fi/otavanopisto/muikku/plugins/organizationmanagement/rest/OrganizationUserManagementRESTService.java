package fi.otavanopisto.muikku.plugins.organizationmanagement.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugins.organizationmanagement.OrganizationManagementPermissions;
import fi.otavanopisto.muikku.rest.OrganizationContactPerson;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.rest.model.OrganizationStudentsActivityRESTModel;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchResults;
import fi.otavanopisto.muikku.session.CurrentUserSession;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;

@Path("/organizationUserManagement")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class OrganizationUserManagementRESTService {

  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private CurrentUserSession currentUserSession;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private Instance<SearchProvider> searchProviderInstance;

  @GET
  @Path("/staffMembers")
  @RESTPermit(OrganizationManagementPermissions.ORGANIZATION_SEARCH_STAFF_MEMBERS)
  public Response searchStaffMembers(
      @QueryParam("q") String searchString,
      @QueryParam("properties") String properties,
      @QueryParam("userGroupIds") List<Long> userGroupIds,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    SearchProvider searchProvider = searchProviderInstance.get();
    if (searchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }

    // Restrict search to the organizations of the user
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    if (userSchoolDataIdentifier == null || userSchoolDataIdentifier.getOrganization() == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    OrganizationEntity organizationEntity = userSchoolDataIdentifier.getOrganization();
    
    // Restrict search to staff roles
    
    List<EnvironmentRoleArchetype> roleArchetypes = new ArrayList<>();
    roleArchetypes.add(EnvironmentRoleArchetype.ADMINISTRATOR);
    roleArchetypes.add(EnvironmentRoleArchetype.MANAGER);
    roleArchetypes.add(EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER);
    roleArchetypes.add(EnvironmentRoleArchetype.STUDY_GUIDER);
    roleArchetypes.add(EnvironmentRoleArchetype.TEACHER);

    Set<Long> userGroupFilters = null;
    if (!CollectionUtils.isEmpty(userGroupIds)) {
      userGroupFilters = new HashSet<Long>();
      userGroupFilters.addAll(userGroupIds);
    }

    String[] fields = new String[] { "firstName", "lastName", "email" };
    
    SearchResult result = searchProvider.searchUsers(
        Arrays.asList(organizationEntity),
        null,              // study programme identifiers
        searchString, 
        fields, 
        roleArchetypes, 
        userGroupFilters, 
        null,              // workspaceFilters 
        null,              // userFilters
        false,             // includeInactiveStudents
        false,             // includeHidden
        true,              // onlyDefaultUsers
        firstResult, 
        maxResults,
        false);            // join groups and workspaces
      
    List<Map<String, Object>> results = result.getResults();

    List<fi.otavanopisto.muikku.rest.model.StaffMember> staffMembers = new ArrayList<>();

    OrganizationRESTModel organizationRESTModel = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
    String[] propertyArray = StringUtils.isEmpty(properties) ? new String[0] : properties.split(",");
      
    for (Map<String, Object> o : results) {
        
      String staffMemberId = (String) o.get("id");
      String[] staffMemberIdParts = staffMemberId.split("/", 2);
      SchoolDataIdentifier staffMemberIdentifier = new SchoolDataIdentifier(staffMemberIdParts[0], staffMemberIdParts[1]);
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(staffMemberIdentifier);
      if (userEntity == null) {
        logger.warning(String.format("Skipping Elastic user %s not found in database", staffMemberId));
        continue;
      }
        
      String email = userEmailEntityController.getUserDefaultEmailAddress(staffMemberIdentifier, false);
      Map<String, String> propertyMap = new HashMap<String, String>();
      for (int i = 0; i < propertyArray.length; i++) {
        UserEntityProperty userEntityProperty = userEntityController.getUserEntityPropertyByKey(userEntity, propertyArray[i]);
        propertyMap.put(propertyArray[i], userEntityProperty == null ? null : userEntityProperty.getValue());
      }
      boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);        
      staffMembers.add(new fi.otavanopisto.muikku.rest.model.StaffMember(
          staffMemberIdentifier.toId(),
          new Long((Integer) o.get("userEntityId")),
          (String) o.get("firstName"),
          (String) o.get("lastName"), 
          email,
          propertyMap,
          organizationRESTModel,
          (String) o.get("archetype"),
          hasImage));
    }
      
    SearchResults<List<fi.otavanopisto.muikku.rest.model.StaffMember>> responseStaffMembers = new SearchResults<List<fi.otavanopisto.muikku.rest.model.StaffMember>>(result.getFirstResult(), staffMembers, result.getTotalHitCount());
    return Response.ok(responseStaffMembers).build();
  }
  
  @GET
  @Path("/studentsSummary")
  @RESTPermit(OrganizationManagementPermissions.ORGANIZATION_VIEW)
  public Response studentsSummary() {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SearchProvider searchProvider = searchProviderInstance.get();
    if (searchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController
        .findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();

    OrganizationStudentsActivityRESTModel studentActivityRESTModel = new OrganizationStudentsActivityRESTModel();
    studentActivityRESTModel.setActiveStudents(searchProvider.countActiveStudents(organization));
    studentActivityRESTModel.setInactiveStudents(searchProvider.countInactiveStudents(organization));
    return Response.ok(studentActivityRESTModel).build();
  }
  
  @GET
  @Path("/students")
  @RESTPermit(OrganizationManagementPermissions.ORGANIZATION_SEARCH_STUDENTS)
  public Response searchStudents(
      @QueryParam("q") String searchString,
      @QueryParam("userGroupIds") List<Long> userGroupIds,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    SearchProvider searchProvider = searchProviderInstance.get();
    if (searchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    Set<Long> userGroupFilters = null;
    if (!CollectionUtils.isEmpty(userGroupIds)) {
      userGroupFilters = new HashSet<Long>();
      userGroupFilters.addAll(userGroupIds);
    }

    List<fi.otavanopisto.muikku.rest.model.Student> students = new ArrayList<>();

    String[] fields = new String[] { "firstName", "lastName", "nickName", "email" };

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController
        .findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();

    SearchResult result = searchProvider.searchUsers(
        Arrays.asList(organization),
        currentUserSession.getStudyProgrammeIdentifiers(),
        searchString,
        fields,
        Arrays.asList(EnvironmentRoleArchetype.STUDENT),
        userGroupFilters,
        null,                                                 // workspaceFilters
        null,                                                 // userIdentifiers
        false,                                                // includeInactiveStudents
        false,                                                // includeHidden
        true,                                                 // onlyDefaultUsers
        firstResult,
        maxResults,
        false);                                               // join groups and workspaces

    List<Map<String, Object>> results = result.getResults();

    if (results != null && !results.isEmpty()) {
      for (Map<String, Object> o : results) {
        String studentId = (String) o.get("id");
        String[] studentIdParts = studentId.split("/", 2);
        SchoolDataIdentifier studentIdentifier = new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]);
        UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
        if (userEntity == null) {
          logger.warning(String.format("Skipping Elastic user %s not found in database", studentId));
          continue;
        }
        String emailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, false);

        Date studyStartDate = getDateResult(o.get("studyStartDate"));
        Date studyEndDate = getDateResult(o.get("studyEndDate"));
        Date studyTimeEnd = getDateResult(o.get("studyTimeEnd"));
        
        boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);

        UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
        OrganizationEntity organizationEntity = usdi.getOrganization();
        OrganizationRESTModel organizationRESTModel = null;
        if (organizationEntity != null) {
          organizationRESTModel = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
        }
        students.add(new fi.otavanopisto.muikku.rest.model.Student(
            studentIdentifier.toId(),
            (String) o.get("firstName"),
            (String) o.get("lastName"),
            (String) o.get("nickName"),
            (String) o.get("studyProgrammeName"),
            (String) o.get("studyProgrammeIdentifier"),
            hasImage,
            (String) o.get("nationality"),
            (String) o.get("language"),
            (String) o.get("municipality"),
            (String) o.get("school"),
            emailAddress,
            studyStartDate,
            studyEndDate,
            studyTimeEnd,
            userEntity.getLastLogin(),
            (String) o.get("curriculumIdentifier"),
            userEntity.getUpdatedByStudent(),
            userEntity.getId(),
            organizationRESTModel,
            false));
      }
    }
    
    SearchResults<List<fi.otavanopisto.muikku.rest.model.Student>> responseStudents = new SearchResults<List<fi.otavanopisto.muikku.rest.model.Student>>(result.getFirstResult(), students, result.getTotalHitCount());
    return Response.ok(responseStudents).build();
  }
  
  @GET
  @Path("/contactPersons")
  @RESTPermit(OrganizationManagementPermissions.ORGANIZATION_VIEW)
  public Response listContactPersons() {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController
        .findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    schoolDataBridgeSessionController.startSystemSession();
    try {
      BridgeResponse<List<OrganizationContactPerson>> response = userSchoolDataController.listOrganizationContactPersons(dataSource, organization.schoolDataIdentifier().getIdentifier());
      if (response.ok()) {
        return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
      }
      else {
        return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
      }
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  private Date getDateResult(Object value) {
    Date date = null;
    if (value instanceof Long) {
      date = new Date((Long) value);
    }
    else if (value instanceof Double) {
      // seconds to ms
      date = new Date(((Double) value).longValue() * 1000);
    }
    return date;
  }

}