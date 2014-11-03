package fi.muikku.plugins.workspace.rest;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.model.workspace.WorkspaceUserSignup;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.workspace.rest.model.WorkspaceUser;
import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.Subject;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.events.SchoolDataWorkspaceUserDiscoveredEvent;
import fi.muikku.session.SessionController;

@RequestScoped
@Path("/workspace")
@Stateful
@Produces ("application/json")
public class WorkspaceRESTService extends PluginRESTService {

  private static final long serialVersionUID = -5286350366083446537L;

  @Inject
	private WorkspaceController workspaceController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

	@Inject
	private RoleController roleController;

	@Inject
  private CourseMetaController courseMetaController;

  @Inject
  private LocaleController localeController;
	
  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  @Inject
  private Event<SchoolDataWorkspaceUserDiscoveredEvent> schoolDataWorkspaceUserDiscoveredEvent;
	
  @GET
  @Path ("/workspaces/")
  public Response listWorkspaces(@QueryParam ("userId") Long userId, @QueryParam ("search") String searchString, @QueryParam("subjects") List<String> subjects, @QueryParam ("limit") @DefaultValue ("50") Integer limit) {
    List<WorkspaceEntity> unfiltered = null;
    
    if (userId != null) {
      UserEntity userEntity = userEntityController.findUserEntityById(userId);
      if (userEntity == null) {
        return Response.status(Status.BAD_REQUEST).build();
      }
      
      unfiltered = workspaceEntityController.listWorkspaceEntitiesByWorkspaceUser(userEntity);
    } else {
      unfiltered = workspaceController.listWorkspaceEntities();
    }
    
    List<WorkspaceEntity> filtered = null;

    boolean doSearch = StringUtils.isNotEmpty(searchString);
    boolean doSubjectFilter = !subjects.isEmpty();

    if (doSearch || doSubjectFilter) {
      filtered = new ArrayList<>();
      
      if (doSearch) {
        searchString = StringUtils.lowerCase(searchString);
      }
      
      // TODO: Performance could be improved greatly by doing this with search engine
      for (WorkspaceEntity unfilteredEntity : unfiltered) {
        Workspace workspace = workspaceController.findWorkspace(unfilteredEntity);
        
        boolean accepted = true;
        
        if (doSearch) {
          accepted = workspace.getName() != null ? workspace.getName().toLowerCase().contains(searchString) : false;
          if (!accepted)
            accepted = workspace.getDescription() != null ? workspace.getDescription().toLowerCase().contains(searchString) : false; 
        }      
        
        if (doSubjectFilter && accepted) {
          CourseIdentifier courseIdentifier = courseMetaController.findCourseIdentifier(workspace.getSchoolDataSource(), workspace.getCourseIdentifierIdentifier());
          Subject subject = courseMetaController.findSubject(workspace.getSchoolDataSource(), courseIdentifier.getSubjectIdentifier());
          accepted = accepted && subjects.contains(subject.getIdentifier());
        }
          
        if (accepted) {
          filtered.add(unfilteredEntity);
        }
      }
    } else {
      filtered = unfiltered;
    }
    
    while (unfiltered.size() > limit) {
      unfiltered.remove(unfiltered.size() - 1);
    }
    
    List<fi.muikku.plugins.workspace.rest.model.Workspace> result = createRestModel(filtered.toArray(new WorkspaceEntity[0]));
    
    if (result.isEmpty()) {
      return Response.noContent().build();
    }
    
    return Response.ok(result).build();
  }

	@GET
	@Path ("/workspaces/{ID}")
	public Response getWorkspace(@PathParam ("ID") Long workspaceEntityId) {
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
		if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
		
		Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
		return Response.ok(createRestModel(workspaceEntity, workspace)).build();
	}

  @GET
  @Path ("/workspaces/{ID}/users")
  public Response getWorkspaceUsers(@PathParam ("ID") Long workspaceEntityId, @QueryParam ("roleArchtype") String roleArchetype, @QueryParam ("userId") Long userId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    } 
    
    List<WorkspaceUserEntity> workspaceUsers = null;
    List<WorkspaceRoleEntity> workspaceRoles = null;
    
    if (StringUtils.isNotBlank(roleArchetype)) {
      WorkspaceRoleArchetype type = WorkspaceRoleArchetype.valueOf(roleArchetype);
      if (type == null) {
        return Response.status(Status.BAD_REQUEST).build();
      } else {
        workspaceRoles = roleController.listWorkspaceRoleEntitiesByArchetype(type);
      }
    }
    
    if (userId != null) {
      workspaceUsers = new ArrayList<>();
      
      UserEntity userEntity = userEntityController.findUserEntityById(userId);
      if (userEntity == null) {
        return Response.status(Status.BAD_REQUEST).build();
      }
      
      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntitiesByWorkspaceAndUser(workspaceEntity, userEntity);
      for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
        List<Long> workspaceRoleIds = null;
        
        if (workspaceRoles != null) {
          workspaceRoleIds = new ArrayList<>();
          for (WorkspaceRoleEntity workspaceRole : workspaceRoles) {
            workspaceRoleIds.add(workspaceRole.getId());
          }
        }

        if ((workspaceRoleIds == null)||(workspaceRoleIds.contains(workspaceUserEntity.getWorkspaceUserRole().getId()))) {
          workspaceUsers.add(workspaceUserEntity);
        }
      }
    } else {
      if (workspaceRoles != null) {
        workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoles(workspaceEntity, workspaceRoles);
      } else {
        workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntities(workspaceEntity);
      }
    }
    
    if (workspaceUsers.isEmpty()) {
      return Response.noContent().build();
    }
    
    return Response.ok(createRestModel(workspaceUsers.toArray(new WorkspaceUserEntity[0]))).build();
  }
  
  @POST
  @Path ("/workspaces/{ID}/users")
  public Response createWorkspaceUser(@PathParam ("ID") Long workspaceEntityId, fi.muikku.plugins.workspace.rest.model.WorkspaceUser entity) {
    // TODO: Security
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build(); 
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build(); 
    }
    
    User user = userController.findUserByDataSourceAndIdentifier(sessionController.getActiveUserSchoolDataSource(), sessionController.getActiveUserIdentifier());

    if (entity.getRoleId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspace role '" + entity.getRoleId() + "'").build(); 
    }
    
    WorkspaceRoleEntity workspaceRole = roleController.findWorkspaceRoleEntityById(entity.getRoleId());
    if (workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserDataSourceAndUserIdentifier(workspaceEntity, user.getSchoolDataSource(), user.getIdentifier()) != null) {
      return Response.status(Status.BAD_REQUEST).build(); 
    }
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

    Role role = roleController.findRoleByDataSourceAndRoleEntity(user.getSchoolDataSource(), workspaceRole);
    fi.muikku.schooldata.entity.WorkspaceUser workspaceUser = workspaceController.createWorkspaceUser(workspace, user, role);
    UserSchoolDataIdentifier userIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(user.getSchoolDataSource(), user.getIdentifier());
    SchoolDataWorkspaceUserDiscoveredEvent discoverEvent = new SchoolDataWorkspaceUserDiscoveredEvent(workspaceUser.getSchoolDataSource(), workspaceUser.getIdentifier(), workspaceUser.getWorkspaceSchoolDataSource(), workspaceUser.getWorkspaceIdentifier(), workspaceUser.getUserSchoolDataSource(), workspaceUser.getUserIdentifier(), workspaceUser.getRoleSchoolDataSource(), workspaceUser.getRoleIdentifier());
    schoolDataWorkspaceUserDiscoveredEvent.fire(discoverEvent);
    
    // TODO: should this work based on permission? Permission -> Roles -> Recipients
    // TODO: Messaging should be moved into a CDI event listener
    
    WorkspaceRoleEntity teacherRole = roleController.ROLE_WORKSPACE_TEACHER();
    List<WorkspaceUserEntity> workspaceTeachers = workspaceUserEntityController.listWorkspaceUserEntitiesByRole(workspaceEntity, teacherRole);
    List<UserEntity> teachers = new ArrayList<UserEntity>();
    
    String workspaceName = workspace.getName();
    
    String userName = user.getFirstName() + " " + user.getLastName();
    
    for (WorkspaceUserEntity cu : workspaceTeachers) {
      teachers.add(cu.getUserSchoolDataIdentifier().getUserEntity());
    }
    
    for (MessagingWidget messagingWidget : messagingWidgets) {
      String caption = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.caption");
      String content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.content");
      caption = MessageFormat.format(caption, workspaceName);
      content = MessageFormat.format(content, userName, workspaceName);
      // TODO: Category?
      messagingWidget.postMessage(userIdentifier.getUserEntity(), "message", caption, content, teachers);
    }
    
    WorkspaceUser result = new fi.muikku.plugins.workspace.rest.model.WorkspaceUser(discoverEvent.getDiscoveredWorkspaceUserEntityId(), workspaceEntityId, userIdentifier.getUserEntity().getId(), entity.getRoleId(), Boolean.FALSE);
    
    return Response.ok(result).build();
  }

  @POST
  @Path ("/workspaces/{ID}/signups")
  public Response createWorkspaceUserSignup(@PathParam ("ID") Long workspaceEntityId, fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup entity) {
    // TODO: Security
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build(); 
    }
    
    UserEntity userEntity = null;
    
    if (entity.getUserId() != null) {
      userEntity = userEntityController.findUserEntityById(entity.getUserId());
    } else {
      userEntity = sessionController.getLoggedUserEntity();
    }
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build(); 
    }

    WorkspaceUserSignup signup = workspaceController.createWorkspaceUserSignup(workspaceEntity, userEntity, new Date(), entity.getMessage());
    
    return Response.ok(createRestModel(signup)).build();
  }
  
  
  private List<fi.muikku.plugins.workspace.rest.model.Workspace> createRestModel(WorkspaceEntity... workspaceEntities) {
    List<fi.muikku.plugins.workspace.rest.model.Workspace> result = new ArrayList<>();
    
    for (WorkspaceEntity workspaceEntity : workspaceEntities) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace != null) {
        result.add(createRestModel(workspaceEntity, workspace));
      }
    }
    
    return result;
  }
  
  private List<fi.muikku.plugins.workspace.rest.model.WorkspaceUser> createRestModel(WorkspaceUserEntity... entries) {
    List<fi.muikku.plugins.workspace.rest.model.WorkspaceUser> result = new ArrayList<>();
    
    for (WorkspaceUserEntity entry : entries) {
      result.add(createRestModel(entry));
    }
    
    return result;
  }

  private fi.muikku.plugins.workspace.rest.model.WorkspaceUser createRestModel(WorkspaceUserEntity entity) {
    Long workspaceEntityId = entity.getWorkspaceEntity() != null ? entity.getWorkspaceEntity().getId() : null;
    UserEntity userEntity = entity.getUserSchoolDataIdentifier().getUserEntity();
    Long userId = userEntity != null ? userEntity.getId() : null;
    Long roleId = entity.getWorkspaceUserRole() != null ? entity.getWorkspaceUserRole().getId() : null;
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceUser(entity.getId(), workspaceEntityId, userId, roleId, entity.getArchived());
  }

  private fi.muikku.plugins.workspace.rest.model.Workspace createRestModel(WorkspaceEntity workspaceEntity, Workspace workspace) {
    return new fi.muikku.plugins.workspace.rest.model.Workspace(workspaceEntity.getId(), workspaceEntity.getUrlName(), workspaceEntity.getArchived(), workspace.getName(), workspace.getDescription());
  }

  private fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup createRestModel(WorkspaceUserSignup signup) {
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceUserSignup(signup.getId(), signup.getWorkspaceEntity().getId(), signup.getUserEntity().getId(), signup.getDate(), signup.getMessage());
  }

  
//// 
//// Workspace
//// 
//
//@POST
//@Path ("/workspaces/")
//public Response createWorkspace(WorkspaceCompact workspaceData) {
//  if (StringUtils.isNotBlank(workspaceData.getIdentifier())) {
//    return Response.status(Status.BAD_REQUEST).entity("Identifier can not be specified when creating a workspace").build();
//  }
//  
//  if (StringUtils.isBlank(workspaceData.getSchoolDataSource())) {
//    return Response.status(Status.BAD_REQUEST).entity("SchoolDataSource must be defined when creating a workspace").build();
//  }
//
//  if (StringUtils.isBlank(workspaceData.getName())) {
//    return Response.status(Status.BAD_REQUEST).entity("name must be defined when creating a workspace").build();
//  }
//
//  if (StringUtils.isBlank(workspaceData.getWorkspaceTypeId())) {
//    return Response.status(Status.BAD_REQUEST).entity("workspaceTypeId must be defined when creating a workspace").build();
//  }
//
//  if (StringUtils.isBlank(workspaceData.getCourseIdentifierIdentifier())) {
//    return Response.status(Status.BAD_REQUEST).entity("courseIdentifierIdentifier must be defined when creating a workspace").build();
//  }
//
//  // TODO: Incorrect school data source
//  WorkspaceType workspaceType = workspaceController.findWorkspaceTypeByDataSourceAndIdentifier(workspaceData.getSchoolDataSource(), workspaceData.getWorkspaceTypeId());
//  if (workspaceType == null) {
//    return Response.status(Status.BAD_REQUEST).entity("workspace type could not be found").build();
//  }
//  
//  Workspace workspace = workspaceController.createWorkspace(
//      workspaceData.getSchoolDataSource(),
//      workspaceData.getName(),
//      workspaceData.getDescription(),
//      workspaceType,
//      workspaceData.getCourseIdentifierIdentifier());
//  
//  return Response.ok(
//      tranquilityBuilderFactory.createBuilder()
//        .createTranquility()
//        .entity(workspace)
//  ).build();
//}
//

	
//  
//  @PUT
//  @Path ("/workspaces/{WORKSPACE_ENTITY_ID}")
//  public Response updateWorkspace(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId, WorkspaceCompact workspaceData) {
//    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
//    if (workspaceEntity == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
//    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
//    if (workspace == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//
//    if (isChanged(workspaceData.getSchoolDataSource(), workspace.getSchoolDataSource())) {
//      return Response.status(Status.BAD_REQUEST).entity("SchoolDataSource can not be changed").build();
//    }
//
//    if (isChanged(workspaceData.getIdentifier(), workspace.getIdentifier())) {
//      return Response.status(Status.BAD_REQUEST).entity("identifier can not be changed").build();
//    }
//
//    // TODO: CourseIdentifierIdentififer should be updateable
//    if (isChanged(workspaceData.getWorkspaceTypeId(), workspace.getWorkspaceTypeId())) {
//      return Response.status(Status.BAD_REQUEST).entity("courseIdentifierIdentifier can not be changed").build();
//    }
//    
//    // TODO: WorkspaceTypeId should be updateable
//    if (isChanged(workspaceData.getCourseIdentifierIdentifier(), workspace.getCourseIdentifierIdentifier())) {
//      return Response.status(Status.BAD_REQUEST).entity("workspaceTypeId can not be changed").build();
//    }
//
//    workspace.setDescription(workspaceData.getDescription());
//    workspace.setName(workspaceData.getName());
//    workspaceController.updateWorkspace(workspace);
//    
//    return Response.ok(
//      tranquilityBuilderFactory.createBuilder()
//        .createTranquility()
//        .entity(workspace)
//    ).build();
//  }
//
//  @DELETE
//  @Path ("/workspaces/{WORKSPACE_ENTITY_ID}")
//  public Response deleteWorkspace(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId, @QueryParam ("permanently") Boolean permanently) {
//    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
//    if (workspaceEntity == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
//    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
//    if (workspace == null) {
//      return Response.status(Status.NOT_FOUND).build();
//    }
//    
//    if (Boolean.TRUE.equals(permanently)) {
//      workspaceController.deleteWorkspace(workspace);
//    } else {
//      workspaceController.archiveWorkspace(workspace);
//    }
//
//    return Response.noContent().build();
//  }
//  

//  //  
//  //  Materials
//  //
//  
//  @POST
//  @Path ("/materials/")
//  public Response createWorkspaceMaterial(WorkspaceMaterialCompact workspaceMaterial) {
//    if (workspaceMaterial.getId() != null) {
//      return Response.status(Status.BAD_REQUEST).entity("id can not be specified when creating new WorkspaceMaterial").build();
//    }
//    
//    if (workspaceMaterial.getMaterial_id() == null) {
//      return Response.status(Status.BAD_REQUEST).entity("material_id is required when creating new WorkspaceMaterial").build();
//    }
//    
//    if (StringUtils.isBlank(workspaceMaterial.getUrlName())) {
//      return Response.status(Status.BAD_REQUEST).entity("urlName is required when creating new WorkspaceMaterial").build();
//    }
//    
//    WorkspaceNode parent = null;
//    if (workspaceMaterial.getParent_id() != null) {
//      parent = workspaceMaterialController.findWorkspaceNodeById(workspaceMaterial.getParent_id());
//      if (parent == null) {
//        return Response.status(Status.NOT_FOUND).entity("parent not found").build();
//      }
//    }
//    
//    Material material = materialController.findMaterialById(workspaceMaterial.getMaterial_id());
//    if (material == null) {
//      return Response.status(Status.NOT_FOUND).entity("material not found").build();
//    };
//    
//    return Response.ok(
//        tranquilityBuilderFactory.createBuilder()
//          .createTranquility()
//          .entity(workspaceMaterialController.createWorkspaceMaterial(parent, material, workspaceMaterial.getUrlName()))
//    ).build();
//  }
//  
//  @DELETE
//  @Path ("/materials/{ID}")
//  public Response deleteWorkspaceMaterial(@PathParam("ID") Long workspaceMaterialId) {
//    // TODO: Security
//    
//    if (workspaceMaterialId == null) {
//      return Response.status(Status.NOT_FOUND).entity("workspace material not found").build();
//    }
//    
//    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
//    if (workspaceMaterial == null) {
//      return Response.status(Status.NOT_FOUND).entity("workspace material not found").build();
//    }
//    
//    workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial);
//    
//    return Response.noContent().build();
//  }
//  
//  //
//  // Nodes
//  // 
//  
//  @GET
//  @Path ("/nodes/")
//  public Response listWorkspaceMaterials(@QueryParam ("parentId") Long parentId, @QueryParam ("workspaceEntityId") Long workspaceEntityId) {
//    if (parentId != null && workspaceEntityId != null) {
//      return Response.status(Status.BAD_REQUEST).entity("parentId and workspaceEntityId can not both be specified when listing workspace nodes").build();
//    }
//
//    WorkspaceNode parent = null;
//    if (parentId != null) {
//      parent = workspaceMaterialController.findWorkspaceNodeById(parentId);
//      if (parent == null) {
//        return Response.status(Status.NOT_FOUND).entity("parent not found").build();
//      }
//      
//      return Response.ok(
//        tranquilityBuilderFactory.createBuilder()
//          .createTranquility()
//          .entities(workspaceMaterialController.listWorkspaceNodesByParent(parent))
//      ).build();
//    } else if (workspaceEntityId != null) {
//      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
//      if (workspaceEntity == null) {
//        return Response.status(Status.NOT_FOUND).entity("parent not found").build();
//      }
//      
//      return Response.ok(
//        tranquilityBuilderFactory.createBuilder()
//          .createTranquility()
//          .entities(Arrays.asList(workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity)))
//      ).build();
//    } else {
//      return Response.status(Status.BAD_REQUEST).entity("either parentId or workspaceEntityId must be specified when listing workspace nodes").build();
//    }
//  }
//
//  private boolean isChanged(Object object1, Object object2) {
//    if (object1 == null) {
//      return false;
//    }
//    
//    return !object1.equals(object2);
//  }
//  
//  
  
}
