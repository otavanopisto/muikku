package fi.muikku.atests;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.muikku.search.SearchIndexer;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/test")
@Stateful
@Produces("application/json")
@Consumes("application/json")
public class AcceptanceTestsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 4192161644908642797L;

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController; 
  
  @Inject
  private SearchIndexer indexer;
   
  @Inject
  private PyramusUpdater pyramusUpdater;
  
  @Inject
  private HtmlMaterialController htmlMaterialController; 

  @Inject
  private WorkspaceMaterialController workspaceMaterialController; 

  @Inject
  private WorkspaceRolePermissionDAO workspaceRolePermissionDAO;
  
  @Inject
  private Event<SchoolDataWorkspaceDiscoveredEvent> schoolDataWorkspaceDiscoveredEvent;

  @GET
  @Path("/login")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_login(@QueryParam ("role") String role) {
    switch (role) {
      case "ENVIRONMENT-STUDENT":
        localSessionController.login("PYRAMUS", "STUDENT-1");
      break;
      case "ENVIRONMENT-TEACHER":
        localSessionController.login("PYRAMUS", "STAFF-2");
      break;
      case "ENVIRONMENT-MANAGER":
        localSessionController.login("PYRAMUS", "STAFF-3");
      break;
      case "ENVIRONMENT-ADMINISTRATOR":
        localSessionController.login("PYRAMUS", "STAFF-4");
      break;
      
      case "PSEUDO-EVERYONE":
        // Do nothing
      break;
      
    }
    
    return Response.ok().build();
  }
  
  @GET
  @Path("/reindex")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_reindex() {
    List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntities();
    for (int i = 0; i < workspaceEntities.size(); i++) {
      WorkspaceEntity workspaceEntity = workspaceEntities.get(i);
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace != null) {
        try {
          indexer.index(Workspace.class.getSimpleName(), workspace);
        } catch (Exception e) {
          logger.log(Level.WARNING, "could not index WorkspaceEntity #" + workspaceEntity.getId(), e);
        }
      }
    }

    logger.log(Level.INFO, "Reindexed workspaces )");
   
    List<UserEntity> users = userEntityController.listUserEntities();
    for (int i = 0; i < users.size(); i++) {
      UserEntity userEntity = users.get(i);
      List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);

      for (UserSchoolDataIdentifier identifier : identifiers) {
        User user = userController.findUserByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
        try {
          indexer.index(User.class.getSimpleName(), user);
        } catch (Exception e) {
          logger.log(Level.WARNING, "could not index User #" + user.getSchoolDataSource() + '/' + user.getIdentifier(), e);
        }
      }
    }
    logger.log(Level.INFO, "Reindexed users");
    
   return Response.ok().build();
  }

  @GET
  @Path("/mockimport")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_importmock() {
    pyramusUpdater.updateUserRoles();
    pyramusUpdater.updateCourses(0, 100);
    pyramusUpdater.updateStaffMembers(0, 100);
    pyramusUpdater.updateStudents(0, 100);
    
    return Response.ok().build();
  }
  
  @POST
  @Path("/workspaces")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspace(fi.muikku.atests.Workspace payload) {
    SchoolDataWorkspaceDiscoveredEvent event = new SchoolDataWorkspaceDiscoveredEvent(payload.getSchoolDataSource(), payload.getIdentifier(), payload.getName(), null);
    schoolDataWorkspaceDiscoveredEvent.fire(event);
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(event.getDiscoveredWorkspaceEntityId());
    
    if (payload.getPublished() != null) {
      workspaceEntityController.updatePublished(workspaceEntity, payload.getPublished());
    }
    
    return Response.ok(createRestEntity(workspaceEntity, payload.getName())).build();
  }
  
  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response deleteWorkspace(@PathParam ("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(404).entity("Not found").build();
    }
    
    List<WorkspaceRolePermission> permissions = workspaceRolePermissionDAO.listByWorkspaceEntity(workspaceEntity);
    for (WorkspaceRolePermission permission : permissions) {
      workspaceRolePermissionDAO.delete(permission);
    }
    
    try {
      workspaceMaterialController.deleteAllWorkspaceNodes(workspaceEntity);
    } catch (WorkspaceMaterialContainsAnswersExeption e) {
      return Response.status(500).entity(e.getMessage()).build();
    }
    
    List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntities(workspaceEntity);
    for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
      workspaceUserEntityController.deleteWorkspaceUserEntity(workspaceUserEntity);
    }
    
    workspaceEntityController.deleteWorkspaceEntity(workspaceEntity);
    
    return Response.noContent().build();
  }

  @POST
  @Path("/workspaces/{WORKSPACEID}/htmlmaterials")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response createWorkspaceMaterial(fi.muikku.atests.WorkspaceHtmlMaterial payload) {
    HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(payload.getTitle(), payload.getHtml(), payload.getContentType(), payload.getRevisionNumber());
    WorkspaceNode parent = workspaceMaterialController.findWorkspaceNodeById(payload.getParentId());
    if (parent == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid parentId").build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(parent, htmlMaterial);

    return Response.ok(createRestEntity(workspaceMaterial, htmlMaterial)).build();
  }
  
  private fi.muikku.atests.Workspace createRestEntity(WorkspaceEntity workspaceEntity, String name) {
    return new fi.muikku.atests.Workspace(workspaceEntity.getId(), name, workspaceEntity.getUrlName(), workspaceEntity.getDataSource().getIdentifier(), workspaceEntity.getIdentifier(), workspaceEntity.getPublished());
  }

  private fi.muikku.atests.WorkspaceHtmlMaterial createRestEntity(WorkspaceMaterial workspaceMaterial, HtmlMaterial htmlMaterial) {
    return new fi.muikku.atests.WorkspaceHtmlMaterial(workspaceMaterial.getId(), 
        workspaceMaterial.getParent().getId(), 
        workspaceMaterial.getTitle(), 
        htmlMaterial.getRevisionNumber(), 
        htmlMaterial.getId(), 
        htmlMaterial.getOriginMaterial() != null ? htmlMaterial.getOriginMaterial().getId() : null, 
        htmlMaterial.getContentType(), 
        htmlMaterial.getHtml(), 
        htmlMaterial.getRevisionNumber(), 
        workspaceMaterial.getAssignmentType().toString());
  }

  
}
