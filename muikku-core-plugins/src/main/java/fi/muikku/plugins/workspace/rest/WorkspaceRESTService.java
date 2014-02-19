package fi.muikku.plugins.workspace.rest;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialCompact;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceCompact;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.tranquil.TranquilityBuilderFactory;

@RequestScoped
@Path("/workspace")
@Stateful
@Produces ("application/json")
public class WorkspaceRESTService extends PluginRESTService {

	@SuppressWarnings("cdi-ambiguous-dependency")
	@Inject
	private TranquilityBuilderFactory tranquilityBuilderFactory;
	
	@Inject
  private MaterialController materialController;

  @Inject
	private WorkspaceMaterialController workspaceMaterialController;
	
	@Inject
	private WorkspaceController workspaceController;
	
	// 
	// WorkspaceEntity 
	// 
		
	@GET
	@Path ("/workspaceEntities/")
	public Response listWorkspaceEntities(
	    @QueryParam ("schoolDataSource") String schoolDataSource, 
	    @QueryParam ("identifier") String identifier) {
	  
	  List<WorkspaceEntity> workspaceEntities = null;
	  
	  if (StringUtils.isNotBlank(schoolDataSource)) {
	    
      if (StringUtils.isNotBlank(identifier)) {
        Workspace workspace = workspaceController.findWorkspace(schoolDataSource, identifier);
        if (workspace != null) {
          workspaceEntities = Arrays.asList(workspaceController.findWorkspaceEntity(workspace));
        } else {
          workspaceEntities = Collections.emptyList();
        }
      } else {
        workspaceEntities = workspaceController.listWorkspaceEntitiesBySchoolDataSource(schoolDataSource);
      }
	  } else {
	    if (StringUtils.isNotBlank(identifier)) {
	      return Response.status(Status.BAD_REQUEST).entity("Cannot define identifier without schoolDataSource").build();
	    }
	    
	    workspaceEntities = workspaceController.listWorkspaceEntities();
	  }

		return Response.ok(
		  tranquilityBuilderFactory.createBuilder()
		    .createTranquility()
		    .entities(workspaceEntities)
		).build();
	}
	
	@GET
	@Path ("/workspaceEntities/{ID}")
	public Response getWorkspaceEntity(@PathParam ("ID") Long workspaceEntityId) {
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);

		return Response.ok(
		  tranquilityBuilderFactory.createBuilder()
		    .createTranquility()
		    .entity(workspaceEntity)
		).build();
	}
	
	// 
	// Workspace
	// 
	
	@POST
	@Path ("/workspaces/")
	public Response createWorkspace(WorkspaceCompact workspaceData) {
	  if (StringUtils.isNotBlank(workspaceData.getIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("Identifier can not be specified when creating a workspace").build();
    }
	  
    if (StringUtils.isBlank(workspaceData.getSchoolDataSource())) {
      return Response.status(Status.BAD_REQUEST).entity("SchoolDataSource must be defined when creating a workspace").build();
    }

    if (StringUtils.isBlank(workspaceData.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("name must be defined when creating a workspace").build();
    }

    if (StringUtils.isBlank(workspaceData.getWorkspaceTypeId())) {
      return Response.status(Status.BAD_REQUEST).entity("workspaceTypeId must be defined when creating a workspace").build();
    }

    if (StringUtils.isBlank(workspaceData.getCourseIdentifierIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("courseIdentifierIdentifier must be defined when creating a workspace").build();
    }

    // TODO: Incorrect school data source
    WorkspaceType workspaceType = workspaceController.findWorkspaceTypeByDataSourceAndIdentifier(workspaceData.getSchoolDataSource(), workspaceData.getWorkspaceTypeId());
    if (workspaceType == null) {
      return Response.status(Status.BAD_REQUEST).entity("workspace type could not be found").build();
    }
    
    Workspace workspace = workspaceController.createWorkspace(
        workspaceData.getSchoolDataSource(),
        workspaceData.getName(),
        workspaceData.getDescription(),
        workspaceType,
        workspaceData.getCourseIdentifierIdentifier());
    
    return Response.ok(
        tranquilityBuilderFactory.createBuilder()
          .createTranquility()
          .entity(workspace)
    ).build();
	}
	
	@GET
	@Path ("/workspaces/")
	public Response listWorkspaces() {
		List<Workspace> workspaces = workspaceController.listWorkspaces();

		return Response.ok(
		  tranquilityBuilderFactory.createBuilder()
		    .createTranquility()
		    .entities(workspaces)
		).build();
	}
	
	@GET
	@Path ("/workspaces/{WORKSPACE_ENTITY_ID}")
	public Response getWorkspace(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId) {
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
		if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
		
		Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
		return Response.ok(
		  tranquilityBuilderFactory.createBuilder()
		    .createTranquility()
		    .entity(workspace)
		).build();
	}
  
  @PUT
  @Path ("/workspaces/{WORKSPACE_ENTITY_ID}")
  public Response updateWorkspace(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId, WorkspaceCompact workspaceData) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (isChanged(workspaceData.getSchoolDataSource(), workspace.getSchoolDataSource())) {
      return Response.status(Status.BAD_REQUEST).entity("SchoolDataSource can not be changed").build();
    }

    if (isChanged(workspaceData.getIdentifier(), workspace.getIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("identifier can not be changed").build();
    }

    // TODO: CourseIdentifierIdentififer should be updateable
    if (isChanged(workspaceData.getWorkspaceTypeId(), workspace.getWorkspaceTypeId())) {
      return Response.status(Status.BAD_REQUEST).entity("courseIdentifierIdentifier can not be changed").build();
    }
    
    // TODO: WorkspaceTypeId should be updateable
    if (isChanged(workspaceData.getCourseIdentifierIdentifier(), workspace.getCourseIdentifierIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("workspaceTypeId can not be changed").build();
    }

    workspace.setDescription(workspaceData.getDescription());
    workspace.setName(workspaceData.getName());
    workspaceController.updateWorkspace(workspace);
    
    return Response.ok(
      tranquilityBuilderFactory.createBuilder()
        .createTranquility()
        .entity(workspace)
    ).build();
  }

  @DELETE
  @Path ("/workspaces/{WORKSPACE_ENTITY_ID}")
  public Response updateWorkspace(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    workspaceController.removeWorkspace(workspace);
    
    return Response.noContent().build();
  }
  
	//
	// Members
	//
  
  @GET
  @Path ("/workspaces/{WORKSPACE_ENTITY_ID}/users")
  public Response getWorkspaceUsers(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    List<WorkspaceUser> workspaceUsers = workspaceController.listWorkspaceUsers(workspace);
    
    return Response.ok(
      tranquilityBuilderFactory.createBuilder()
        .createTranquility()
        .entities(workspaceUsers)
    ).build();
  }

  //  
  //  Materials
  //
  
  @POST
  @Path ("/materials/")
  public Response createWorkspaceMaterial(WorkspaceMaterialCompact workspaceMaterial) {
    if (workspaceMaterial.getId() != null) {
      return Response.status(Status.BAD_REQUEST).entity("id can not be specified when creating new WorkspaceMaterial").build();
    }
    
    if (workspaceMaterial.getMaterial_id() == null) {
      return Response.status(Status.BAD_REQUEST).entity("material_id is required when creating new WorkspaceMaterial").build();
    }
    
    if (StringUtils.isBlank(workspaceMaterial.getUrlName())) {
      return Response.status(Status.BAD_REQUEST).entity("urlName is required when creating new WorkspaceMaterial").build();
    }
    
    WorkspaceNode parent = null;
    if (workspaceMaterial.getParent_id() != null) {
      parent = workspaceMaterialController.findWorkspaceNodeById(workspaceMaterial.getParent_id());
      if (parent == null) {
        return Response.status(Status.NOT_FOUND).entity("parent not found").build();
      }
    }
    
    Material material = materialController.findMaterialById(workspaceMaterial.getMaterial_id());
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("material not found").build();
    };
    
    return Response.ok(
        tranquilityBuilderFactory.createBuilder()
          .createTranquility()
          .entity(workspaceMaterialController.createWorkspaceMaterial(parent, material, workspaceMaterial.getUrlName()))
    ).build();
  }
  
  @DELETE
  @Path ("/materials/{ID}")
  public Response deleteWorkspaceMaterial(@PathParam("ID") Long workspaceMaterialId) {
    // TODO: Security
    
    if (workspaceMaterialId == null) {
      return Response.status(Status.NOT_FOUND).entity("workspace material not found").build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("workspace material not found").build();
    }
    
    workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial);
    
    return Response.noContent().build();
  }
  
  //
  // Nodes
  // 
  
  @GET
  @Path ("/nodes/")
  public Response listWorkspaceMaterials(@QueryParam ("parentId") Long parentId, @QueryParam ("workspaceEntityId") Long workspaceEntityId) {
    if (parentId != null && workspaceEntityId != null) {
      return Response.status(Status.BAD_REQUEST).entity("parentId and workspaceEntityId can not both be specified when listing workspace nodes").build();
    }

    WorkspaceNode parent = null;
    if (parentId != null) {
      parent = workspaceMaterialController.findWorkspaceNodeById(parentId);
      if (parent == null) {
        return Response.status(Status.NOT_FOUND).entity("parent not found").build();
      }
      
      return Response.ok(
        tranquilityBuilderFactory.createBuilder()
          .createTranquility()
          .entities(workspaceMaterialController.listWorkspaceNodesByParent(parent))
      ).build();
    } else if (workspaceEntityId != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        return Response.status(Status.NOT_FOUND).entity("parent not found").build();
      }
      
      return Response.ok(
        tranquilityBuilderFactory.createBuilder()
          .createTranquility()
          .entities(Arrays.asList(workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity)))
      ).build();
    } else {
      return Response.status(Status.BAD_REQUEST).entity("either parentId or workspaceEntityId must be specified when listing workspace nodes").build();
    }
  }

  private boolean isChanged(Object object1, Object object2) {
    if (object1 == null) {
      return false;
    }
    
    return !object1.equals(object2);
  }
  
  
  
}
