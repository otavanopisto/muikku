package fi.otavanopisto.muikku.plugins.organizationmanagement.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.organizationmanagement.OrganizationManagementPermissions;
import fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model.OrganizationManagerWorkspace;
import fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model.OrganizationManagerWorkspaceTeacher;
import fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model.OrganizationStudentsCreateResponse;
import fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model.OrganizationStudentsCreateResponse.StudentStatus;
import fi.otavanopisto.muikku.plugins.search.UserIndexer;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceEntityFileController;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.RoleController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Role;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityIdFinder;
import fi.otavanopisto.security.rest.RESTPermit;

@Path("/organizationmanagement/workspaces")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class OrganizationManagementWorkspaceRESTService extends PluginRESTService {

  private static final long serialVersionUID = -7027696842893383409L;

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private WorkspaceEntityFileController workspaceEntityFileController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private RoleController roleController;
  
  @Inject
  private UserIndexer userIndexer;
  
  @Inject
  private WorkspaceUserEntityIdFinder workspaceUserEntityIdFinder;
  
  @Inject
  private OrganizationEntityController organizationEntityController;

  @Inject
  private Instance<SearchProvider> searchProviderInstance;
  
  @GET
  @Path("/")
  @RESTPermit(OrganizationManagementPermissions.ORGANIZATION_MANAGE_WORKSPACES)
  public Response listWorkspaces(
        @QueryParam("q") String searchString,
        @QueryParam("subjects") List<String> subjects,
        @QueryParam("educationTypes") List<String> educationTypeIds,
        @QueryParam("curriculums") List<String> curriculumIds,
        @QueryParam("includeUnpublished") @DefaultValue ("false") Boolean includeUnpublished,
        @QueryParam("templates") @DefaultValue ("ONLY_WORKSPACES") TemplateRestriction templateRestriction,
        @QueryParam("orderBy") List<String> orderBy,
        @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult,
        @QueryParam("maxResults") @DefaultValue ("50") Integer maxResults,
        @Context Request request) {
    
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    String schoolDataSourceFilter = null;
    List<String> workspaceIdentifierFilters = null;
    
    SearchProvider searchProvider = searchProviderInstance.get();
    if (searchProvider == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    SearchResult searchResult = null;
    
    templateRestriction = templateRestriction != null ? templateRestriction : TemplateRestriction.ONLY_WORKSPACES;
    if (templateRestriction != TemplateRestriction.ONLY_WORKSPACES) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_WORKSPACE_TEMPLATES)) {
        return Response.status(Status.FORBIDDEN).entity("You have no permission to list workspace templates.").build();
      }
    }
    
    List<WorkspaceAccess> accesses = new ArrayList<>(Arrays.asList(WorkspaceAccess.ANYONE));
    if (sessionController.isLoggedIn()) {
      accesses.add(WorkspaceAccess.LOGGED_IN);
      accesses.add(WorkspaceAccess.MEMBERS_ONLY);
    }

    List<Sort> sorts = null;
    
    if (orderBy != null && orderBy.contains("alphabet")) {
      sorts = new ArrayList<>();
      sorts.add(new Sort("name.untouched", Sort.Order.ASC));
    }
    
    List<SchoolDataIdentifier> educationTypes = null;
    if (educationTypeIds != null) {
      educationTypes = new ArrayList<>(educationTypeIds.size());
      for (String educationTypeId : educationTypeIds) {
        SchoolDataIdentifier educationTypeIdentifier = SchoolDataIdentifier.fromId(educationTypeId);
        if (educationTypeIdentifier != null) {
          educationTypes.add(educationTypeIdentifier);
        } else {
          return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed education type identifier", educationTypeId)).build();
        }
      }
    }
    
    List<SchoolDataIdentifier> curriculumIdentifiers = null;
    if (curriculumIds != null) {
      curriculumIdentifiers = new ArrayList<>(curriculumIds.size());
      for (String curriculumId : curriculumIds) {
        SchoolDataIdentifier curriculumIdentifier = SchoolDataIdentifier.fromId(curriculumId);
        if (curriculumIdentifier != null) {
          curriculumIdentifiers.add(curriculumIdentifier);
        } else {
          return Response.status(Status.BAD_REQUEST).entity(String.format("Malformed curriculum identifier", curriculumId)).build();
        }
      }
    }

    // Restrict search to the organizations of the user
    List<SchoolDataIdentifier> organizationIdentifiers = new ArrayList<>();
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(loggedUser);
    if (userSchoolDataIdentifier != null && userSchoolDataIdentifier.getOrganization() != null) {
      organizationIdentifiers.add(userSchoolDataIdentifier.getOrganization().schoolDataIdentifier());
    }
    
    searchResult = searchProvider.searchWorkspaces()
        .setSchoolDataSource(schoolDataSourceFilter)
        .setSubjects(subjects)
        .setWorkspaceIdentifiers(workspaceIdentifierFilters)
        .setEducationTypeIdentifiers(educationTypes)
        .setCurriculumIdentifiers(curriculumIdentifiers)
        .setOrganizationIdentifiers(organizationIdentifiers)
        .setFreeText(searchString)
        .setAccesses(accesses)
        .setAccessUser(loggedUser)
        .setIncludeUnpublished(includeUnpublished)
        .setTemplateRestriction(templateRestriction)
        .setFirstResult(firstResult)
        .setMaxResults(maxResults)
        .setSorts(sorts)
        .search();
    
    List<OrganizationManagerWorkspace> workspaces = new ArrayList<>();
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
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
              String description = (String) result.get("description");
              String educationTypeId = (String) result.get("educationTypeIdentifier");
              String educationTypeName = null;
              
              if (StringUtils.isNotBlank(educationTypeId)) {
                EducationType educationType = null;
                SchoolDataIdentifier educationTypeIdentifier = SchoolDataIdentifier.fromId(educationTypeId);
                if (educationTypeIdentifier == null) {
                  logger.severe(String.format("Malformed educationTypeIdentifier %s", educationTypeId));
                } else {
                  educationType = courseMetaController.findEducationType(educationTypeIdentifier.getDataSource(), educationTypeIdentifier.getIdentifier());
                }
                
                if (educationType != null) {
                  educationTypeName = educationType.getName();
                }
              }

              if (StringUtils.isNotBlank(name)) {
                workspaces.add(createRestModel(workspaceEntity, name, nameExtension, description, educationTypeName));
              } else {
                logger.severe(String.format("Search index contains workspace %s that does not have a name", workspaceIdentifier));
              }
            } else {
              logger.severe(String.format("Search index contains workspace %s that does not exist on the school data system", workspaceIdentifier));
            }
          }
        }
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

    return Response.ok(workspaces).build();
  }
  
  @POST
  @Path("/{WORKSPACEID}/students")
  @RESTPermit(OrganizationManagementPermissions.ORGANIZATION_MANAGE_WORKSPACES)
  public Response createWorkspaceStudent(@PathParam("WORKSPACEID") Long workspaceEntityId, 
      StudentIdentifiers studentIdentifiersContainer) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    List<OrganizationEntity> loggedUserOrganizations = organizationEntityController.listLoggedUserOrganizations();
    Set<SchoolDataIdentifier> loggedUserOrganizationIdentifiers = loggedUserOrganizations.stream()
        .map(organization -> organization.schoolDataIdentifier())
        .collect(Collectors.toSet());

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    SchoolDataIdentifier workspaceOrganizationIdentifier = workspace.getOrganizationIdentifier();
    WorkspaceRoleEntity workspaceRole = roleController.getWorkspaceStudentRole();
    Role role = roleController.findRoleByDataSourceAndRoleEntity(workspaceEntity.getDataSource().getIdentifier(), workspaceRole);
    
    // Validate given student identifiers
    
    Set<SchoolDataIdentifier> studentIdentifiers = new HashSet<>();
    for (String studentIdentifierStr : studentIdentifiersContainer.getStudentIdentifiers()) {
      SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
      if (studentIdentifier != null) {
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
        SchoolDataIdentifier userOrganizationIdentifier = userSchoolDataIdentifier.getOrganization() != null ? userSchoolDataIdentifier.getOrganization().schoolDataIdentifier() : null;
        
        if (!workspaceOrganizationIdentifier.equals(userOrganizationIdentifier)) {
          return Response.status(Status.NOT_FOUND).entity("No student found with identifier " + studentIdentifierStr).build();
        }
        
        studentIdentifiers.add(studentIdentifier);
      } else {
        return Response.status(Status.BAD_REQUEST).entity("Malformed identifier").build();
      }
    }
    
    // Validate group identifiers

    Set<UserGroupEntity> userGroupEntities = new HashSet<>();
    if (CollectionUtils.isNotEmpty(studentIdentifiersContainer.getStudentGroupIds())) {
      for (Long studentGroupId : studentIdentifiersContainer.getStudentGroupIds()) {
        UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(studentGroupId);
        UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);
        
        if (userGroupEntity == null || userGroup == null || !loggedUserOrganizationIdentifiers.contains(userGroup.getOrganizationIdentifier())) {
          return Response.status(Status.NOT_FOUND).entity("No user group was found with id " + studentGroupId).build();
        }
        
        userGroupEntities.add(userGroupEntity);
      }
    }
    
    OrganizationStudentsCreateResponse response = new OrganizationStudentsCreateResponse();
    
    for (SchoolDataIdentifier userIdentifier : studentIdentifiers) {
      User user = userController.findUserByIdentifier(userIdentifier);
      OrganizationStudentsCreateResponse.StudentStatus status = addUserToWorkspace(user, workspaceEntity, workspace, role);
      
      response.createStudentIdentifier(userIdentifier.toId(), status);
    }
    
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      List<UserGroupUserEntity> userGroupUserEntities = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroupEntity);
      
      Set<SchoolDataIdentifier> filteredStudentIdentifiers = userGroupUserEntities.stream()
        .filter(userGroupUserEntity -> Boolean.FALSE.equals(userGroupUserEntity.getArchived()))
        .filter(userGroupUserEntity -> userGroupUserEntity.getUserSchoolDataIdentifier() != null)
        .filter(userGroupUserEntity -> userGroupUserEntity.getUserSchoolDataIdentifier().getRole() != null)
        .filter(userGroupUserEntity -> userGroupUserEntity.getUserSchoolDataIdentifier().getRole().getArchetype() == EnvironmentRoleArchetype.STUDENT)
        .map(userGroupUserEntity -> userGroupUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier())
        .collect(Collectors.toSet());
        
      OrganizationStudentsCreateResponse.StudentGroupId userGroupResponse = response.createUserGroupIdentifier(userGroupEntity.getId());

      for (SchoolDataIdentifier userIdentifier : filteredStudentIdentifiers) {
        User user = userController.findUserByIdentifier(userIdentifier);
        StudentStatus status = addUserToWorkspace(user, workspaceEntity, workspace, role);
        
        userGroupResponse.addStudentIdentifier(userIdentifier.toId(), status);
      }
    }
    
    return Response.ok(response).build();
  }

  @POST
  @Path("/{WORKSPACEID}/staff")
  @RESTPermit(OrganizationManagementPermissions.ORGANIZATION_MANAGE_WORKSPACES)
  public Response createWorkspaceStaffMembers(@PathParam("WORKSPACEID") Long workspaceEntityId, 
      StaffMemberIdentifiers staffMemberIdentifiersContainer) {

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    List<String> staffMemberIdentifiers = staffMemberIdentifiersContainer.getStaffMemberIdentifiers();
    
    if (CollectionUtils.isNotEmpty(staffMemberIdentifiers)) {
      Set<SchoolDataIdentifier> collect = staffMemberIdentifiers.stream()
          .map(staffMemberIdentifierStr -> SchoolDataIdentifier.fromId(staffMemberIdentifierStr))
          .collect(Collectors.toSet());

      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

      WorkspaceRoleEntity workspaceRole = roleController.getWorkspaceRoleByArchetype(WorkspaceRoleArchetype.TEACHER);
      Role role = roleController.findRoleByDataSourceAndRoleEntity(workspaceEntity.getDataSource().getIdentifier(), workspaceRole);
      
      for (SchoolDataIdentifier userIdentifier : collect) {
        User user = userController.findUserByIdentifier(userIdentifier);
        addUserToWorkspace(user, workspaceEntity, workspace, role);
      }
    }
    
    return Response.noContent().build();
  }

  private StudentStatus addUserToWorkspace(User user, WorkspaceEntity workspaceEntity, Workspace workspace, Role role) {
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource());
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifierIncludeArchived(workspaceEntity, userIdentifier);
    if (workspaceUserEntity != null && Boolean.TRUE.equals(workspaceUserEntity.getArchived())) {
      workspaceUserEntityController.unarchiveWorkspaceUserEntity(workspaceUserEntity);
    }
    if (workspaceUserEntity != null && Boolean.FALSE.equals(workspaceUserEntity.getActive())) {
      workspaceUserEntityController.updateActive(workspaceUserEntity, Boolean.TRUE);
      userIndexer.indexUser(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity());
    }
    
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceUser = workspaceController.findWorkspaceUserByWorkspaceAndUser(workspaceEntity.schoolDataIdentifier(), userIdentifier);
    if (workspaceUser == null) {
      workspaceUser = workspaceController.createWorkspaceUser(workspace, user, role);
      return waitForWorkspaceUserEntity(workspaceEntity, userIdentifier) ? StudentStatus.OK : StudentStatus.FAILED;
    }
    else {
      workspaceController.updateWorkspaceStudentActivity(workspaceUser, true);
      return StudentStatus.ALREADYEXISTS;
    }
  }

  private OrganizationManagerWorkspace createRestModel(WorkspaceEntity workspaceEntity, String name, String nameExtension, String description, String educationTypeName) {
    boolean hasCustomImage = workspaceEntityFileController.getHasCustomImage(workspaceEntity);
    long studentCount = workspaceUserEntityController.countWorkspaceStudents(workspaceEntity);
    
    List<WorkspaceUserEntity> workspaceStaffMembers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
    List<OrganizationManagerWorkspaceTeacher> teacherRestModels = workspaceStaffMembers.stream()
        .map(workspaceStaffMember -> teacherRestModel(workspaceStaffMember))
        .collect(Collectors.toList());
    
    OrganizationRESTModel organization = null;
    if (workspaceEntity.getOrganizationEntity() != null) {
      OrganizationEntity organizationEntity = workspaceEntity.getOrganizationEntity();
      organization = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
    }
    return new OrganizationManagerWorkspace(
        workspaceEntity.getId(), 
        workspaceEntity.getUrlName(),
        workspaceEntity.getArchived(), 
        workspaceEntity.getPublished(), 
        name, 
        nameExtension, 
        description, 
        educationTypeName,
        hasCustomImage,
        organization,
        studentCount,
        teacherRestModels
    );
  }

  private OrganizationManagerWorkspaceTeacher teacherRestModel(WorkspaceUserEntity workspaceStaffMember) {
    User user = userController.findUserByIdentifier(workspaceStaffMember.getUserSchoolDataIdentifier().schoolDataIdentifier());
    return new OrganizationManagerWorkspaceTeacher(user.getFirstName(), user.getLastName());
  }
  
  /**
   * TODO Refactor - the same is used in course picker
   * @return 
   */
  private boolean waitForWorkspaceUserEntity(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    Long workspaceUserEntityId = null;
    long timeoutTime = System.currentTimeMillis() + 10000;    
    while (workspaceUserEntityId == null) {
      workspaceUserEntityId = workspaceUserEntityIdFinder.findWorkspaceUserEntityId(workspaceEntity, userIdentifier);
      if (workspaceUserEntityId != null || System.currentTimeMillis() > timeoutTime) {
        return true;
      }
      if (System.currentTimeMillis() > timeoutTime) {
        return false;
      }
      try {
        Thread.sleep(100);
      }
      catch (InterruptedException e) {
      }
    }
    return workspaceUserEntityId != null;
  }

}
