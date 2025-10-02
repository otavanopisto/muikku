package fi.otavanopisto.muikku.plugins.worklist.rest;

import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

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

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.worklist.WorklistController;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.WorkspaceSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.payload.WorklistApproverRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistWorkspacePricesRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemBilledPriceRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemStateChangeRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemTemplateRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistSummaryItemRestModel;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/worklist")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class WorklistRESTService {
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private WorkspaceSchoolDataController workspaceSchoolDataController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private LocaleController localeController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorklistController worklistController;

  @Inject
  private Mailer mailer;

  /**
   * GET mApi().worklist.templates
   * 
   * Returns a list of templates from which new worklist items can be created.
   * 
   * Payload: <none>
   * 
   * Output: List of templates
   *  
   * [
   *   {id: 123,
   *    description: "Teachers' meeting",
   *    price: 25,
   *    factor: 1,
   *    editableFields: [
   *      "ENTRYDATE,"
   *      "DESCRIPTION",
   *      "PRICE",
   *      "FACTOR",
   *      "BILLING_NUMBER"
   *    ]
   *   },
   *    
   *    ...
   *  ]
   */
  @Path("/templates")
  @GET
  @RESTPermit(MuikkuPermissions.LIST_WORKLISTITEMTEMPLATES)
  public Response listWorklistItemTemplates() {
    
    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<List<WorklistItemTemplateRestModel>> response = userSchoolDataController.listWorklistTemplates(dataSource);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * POST mApi().worklist.worklistItems
   * 
   * Creates a new worklist item from the given template.
   * 
   * Payload: Worklist item with templateId and editable fields set
   * 
   * {templateId: 1
   *  entryDate: 2021-02-15
   *  description: "Something something",
   *  price: 25,
   *  factor: 2,
   *  billingNumber: 123456
   * }
   *  
   * NOTE: If trying to pass along a value for a field that is not editable according
   * to the chosen template, the template value will be used instead.
   * 
   * Output: Created worklist item 
   * 
   * {id: 123,
   *  templateId: 1,
   *  state: ENTERED|PROPOSED|APPROVED|PAID,
   *  entryDate: 2021-02-15,
   *  description: "Something something",
   *  price: 25,
   *  factor: 2,
   *  billingNumber: 123456
   *  editableFields: [
   *    "ENTRYDATE",
   *    "DESCRIPTION",
   *    "PRICE",
   *    "FACTOR",
   *    "BILLING_NUMBER"
   *  ]
   * }
   */
  @Path("/worklistItems")
  @POST
  @RESTPermit(MuikkuPermissions.CREATE_WORKLISTITEM)
  public Response createWorklistItem(WorklistItemRestModel item) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<WorklistItemRestModel> response = userSchoolDataController.createWorklistItem(dataSource, item);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * PUT mApi().worklist.worklistItems
   * 
   * Updates an existing worklist item (entryDate, description, price, factor).
   * 
   * NOTE: If trying to pass along a value for a field that is not editable according
   * to the worklist item, the item's original value will be used instead.
   * 
   * Payload: An existing worklist item
   * 
   * Output: Updated worklist item
   * 
   * Errors:
   * 400 Payload and path ids don't match
   * 403 if trying to update a worklist item that is already approved or paid
   */
  @Path("/worklistItems/{ID}")
  @PUT
  @RESTPermit(MuikkuPermissions.UPDATE_WORKLISTITEM)
  public Response updateWorklistItem(@PathParam("ID") Long worklistItemId, WorklistItemRestModel item) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (!worklistItemId.equals(item.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Id mismatch").build();
    }
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<WorklistItemRestModel> response = userSchoolDataController.updateWorklistItem(dataSource, item);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * DELETE mApi().worklist.worklistItems
   * 
   * Removes an existing worklist item with the specified id
   * 
   * Payload: None
   * 
   * Output: 204 (no content)
   * 
   * Errors:
   * 403 if trying to remove a worklist item that is already approved or paid
   */
  @Path("/worklistItems/{ID}")
  @DELETE
  @RESTPermit(MuikkuPermissions.DELETE_WORKLISTITEM)
  public Response removeWorklistItem(@PathParam("ID") Long worklistItemId) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorklistItemRestModel item = new WorklistItemRestModel();
    item.setId(worklistItemId);
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    userSchoolDataController.removeWorklistItem(dataSource, item);
    return Response.noContent().build();
  }

  /**
   * GET mApi().worklist.worklistItems
   * 
   * Returns an array of worklist items belonging to a user. Timeframe can also be specified.
   * 
   * Query parameters:
   * owner: PYRAMUS-STAFF-123
   * beginDate: 2021-02-01
   * endDate: 2021-02-28 
   * 
   * Output: List of worklist items matching the query.
   * 
   * [
   *   {id: 1,
   *    templateId: 1,
   *    state: ENTERED|PROPOSED|APPROVED|PAID,
   *    entryDate: 2021-02-15,
   *    description: "Something something",
   *    price: 25,
   *    factor: 2,
   *    billingNumber: 123456
   *    editableFields: [
   *      "ENTRYDATE",
   *      "DESCRIPTION",
   *      "PRICE",
   *      "FACTOR",
   *      "BILLING_NUMBER"
   *    ],
   *    removable: true
   *   },
   *   
   *   {id: 123,
   *    templateId: 2,
   *    state: ENTERED|PROPOSED|APPROVED|PAID,
   *    entryDate: 2021-03-01,
   *    description: "Course assessment",
   *    price: 75,
   *    factor: 1,
   *    billingNumber: 123456,
   *    courseAssessment: {
   *      courseName: "BI1 - Ihmisen biologia",
   *      studentName: "John "Joe" Doe (Nettilukio)",
   *      grade: 10,
   *      raisedGrade: true 
   *    }
   *    editableFields: [],
   *    removable: false
   *   },
   *    
   *   ...
   * ]
   */
  @Path("/worklistItems")
  @GET
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorklistItemsByOwnerAndTimeframe(@QueryParam("owner") String identifier, @QueryParam("beginDate") String beginDate, @QueryParam("endDate") String endDate) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_WORKLISTITEMS)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(identifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<List<WorklistItemRestModel>> response = userSchoolDataController.listWorklistItemsByOwnerAndTimeframe(dataSource, identifier, beginDate, endDate);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }

  /**
   * GET mapi().worklist.isAvailable
   * 
   * Returns whether worklist functionality is available (for the currently logged in user).
   * 
   * Output: true|false
   */
  @GET
  @Path("/isAvailable")
  @RESTPermit(handling = Handling.INLINE)
  public Response getIsAvailable() {
    boolean available = worklistController.isWorklistAvailable() && sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_WORKLIST_BILLING);
    return Response.ok(available).build();
  }

  /**
   * GET mApi().worklist.worklistSummary
   * 
   * Returns an array of monthly worklist summary items for the given user; mainly the number
   * of worklist items the user has created that month.
   * 
   * Query parameters:
   * owner: PYRAMUS-STAFF-123
   * 
   * Output: Monnthly summary items of all worklist items of the user.
   * 
   * [
   *   {displayName: March 2021,
   *    beginDate: 2021-03-01,
   *    endDate: 2021-03-31,
   *    count: 28
   *   },
   *    
   *    ...
   * ]
   */
  @Path("/worklistSummary")
  @GET
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorklistItemsByOwnerAndTimeframe(@QueryParam("owner") String identifier) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_WORKLISTITEMS)) {
      if (!StringUtils.equals(SchoolDataIdentifier.fromId(identifier).getIdentifier(), sessionController.getLoggedUserIdentifier())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<List<WorklistSummaryItemRestModel>> response = userSchoolDataController.getWorklistSummary(dataSource, identifier);
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }
  
  /**
   * PUT mApi().worklist.updateWorklistItemsState
   * 
   * Updates all worklist items of the given user in the given timeframe to the given state.
   * 
   * Payload: State change payload item
   * 
   * {userIdentifier: PYRAMUS-STAFF-123,
   *  beginDate: 2021-02-01,
   *  endDate: 2021-02-28,
   *  state: "PROPOSED"
   * }
   *  
   * Output: All worklist items of the timeframe, with an updated state
   */
  @PUT
  @Path("/updateWorklistItemsState")
  @RESTPermit(MuikkuPermissions.UPDATE_WORKLISTITEM)
  public Response updateWorklistItemsState(WorklistItemStateChangeRestModel stateChange) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    UserEntityName currentUserName = userEntityController.getName(sessionController.getLoggedUserEntity(), false);
    if (currentUserName == null) {
      User user = userController.findUserByIdentifier(sessionController.getLoggedUserEntity().defaultSchoolDataIdentifier());
      if (user != null) {
        currentUserName = new UserEntityName(user.getFirstName(), user.getLastName(), user.getNickName(), user.getStudyProgrammeName());
      }
    }
    if (currentUserName == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Unable to resolve user name %s", sessionController.getLoggedUserIdentifier())).build();
    }
    
    // Do the actual update
    
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    userSchoolDataController.updateWorklistItemsState(dataSource, stateChange);
    
    // If changing state to PROPOSED, notify approvers via e-mail
    
    if (StringUtils.equals("PROPOSED", stateChange.getState())) {
      List<WorklistApproverRestModel> approvers = null;
      
      // Ask Pyramus for users marked as worklist approvers
      
      schoolDataBridgeSessionController.startSystemSession();
      try {
        BridgeResponse<List<WorklistApproverRestModel>> response = userSchoolDataController.listWorklistApprovers(dataSource);
        if (response.ok()) {
          approvers = response.getEntity();
        }
        else {
          logger.severe(String.format("Error retrieving worklist approvers: %d (%s)", response.getStatusCode(), response.getMessage()));
        }
      }
      finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
      
      // If we have approvers, send the notification
      
      if (!CollectionUtils.isEmpty(approvers)) {
        List<String> approverEmails = approvers.stream().map(WorklistApproverRestModel::getEmail).collect(Collectors.toList());
        String mailSubject = localeController.getText(sessionController.getLocale(), "rest.worklist.approveMail.subject");
        String mailContent = localeController.getText(sessionController.getLocale(), "rest.worklist.approveMail.content");
        mailContent = MessageFormat.format(
            mailContent,
            // Parameters for the human readable content of the message
            currentUserName.getDisplayName(),
            stateChange.getBeginDate().format(DateTimeFormatter.ofPattern("d.M.yyyy")), // e.g. 1.2.2021
            stateChange.getEndDate().format(DateTimeFormatter.ofPattern("d.M.yyyy")), // e.g. 28.2.2021
            // Parameters for the link to Pyramus
            // TODO Not the prettiest way of resolving current user's id in Pyramus but about the only one that can be used here :| 
            StringUtils.substringAfterLast(stateChange.getUserIdentifier(), "-"),
            stateChange.getBeginDate().toString(), // e.g. 2021-02-01
            stateChange.getEndDate().toString() // e.g. 2021-02-28
        );
        mailer.sendMail(MailType.HTML, approverEmails, mailSubject, mailContent);
      }
    }
    
    // Fetch and return user's all worklist items in the timeframe  
    
    BridgeResponse<List<WorklistItemRestModel>> response = userSchoolDataController.listWorklistItemsByOwnerAndTimeframe(
        dataSource,
        stateChange.getUserIdentifier(),
        stateChange.getBeginDate().toString(),
        stateChange.getEndDate().toString());
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    }
    else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
    }
  }
  
  @GET
  @Path("/workspacePrices")
  @RESTPermit(MuikkuPermissions.ACCESS_WORKLIST_BILLING)
  public Response getWorkspacePrices(@QueryParam("workspaceEntityId") Long workspaceEntityId) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    WorklistWorkspacePricesRestModel price = null;
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    price = workspaceSchoolDataController.getWorkspacePrices(workspaceEntity);
    return price == null ? Response.noContent().build() : Response.ok(price).build();
  }

  @GET
  @Path("/billedPrice")
  @RESTPermit(MuikkuPermissions.ACCESS_WORKLIST_BILLING)
  public Response getWorkspaceBilledPrice(@QueryParam("workspaceEntityId") Long workspaceEntityId, @QueryParam("assessmentIdentifier") String assessmentIdentifier) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    SchoolDataIdentifier workspaceAssessmentIdentifier = SchoolDataIdentifier.fromId(assessmentIdentifier);
    schoolDataBridgeSessionController.startSystemSession();
    try {
      BridgeResponse<WorklistItemBilledPriceRestModel> response = workspaceSchoolDataController.getWorkspaceBilledPrice(
          workspaceEntityId, workspaceAssessmentIdentifier.getIdentifier());
      if (response.ok()) {
        return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
      }
      else {
        return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
      }
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  @PUT
  @Path("/billedPrice")
  @RESTPermit(MuikkuPermissions.ACCESS_WORKLIST_BILLING)
  public Response getWorkspaceBilledPrice(@QueryParam("workspaceEntityId") Long workspaceEntityId, WorklistItemBilledPriceRestModel payload) {

    if (!worklistController.isWorklistAvailable()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    schoolDataBridgeSessionController.startSystemSession();
    try {
      BridgeResponse<WorklistItemBilledPriceRestModel> response = workspaceSchoolDataController.updateWorkspaceBilledPrice(
          workspaceEntity.getDataSource(), payload);
      if (response.ok()) {
        return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
      }
      else {
        return Response.status(response.getStatusCode()).entity(response.getMessage()).build();
      }
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

}
