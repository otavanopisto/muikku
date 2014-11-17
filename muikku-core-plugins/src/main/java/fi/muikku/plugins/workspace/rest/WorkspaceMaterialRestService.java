package fi.muikku.plugins.workspace.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

@RequestScoped
@Path("/workspace/materials")
@Stateful
@Produces("application/json")
public class WorkspaceMaterialRestService extends PluginRESTService {

  private static final long serialVersionUID = -3294706052343655384L;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @DELETE
  @Path("/{id}")
  public Response deleteNode(@PathParam("id") Long id) {
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(id);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      workspaceMaterialController.deleteWorkspaceMaterial(workspaceMaterial);
      return Response.noContent().build();
    }
  }

}
