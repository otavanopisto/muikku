package fi.otavanopisto.muikku.plugins.assessmentrequest.rest;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import com.google.common.hash.Hashing;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestPermissions;
import fi.otavanopisto.muikku.plugins.assessmentrequest.rest.model.AssessmentRequestRESTModel;
import fi.otavanopisto.muikku.plugins.ceepos.CeeposController;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposAssessmentRequestOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProduct;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProductType;
import fi.otavanopisto.muikku.plugins.ceepos.rest.CeeposRedirectRestModel;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorAssessmentRequestController;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentPrice;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/assessmentrequest")
@Produces("application/json")
@Stateful
@RestCatchSchoolDataExceptions
public class AssessmentRequestRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;

  @Inject
  private HttpServletRequest httpRequest;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private AssessmentRequestController assessmentRequestController;

  @Inject
  private WorkspaceSchoolDataController workspaceSchoolDataController;

  @LocalSession
  @Inject
  private SessionController sessionController;
  
  @Inject
  private CeeposController ceeposController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private CommunicatorAssessmentRequestController communicatorAssessmentRequestController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private EvaluationController evaluationController;
  
  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentPrice")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceAssessmentPrice(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Workspace %d not found", workspaceEntityId)).build();
    }
    WorkspaceAssessmentPrice price = workspaceSchoolDataController.getWorkspaceAssessmentPrice(workspaceEntity);
    
    // Price is reset to zero if the user has previously paid for an assessment of this workspace 
    
    if (price != null && price.getPrice() > 0) {
      List<CeeposAssessmentRequestOrder> existingOrders = ceeposController.listAssessmentRequestOrdersByStudentAndWorkspaceAndArchived(
          sessionController.getLoggedUser().toId(),
          workspaceEntityId,
          Boolean.FALSE);
      CeeposAssessmentRequestOrder order = existingOrders.stream().filter(o -> o.getState() == CeeposOrderState.PAID || o.getState() == CeeposOrderState.COMPLETE).findFirst().orElse(null);
      if (order != null) {
        price.setPrice(0d);
      }
    }
    
    // Price is reset to zero if the user has an active supplementation request on this workspace
    
    if (price != null && price.getPrice() > 0) {
      SupplementationRequest supplementationRequest = evaluationController.findLatestSupplementationRequestByStudentAndWorkspaceAndHandledAndArchived(
          sessionController.getLoggedUserEntity().getId(),
          workspaceEntityId,
          Boolean.FALSE,
          Boolean.FALSE);
      if (supplementationRequest != null) {
        price.setPrice(0d);
      }
    }
    
    return Response.ok(price).build();
  }

  @POST
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createAssessmentRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, AssessmentRequestRESTModel newAssessmentRequest) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Course not found").build();
    }
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Course user not found").build();
    }
    try {
      WorkspaceAssessmentRequest assessmentRequest = assessmentRequestController.createWorkspaceAssessmentRequest(workspaceUserEntity, newAssessmentRequest.getRequestText());
      communicatorAssessmentRequestController.sendAssessmentRequestMessage(sessionController.getLocale(), assessmentRequest);
      return Response.ok(assessmentRequestController.restModel(assessmentRequest)).build();
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, "Couldn't create workspace assessment request.", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    } 
  }
  
  @POST
  @Path("/workspace/{WORKSPACEENTITYID}/paidAssessmentRequest")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createPaidAssessmentRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, AssessmentRequestRESTModel payload) {

    // Workspace check
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace entity not found").build();
    }
    
    // List previous orders

    List<CeeposAssessmentRequestOrder> existingOrders = ceeposController.listAssessmentRequestOrdersByStudentAndWorkspaceAndArchived(
        sessionController.getLoggedUser().toId(),
        workspaceEntityId,
        Boolean.FALSE);
    
    // Check that the user has not paid before

    CeeposAssessmentRequestOrder order = existingOrders.stream().filter(o -> o.getState() == CeeposOrderState.PAID || o.getState() == CeeposOrderState.COMPLETE).findFirst().orElse(null);
    if (order != null) {
      return Response.status(Status.BAD_REQUEST).entity("Assessment request already exists").build();
    }
    
    // Figure out the cost
    
    WorkspaceAssessmentPrice price = workspaceSchoolDataController.getWorkspaceAssessmentPrice(workspaceEntity);
    if (price == null || price.getPrice() == null || price.getPrice() == 0d) {
      return Response.status(Status.BAD_REQUEST).entity("Unable to determine price").build();
    }
    
    // Figure out the product
    
    User user = userSchoolDataController.findUser(sessionController.getLoggedUser());
    if (user == null) {
      return Response.status(Status.BAD_REQUEST).entity("Unable to determine user").build();
    }
    CeeposProduct product = StringUtils.isBlank(user.getSchool())
        ? ceeposController.findProductByType(CeeposProductType.ASSESSMENTREQUEST_FUNDED)
        : ceeposController.findProductByType(CeeposProductType.ASSESSMENTREQUEST);
    if (product == null) {
      return Response.status(Status.BAD_REQUEST).entity("Unable to determine product").build();
    }
    
    // Create the order, or reuse an existing one as long as it is still CREATED or ONGOING
    
    order = existingOrders.stream().filter(o -> o.getState() == CeeposOrderState.CREATED || o.getState() == CeeposOrderState.ONGOING).findFirst().orElse(null);
    if (order != null) {
      order = ceeposController.updateRequestText(order, payload.getRequestText());
    }
    else { 
      order = ceeposController.createAssessmentRequestOrder(
          product,
          sessionController.getLoggedUserEntity(),
          workspaceEntity,
          payload.getRequestText(),
          Integer.valueOf((int) (price.getPrice() * 100)));
    }
    if (order == null) {
      return Response.status(Status.BAD_REQUEST).entity("Order creation failed").build();
    }
    
    // Return redirect url for completing the payment
    
    String hash = Hashing.sha256().hashString(
        String.format("%d&%s&%s",
            order.getId(),
            order.getUserIdentifier(),
            pluginSettingsController.getPluginSetting("ceepos", "key")), StandardCharsets.UTF_8).toString();
    StringBuffer paymentUrl = new StringBuffer();
    paymentUrl.append(httpRequest.getScheme());
    paymentUrl.append("://");
    paymentUrl.append(httpRequest.getServerName());
    paymentUrl.append(":");
    paymentUrl.append(httpRequest.getServerPort());
    paymentUrl.append("/ceepos/pay?order=");
    paymentUrl.append(order.getId());
    paymentUrl.append("&hash=");
    paymentUrl.append(hash);
    
    return Response.ok(new CeeposRedirectRestModel(paymentUrl.toString())).build();
  }

  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests")
  @RESTPermit(handling = Handling.INLINE)
  public Response listAssessmentRequestsByWorkspaceId(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam ("studentIdentifier") String studentId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace not found").build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentId);
    if (studentIdentifier != null) {
      if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
        if (!sessionController.hasPermission(AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS, workspaceEntity)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
      
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, studentIdentifier);
      if (workspaceUserEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("WorkspaceUserEntity could not find").build();
      }

      return Response.ok(restModel(assessmentRequestController.listByWorkspaceUser(workspaceUserEntity))).build();
    } else {
      if (!sessionController.hasPermission(AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
  
      List<WorkspaceAssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspace(workspaceEntity); 
      return Response.ok(restModel(assessmentRequests)).build();
    }
  }

  @DELETE
  @Path("/workspace/{WORKSPACEENTITYID}/assessmentRequests/{ID}")
  @RESTPermitUnimplemented
  public Response archiveAssessmentRequest(
      @PathParam("WORKSPACEENTITYID") Long workspaceEntityId,
      @PathParam("ID") String assessmentRequestId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    if (assessmentRequestId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid assessmentRequestIdentifier").build();
    }
    
    SchoolDataIdentifier assessmentRequestIdentifier = SchoolDataIdentifier.fromId(assessmentRequestId);
    
    if (assessmentRequestIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid assessmentRequestIdentifier").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace entity not found").build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());    
    
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("Workspace user entity not found").build();
    }
    
    SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
    
    SchoolDataIdentifier studentIdentifier = new SchoolDataIdentifier(workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(), workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
    
    if (!sessionController.getLoggedUser().equals(studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier workspaceStudentIdentifier = new SchoolDataIdentifier(workspaceUserEntity.getIdentifier(), workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
    UserEntity studentEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource(), workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
    WorkspaceAssessmentRequest assessmentRequest = assessmentRequestController.findWorkspaceAssessmentRequest(assessmentRequestIdentifier, workspaceIdentifier, studentIdentifier);
    if (assessmentRequest != null) {
      SchoolDataIdentifier assessmentRequestWorkspaceUserIdentifier = new SchoolDataIdentifier(assessmentRequest.getWorkspaceUserIdentifier(), assessmentRequest.getSchoolDataSource());
      if (assessmentRequestWorkspaceUserIdentifier.equals(workspaceStudentIdentifier)) {
        assessmentRequestController.archiveWorkspaceAssessmentRequest(assessmentRequest, workspaceEntity, studentEntity);
        communicatorAssessmentRequestController.sendAssessmentRequestCancelledMessage(sessionController.getLocale(), workspaceUserEntity);
        evaluationController.createAssessmentRequestCancellation(studentEntity.getId(), workspaceEntityId, new Date());
      }
      else {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    else {
      return Response.status(Status.NOT_FOUND).entity("Could not find assessment request").build();
    }
    
    return Response.noContent().build();
  }

  private List<AssessmentRequestRESTModel> restModel(List<WorkspaceAssessmentRequest> workspaceAssessmentRequests) {
    List<AssessmentRequestRESTModel> restAssessmentRequests = new ArrayList<>();

    for (WorkspaceAssessmentRequest workspaceAssessmentRequest : workspaceAssessmentRequests) {
      AssessmentRequestRESTModel restModel = assessmentRequestController.restModel(workspaceAssessmentRequest);
      if (restModel != null) {
        restAssessmentRequests.add(restModel);
      }
    }
    
    return restAssessmentRequests;
  }

}
