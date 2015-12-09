package fi.muikku.plugins.assessmentrequest.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestPermissions;
import fi.muikku.plugins.assessmentrequest.rest.model.AssessmentRequestRESTModel;
import fi.muikku.plugins.communicator.CommunicatorAssessmentRequestController;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/assessmentrequest")
@Produces("application/json")
@Stateful
public class AssessmentRequestRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private AssessmentRequestController assessmentRequestController;

  @LocalSession
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private CommunicatorAssessmentRequestController communicatorAssessmentRequestController;

  @POST
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests")
  @RESTPermitUnimplemented
  public Response createAssessmentRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, AssessmentRequestRESTModel newAssessmentRequest) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);

    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
    try {
      WorkspaceAssessmentRequest assessmentRequest = assessmentRequestController.createWorkspaceAssessmentRequest(workspaceUserEntity, newAssessmentRequest.getRequestText());
      communicatorAssessmentRequestController.sendAssessmentRequestMessage(assessmentRequest);
      return Response.ok(restModel(assessmentRequest)).build();
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Couldn't create workspace assessment request.", e);
      
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    } 
  }

  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests")
  @RESTPermit(handling = Handling.INLINE)
  public Response listAssessmentRequestsByWorkspaceId(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);

    if (!sessionController.hasPermission(AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    try {
      List<WorkspaceAssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspace(workspaceEntity); 
  
      return Response.ok(restModel(assessmentRequests)).build();
    } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
      logger.log(Level.SEVERE, "Couldn't list workspace assessment requests.", e);
      
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  @DELETE
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests/{ID}")
  @RESTPermitUnimplemented
  public Response deleteAssessmentRequest(
      @PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
      @PathParam("ID") String assessmentRequestId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    SchoolDataIdentifier assessmentRequestIdentifier = SchoolDataIdentifier.fromId(assessmentRequestId);
    if (assessmentRequestId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid assessmentRequestIdentifier").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());    
    assessmentRequestController.deleteWorkspaceAssessmentRequest(workspaceUserEntity, assessmentRequestIdentifier);
    
    communicatorAssessmentRequestController.sendAssessmentRequestCancelledMessage(workspaceUserEntity);
    
    return Response.noContent().build();
  }

  private List<AssessmentRequestRESTModel> restModel(List<WorkspaceAssessmentRequest> workspaceAssessmentReqeusts) {
    List<AssessmentRequestRESTModel> restAssessmentRequests = new ArrayList<>();

    if (workspaceAssessmentReqeusts != null) {
      for (WorkspaceAssessmentRequest workspaceAssessmentRequest : workspaceAssessmentReqeusts) {
        AssessmentRequestRESTModel restModel = restModel(workspaceAssessmentRequest);
        if (restModel != null) {
          restAssessmentRequests.add(restModel);
        }
      }
    }
    
    return restAssessmentRequests;
  }
  
  private AssessmentRequestRESTModel restModel(WorkspaceAssessmentRequest workspaceAssessmentRequest) {

    SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(
        workspaceAssessmentRequest.getWorkspaceUserIdentifier(),
        workspaceAssessmentRequest.getWorkspaceUserSchoolDataSource());
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
    if (workspaceUserEntity != null) {
      SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(), 
          workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
      SchoolDataIdentifier workspaceAssessmentRequestIdentifier = new SchoolDataIdentifier(
          workspaceAssessmentRequest.getIdentifier(), workspaceAssessmentRequest.getSchoolDataSource());
      WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
      UserEntity userEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
      
      AssessmentRequestRESTModel restAssessmentRequest = new AssessmentRequestRESTModel(
          workspaceAssessmentRequestIdentifier.toId(), 
          userIdentifier.toId(),
          workspaceUserIdentifier.toId(),
          workspaceEntity.getId(), 
          userEntity.getId(), 
          workspaceAssessmentRequest.getRequestText(), 
          workspaceAssessmentRequest.getDate());
  
      return restAssessmentRequest;
    } else {
      logger.severe(String.format("Could not find workspace user entity for worksaceUserIdentifier %s", workspaceUserIdentifier));
      return null;
    }
  }
}
