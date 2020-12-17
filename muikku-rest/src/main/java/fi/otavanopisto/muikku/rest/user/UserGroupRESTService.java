package fi.otavanopisto.muikku.rest.user;

import java.util.ArrayList;
import java.util.HashMap;
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
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
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
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.rest.AbstractRESTService;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.security.RoleFeatures;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
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
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private Logger logger;

  @GET
  @Path("/groups")
  @RESTPermitUnimplemented
  public Response searchUserGroups(
      @QueryParam("userIdentifier") String userIdentifier,
      @QueryParam("q") String searchString,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

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
      if (sessionController.hasEnvironmentPermission(RoleFeatures.ACCESS_ONLY_GROUP_STUDENTS) && !userGroupEntityController.haveSharedUserGroups(loggedUserEntity, userEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      
      if (!(loggedUserEntity.getId().equals(userEntity.getId()) || sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_USER_USERGROUPS))) {
        return Response.status(Status.FORBIDDEN).build();
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
    } else {
      SearchProvider elasticSearchProvider = getProvider("elastic-search");
      if (elasticSearchProvider != null) {
        List<OrganizationEntity> organizations = organizationEntityController.listLoggedUserOrganizations();
        
        if (CollectionUtils.isNotEmpty(organizations)) {
          SearchResult result = elasticSearchProvider.searchUserGroups(searchString, organizations, firstResult, maxResults);

          List<Map<String, Object>> results = result.getResults();

          if (!results.isEmpty()) {
            for (Map<String, Object> o : results) {
              String[] id = ((String) o.get("id")).split("/", 2);

              UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(
                  id[1], id[0]);
              if (userGroupEntity != null) {
                entities.add(userGroupEntity);
              }
            }
          }
        }
      }
    }

    if (entities.isEmpty()) {
      return Response.noContent().build();
    } else {
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
          }
          ret.add(new fi.otavanopisto.muikku.rest.model.UserGroup(entity.getId(), group.getName(), userCount, organization, group.isGuidanceGroup()));
        }
        else {
          logger.log(Level.WARNING, "Group not found");
        }
      }

      return Response.ok(ret).build();
    }
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
        new fi.otavanopisto.muikku.rest.model.UserGroup(userGroupEntity.getId(), userGroup.getName(), userCount, organization, userGroup.isGuidanceGroup()))
        .build();
  }

  @GET
  @Path("/groups/{ID}/users")
  public Response listGroupUsersByGroup(@PathParam("ID") Long groupId) {
    return null;
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
      
      UserEntityName userName = userEntityController.getName(userSchoolDataIdentifier.getUserEntity());
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
      EnvironmentRoleArchetype role = userSchoolDataIdentifier.getRole().getArchetype();
      
      result.add(new fi.otavanopisto.muikku.rest.model.StaffMember(
          userIdentifier.toId(),
          userEntityId,
          userName.getFirstName(),
          userName.getLastName(), 
          email,
          propertyMap,
          organizationRESTModel,
          role.toString()));
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
