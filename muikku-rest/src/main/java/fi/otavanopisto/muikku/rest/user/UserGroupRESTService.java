package fi.otavanopisto.muikku.rest.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.rest.AbstractRESTService;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupMembersPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupPayload;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.security.RoleFeatures;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@RequestScoped
@Path("/usergroup")
@Produces("application/json")
public class UserGroupRESTService extends AbstractRESTService {

  @Inject
  private SessionController sessionController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private UserGroupController userGroupController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private Logger logger;
  
  /**
   * POST mApi().usergroup.groups
   * 
   * Creates a new student group.
   * 
   * Payload:
   * {name: required; group name
   *  isGuidanceGroup: required; is the group a guidance group; true|false}
   * 
   * Output:
   * {identifier: group id in Muikku
   *  name: group name
   *  isGuidanceGroup: is the group a guidance group; true|false}
   */
  @POST
  @Path("/groups")
  @RESTPermit(MuikkuPermissions.CREATE_STUDENT_GROUP)
  public Response createStudentGroup(StudentGroupPayload payload) {

    // Payload validation
    
    if (StringUtils.isBlank(payload.getName()) || payload.getIsGuidanceGroup() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid payload").build();
    }

    // User group creation
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<StudentGroupPayload> response = userGroupController.createStudentGroup(dataSource, payload);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * PUT mApi().usergroup.groups
   * 
   * Updates an existing student group.
   * 
   * Payload:
   * {identifier: required; group id in Muikku
   *  name: required; group name
   *  isGuidanceGroup: required; is the group a guidance group; true|false}
   * 
   * Output:
   * {identifier: group id in Muikku
   *  name: group name
   *  isGuidanceGroup: is the group a guidance group; true|false}
   */
  @PUT
  @Path("/groups")
  @RESTPermit(MuikkuPermissions.UPDATE_STUDENT_GROUP)
  public Response updateStudentGroup(StudentGroupPayload payload) {

    // Payload validation
    
    if (StringUtils.isAnyBlank(payload.getIdentifier(), payload.getName()) || payload.getIsGuidanceGroup() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid payload").build();
    }

    // User group creation
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<StudentGroupPayload> response = userGroupController.updateStudentGroup(dataSource, payload);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * DELETE mApi().usergroup.groups
   * 
   * Archives a student group.
   * 
   * Path parameter:
   * id   group id in Muikku
   * 
   * Output:
   * 204
   */
  @DELETE
  @Path("/groups/{ID:[0-9]*}")
  @RESTPermit(MuikkuPermissions.ARCHIVE_STUDENT_GROUP)
  public Response archiveStudentGroup(@PathParam("ID") Long id) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(id);
    if (userGroupEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    else {
      userGroupController.archiveStudentGroup(dataSource, userGroupEntity.getIdentifier());
      return Response.status(Status.NO_CONTENT).build();
    }
  }

  /**
   * GET mApi().usergroup.groups
   * 
   * Search endpoint for user groups and/or study programmes.
   * 
   * Query parameters:
   * userIdentifier   if searching groups of a single user, their identifier (e.g. PYRAMUS-STUDENT-123) 
   * q                search string to filter results based on the group or study programme name
   * archetype        USERGROUP|STUDYPROGRAMME to return only user groups or only study programmes. If omitted, returns both.
   * firstResult      index of the first result, defaults to 0
   * maxResults       maximum number of results to return, defaults to 10
   * 
   * Output:
   * [
   *   {"id":9,                       group id in Muikku
   *    "name":"Group name",          group name
   *    "userCount":123,"             group user count
   *    organization":{               organization the group belongs to (fairly irrelevant for front-end)
   *      "id":123,"
   *      name":"Organization name"
   *    },
   *    "isGuidanceGroup":false},     is the group a guidance group
   *    ...                           repeated for as may results there are
   *  ]
   */
  @GET
  @Path("/groups")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response searchUserGroups(
      @QueryParam("userIdentifier") String userIdentifier,
      @QueryParam("q") String searchString,
      @QueryParam("archetype") String archetype,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults) {

    List<UserGroupEntity> entities = new ArrayList<>();

    if (userIdentifier != null) {
      SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(userIdentifier);
      
      if (identifier == null) {
        Response.status(Status.BAD_REQUEST).entity("Malformed userIdentifier").build();
      }

      SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
      UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(identifier);      

      if (userEntity == null) {
        return Response.status(Status.NOT_FOUND).build();
      }

      // Check for group-user-only roles - no shared groups, no rights
      if (!loggedUserEntity.getId().equals(userEntity.getId())) {
        if (sessionController.hasEnvironmentPermission(RoleFeatures.ACCESS_ONLY_GROUP_STUDENTS) && !userGroupEntityController.haveSharedUserGroups(loggedUserEntity, userEntity)) {
          return Response.status(Status.FORBIDDEN).build();
        }
        if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_USER_USERGROUPS)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
      
      if (identifier != null) {
        entities = userGroupEntityController.listUserGroupsByUserIdentifier(identifier);
        
        // For someone with the role feature the group entities are not necessarily accessible
        if (sessionController.hasEnvironmentPermission(RoleFeatures.ACCESS_ONLY_GROUP_STUDENTS)) {
          List<UserGroupEntity> guiderGroups = userGroupEntityController.listUserGroupsByUserIdentifier(loggedUser);
          Set<Long> guiderGroupIds = guiderGroups.stream().map(UserGroupEntity::getId).collect(Collectors.toSet());
          entities = entities.stream().filter((UserGroupEntity uge) -> guiderGroupIds.contains(uge.getId())).collect(Collectors.toList());
        }
      }
    }
    else {
      SearchProvider elasticSearchProvider = getProvider("elastic-search");
      if (elasticSearchProvider != null) {
        List<OrganizationEntity> organizations = organizationEntityController.listLoggedUserOrganizations();
        
        if (CollectionUtils.isNotEmpty(organizations)) {
          SearchResult result = elasticSearchProvider.searchUserGroups(searchString, archetype, organizations, firstResult, maxResults);

          List<Map<String, Object>> results = result.getResults();

          if (!results.isEmpty()) {
            for (Map<String, Object> o : results) {
              String[] id = ((String) o.get("id")).split("/", 2);

              UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(id[1], id[0]);
              if (userGroupEntity != null) {
                entities.add(userGroupEntity);
              }
            }
          }
        }
      }
    }

    List<fi.otavanopisto.muikku.rest.model.UserGroup> ret = new ArrayList<fi.otavanopisto.muikku.rest.model.UserGroup>();

    for (UserGroupEntity entity : entities) {
      Long userCount = userGroupEntityController.getGroupUserCount(entity);
      UserGroup group = userGroupController.findUserGroup(entity);
      if (group != null) {
        OrganizationRESTModel organization = null;
        if (group.getOrganizationIdentifier() != null) {
          OrganizationEntity organizationEntity = organizationEntityController.findBy(group.getOrganizationIdentifier());
          if (organizationEntity != null) {
            organization = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
          }
          ret.add(new fi.otavanopisto.muikku.rest.model.UserGroup(
              entity.getId(),
              group.getName(),
              userCount,
              organization,
              group.getIsGuidanceGroup()));
        } 
        else {
          logger.log(Level.WARNING, "Group not found");
        }
      }
      else {
        logger.log(Level.WARNING, "Group not found");
      }
    }

    return Response.ok(ret).build();
  }

  @GET
  @Path("/groups/{ID}")
  @RESTPermitUnimplemented
  public Response findById(@PathParam("ID") Long groupId) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(groupId);

    // #5170: Proper (quiet) handling for archived user groups
    if (userGroupEntity == null || Boolean.TRUE.equals(userGroupEntity.getArchived())) {
      return Response.status(Status.NOT_FOUND).build();
    }

    UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);
    if (userGroup == null) {
      logger.warning(String.format("UserGroupEntity %d without UserGroup", userGroupEntity.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }

    Long userCount = userGroupEntityController.getGroupUserCount(userGroupEntity);

    OrganizationRESTModel organization = null;
    if (userGroup.getOrganizationIdentifier() != null) {
      OrganizationEntity organizationEntity = organizationEntityController.findBy(userGroup.getOrganizationIdentifier());
      if (organizationEntity != null) {
        organization = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
      }
    }
    return Response.ok(
        new fi.otavanopisto.muikku.rest.model.UserGroup(
            userGroupEntity.getId(),
            userGroup.getName(),
            userCount,
            organization,
            userGroup.getIsGuidanceGroup())).build();
  }
  
  /**
   * PUT mApi().usergroup.addusers
   *
   * Adds users to a student group.
   *
   * Payload:
   * {groupIdentifier: required; group id in Muikku
   *  userIdentifiers: required; array of user identifiers to add to the group
   *                   e.g. [PYRAMUS-STUDENT-123,PYRAMUS-STAFF-124]}
   *
   * Output:
   * 204
   */
  @PUT
  @Path("/addusers")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response addUsersToStudentGroup(StudentGroupMembersPayload payload) {

    // Payload validation
    
    if (StringUtils.isBlank(payload.getGroupIdentifier()) || payload.getUserIdentifiers() == null || payload.getUserIdentifiers().length == 0) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid payload").build();
    }

    // Add student group members
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<StudentGroupMembersPayload> response = userGroupController.addStudentGroupMembers(dataSource, payload);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * PUT mApi().usergroup.removeusers
   *
   * Removes users from a student group.
   *
   * Payload:
   * {groupIdentifier: required; group id in Muikku
   *  userIdentifiers: required; array of user identifiers to remove from the group
   *                   e.g. [PYRAMUS-STUDENT-123,PYRAMUS-STAFF-124]}
   *
   * Output:
   * 204
   */
  @PUT
  @Path("/removeusers")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response removeUsersFromStudentGroup(StudentGroupMembersPayload payload) {

    // Payload validation
    
    if (StringUtils.isBlank(payload.getGroupIdentifier()) || payload.getUserIdentifiers() == null || payload.getUserIdentifiers().length == 0) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid payload").build();
    }

    // Remove student group members
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<StudentGroupMembersPayload> response = userGroupController.removeStudentGroupMembers(dataSource, payload);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  @GET
  @Path("/groups/{ID}/staffMembers")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listGroupStaffMembersByGroup(@PathParam("ID") Long groupId, @QueryParam("properties") String properties) {
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(groupId);
    
    if (userGroupEntity == null || Boolean.TRUE.equals(userGroupEntity.getArchived())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_USERGROUP_STAFFMEMBERS)) {
      if (!userGroupEntityController.isMember(loggedUser, userGroupEntity)) {
        return Response.status(Status.NOT_FOUND).build();
      }
    }
    
    List<UserGroupUserEntity> userGroupUserEntities = userGroupEntityController.listUserGroupStaffMembers(userGroupEntity);
    
    String[] propertyArray = StringUtils.isEmpty(properties) ? new String[0] : properties.split(",");
    
    List<fi.otavanopisto.muikku.rest.model.StaffMember> result = new ArrayList<>();
    
    for (UserGroupUserEntity userGroupUserEntity : userGroupUserEntities) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userGroupUserEntity.getUserSchoolDataIdentifier();
      SchoolDataIdentifier userIdentifier = userSchoolDataIdentifier.schoolDataIdentifier();
      Long userEntityId = userSchoolDataIdentifier.getUserEntity().getId();
      UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);

      UserEntityName userName = userEntityController.getName(userSchoolDataIdentifier.getUserEntity(), true);
      String email = userEmailEntityController.getUserDefaultEmailAddress(userIdentifier, false);
      
      Map<String, String> propertyMap = new HashMap<String, String>();
      for (int i = 0; i < propertyArray.length; i++) {
        UserEntityProperty userEntityProperty = userEntityController.getUserEntityPropertyByKey(userSchoolDataIdentifier.getUserEntity(), propertyArray[i]);
        propertyMap.put(propertyArray[i], userEntityProperty == null ? null : userEntityProperty.getValue());
      }
      
      OrganizationEntity organizationEntity = userSchoolDataIdentifier.getOrganization();
      OrganizationRESTModel organizationRESTModel = null;
      if (organizationEntity != null) {
        organizationRESTModel = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
      }
      Set<String> roles = new HashSet<>();
      if (userSchoolDataIdentifier.getRoles() != null) {
        userSchoolDataIdentifier.getRoles().stream().map(roleEntity -> roleEntity.getArchetype().toString()).collect(Collectors.toList());
      }
      boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);
      result.add(new fi.otavanopisto.muikku.rest.model.StaffMember(
          userIdentifier.toId(),
          userEntityId,
          userName.getFirstName(),
          userName.getLastName(), 
          email,
          propertyMap,
          organizationRESTModel,
          roles,
          hasImage));
    }
    
    return Response.ok(result).build();
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

}
