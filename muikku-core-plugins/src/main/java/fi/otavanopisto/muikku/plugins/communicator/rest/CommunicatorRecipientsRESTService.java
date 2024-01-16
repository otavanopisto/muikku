package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorPermissionCollection;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceBasicInfo;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.security.RoleFeatures;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/communicator")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class CommunicatorRecipientsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 4522150023024829380L;

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @GET
  @Path("/recipientsUsersSearch") // TODO mApi requires ids between all resources - this should be /recipients/users/search
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response searchUsers(
      @QueryParam("q") String searchString,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults
    ) {
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    
    if (userSchoolDataIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    Set<Long> userGroupFilters = null;
    Set<Long> workspaceFilters = null;
    Set<EnvironmentRoleArchetype> roleArchetypeFilter = new HashSet<>();
    
    if (userSchoolDataIdentifier.hasAnyRole(EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.STUDENT_PARENT)) {
      // Stuff students and their guardians can seach for
      roleArchetypeFilter.add(EnvironmentRoleArchetype.ADMINISTRATOR);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.MANAGER);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.TEACHER);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.STUDY_GUIDER);
    } else if (userSchoolDataIdentifier.isStaff()) {
      // Default for other roles
      
      roleArchetypeFilter.add(EnvironmentRoleArchetype.ADMINISTRATOR);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.MANAGER);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.TEACHER);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.STUDY_GUIDER);
      roleArchetypeFilter.add(EnvironmentRoleArchetype.STUDENT);
      
      if (sessionController.hasEnvironmentPermission(RoleFeatures.ACCESS_ONLY_GROUP_STUDENTS)) {
        // Study guider limitations - groups where user is a member
        List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(sessionController.getLoggedUser());
        userGroupFilters = userGroups.stream().map(userGroup -> userGroup.getId()).collect(Collectors.toSet());
      }
    } else {
      return Response.ok(Collections.EMPTY_LIST).build();
    }

    SearchProvider searchProvider = getSearchProvider();
    if (searchProvider != null) {
      String[] fields = new String[] { "firstName", "lastName", "nickName", "email" };

      Boolean onlyDefaultUsers = true;
      List<OrganizationEntity> organizations = organizationEntityController.listLoggedUserOrganizations();

      SearchResult result = searchProvider.searchUsers(
          organizations,
          null, // study programme identifiers
          searchString, 
          fields, 
          roleArchetypeFilter, 
          userGroupFilters, 
          workspaceFilters, 
          null, 
          false,
          false,
          onlyDefaultUsers,
          firstResult, 
          maxResults,
          false);
      
      List<Map<String, Object>> results = result.getResults();

      List<fi.otavanopisto.muikku.rest.model.User> ret = new ArrayList<fi.otavanopisto.muikku.rest.model.User>();

      for (Map<String, Object> o : results) {
        Long userEntityId = Long.valueOf(o.get("userEntityId").toString());
        UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
        
        if (userEntity != null) {
          boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);
          String emailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, true);
          Date studyStartDate = getDateResult(o.get("studyStartDate"));
          Date studyTimeEnd = getDateResult(o.get("studyTimeEnd"));
          ret.add(new fi.otavanopisto.muikku.rest.model.User(
            userEntity.getId(), 
            (String) o.get("firstName"),
            (String) o.get("lastName"), 
            (String) o.get("nickName"), 
            (String) o.get("studyProgrammeName"), 
            hasImage,
            (String) o.get("nationality"),
            (String) o.get("language"), 
            (String) o.get("municipality"), 
            (String) o.get("school"), 
            emailAddress,
            studyStartDate,
            studyTimeEnd));
        } else {
          logger.warning(String.format("UserEntity not found by id %s", userEntityId));
        }
      }

      return Response.ok(ret).build();
    }

    return Response.status(Status.INTERNAL_SERVER_ERROR).build();
  }

  @GET
  @Path("/recipientsWorkspacesSearch") // TODO mApi requires ids between all resources - this should be /recipients/workspaces/search
  @RESTPermitUnimplemented
  public Response listWorkspaces(
        @QueryParam("q") String searchString,
        @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
        @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {

    List<WorkspaceBasicInfo> workspaces = new ArrayList<>();

    List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(sessionController.getLoggedUserEntity());
    // Remove workspaces where the user doesn't have permission to send messages for 
    workspaceEntities.removeIf(workspaceEntity -> !sessionController.hasWorkspacePermission(CommunicatorPermissionCollection.COMMUNICATOR_WORKSPACE_MESSAGING, workspaceEntity));

    if (workspaceEntities.isEmpty()) {
      return Response.ok(Collections.EMPTY_LIST).build();
    }
    
    SearchProvider searchProvider = getSearchProvider();
    if (searchProvider != null) {
      SearchResult searchResult = null;
      
      List<SchoolDataIdentifier> workspaceIdentifierFilters = new ArrayList<>();
      
      for (WorkspaceEntity workspaceEntity : workspaceEntities) {
        workspaceIdentifierFilters.add(workspaceEntity.schoolDataIdentifier());
      }

      List<SchoolDataIdentifier> subjects = null;
      List<SchoolDataIdentifier> educationTypes = null;
      List<SchoolDataIdentifier> curriculumIdentifiers = null;
      List<WorkspaceAccess> accesses = null;
      PublicityRestriction publicityRestriction = PublicityRestriction.ONLY_PUBLISHED;
      List<Sort> sorts = null;
      
      List<OrganizationEntity> organizations = organizationEntityController.listLoggedUserOrganizations();
      TemplateRestriction templateRestriction = TemplateRestriction.ONLY_WORKSPACES;
      
      List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(organizations , publicityRestriction, templateRestriction);
      
      searchResult = searchProvider.searchWorkspaces(subjects, workspaceIdentifierFilters, educationTypes,
          curriculumIdentifiers, organizationRestrictions, searchString, accesses, sessionController.getLoggedUser(), firstResult, maxResults, sorts);
      
      List<Map<String, Object>> results = searchResult.getResults();
      for (Map<String, Object> result : results) {
        String searchId = (String) result.get("id");
        if (StringUtils.isNotBlank(searchId)) {
          String[] id = searchId.split("/", 2);
          if (id.length == 2) {
            String dataSource = id[1];
            String identifier = id[0];

            SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(identifier, dataSource);
            
            WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(workspaceIdentifier.getDataSource(), workspaceIdentifier.getIdentifier());
            if (workspaceEntity != null) {
              String name = (String) result.get("name");
              String nameExtension = (String) result.get("nameExtension");

              if (StringUtils.isNotBlank(name)) {
                workspaces.add(new WorkspaceBasicInfo(
                    workspaceEntity.getId(), 
                    workspaceEntity.getUrlName(), 
                    name, 
                    nameExtension));
              } else {
                logger.severe(String.format("Search index contains workspace %s that does not have a name", workspaceIdentifier));
              }
            } else {
              logger.severe(String.format("Search index contains workspace %s that does not exits on the school data system", workspaceIdentifier));
            }
          }
        }
      }
    } else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    return Response.ok(workspaces).build();
  }

  private SearchProvider getSearchProvider() {
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      return searchProviderIterator.next();
    } else {
      return null;
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
