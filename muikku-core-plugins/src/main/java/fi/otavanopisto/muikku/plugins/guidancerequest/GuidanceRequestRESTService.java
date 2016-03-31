package fi.otavanopisto.muikku.plugins.guidancerequest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import fi.otavanopisto.muikku.plugin.PluginRESTService;

@Path("/guidancerequest")
@RequestScoped
@Stateful
@Produces ("application/json")
public class GuidanceRequestRESTService extends PluginRESTService {
// FIXME: Re-enable this service
//
//  @Inject
//  private SessionController sessionController;
//  
//  @Inject
//  private WorkspaceController workspaceController;
//  
//  @Inject
//  private GuidanceRequestController guidanceRequestController;
//  
//  @POST
//  @Path ("/createGuidanceRequest")
//  public Response createGuidanceRequest(
//      @FormParam ("message") String message
//   ) throws AuthorizationException {
//    UserEntity userEntity = sessionController.getUser();
//    
//    GuidanceRequest guidanceRequest = guidanceRequestController.createGuidanceRequest(
//        userEntity, new Date(), message);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//      
//    return Response.ok(
//      tranquility.entity(guidanceRequest)
//    ).build();
//  }
//
//  @POST
//  @Path ("/createWorkspaceGuidanceRequest")
//  public Response createWorkspaceGuidanceRequest(
//      @FormParam ("workspaceId") Long workspaceId,
//      @FormParam ("message") String message
//   ) throws AuthorizationException {
//    UserEntity userEntity = sessionController.getUser();
//    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
//    
//    GuidanceRequest guidanceRequest = guidanceRequestController.createWorkspaceGuidanceRequest(
//        workspaceEntity, userEntity, new Date(), message);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//      
//    return Response.ok(
//      tranquility.entity(guidanceRequest)
//    ).build();
//  }
//  
}
