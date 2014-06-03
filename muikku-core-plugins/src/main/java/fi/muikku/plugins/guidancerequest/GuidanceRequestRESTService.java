package fi.muikku.plugins.guidancerequest;

import java.util.Date;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.security.AuthorizationException;
import fi.muikku.session.SessionController;
import fi.tranquil.TranquilModelType;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;

@Path("/guidancerequest")
@RequestScoped
@Stateful
@Produces ("application/json")
public class GuidanceRequestRESTService extends PluginRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private GuidanceRequestController guidanceRequestController;
  
  @POST
  @Path ("/createGuidanceRequest")
  public Response createGuidanceRequest(
      @FormParam ("message") String message
   ) throws AuthorizationException {
    UserEntity userEntity = sessionController.getUser();
    
    GuidanceRequest guidanceRequest = guidanceRequestController.createGuidanceRequest(
        userEntity, new Date(), message);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
      
    return Response.ok(
      tranquility.entity(guidanceRequest)
    ).build();
  }

  @POST
  @Path ("/createWorkspaceGuidanceRequest")
  public Response createWorkspaceGuidanceRequest(
      @FormParam ("workspaceId") Long workspaceId,
      @FormParam ("message") String message
   ) throws AuthorizationException {
    UserEntity userEntity = sessionController.getUser();
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
    
    GuidanceRequest guidanceRequest = guidanceRequestController.createWorkspaceGuidanceRequest(
        workspaceEntity, userEntity, new Date(), message);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
      
    return Response.ok(
      tranquility.entity(guidanceRequest)
    ).build();
  }
  
}
