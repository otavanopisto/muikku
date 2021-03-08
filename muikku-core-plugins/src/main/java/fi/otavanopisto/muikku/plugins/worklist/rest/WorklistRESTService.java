package fi.otavanopisto.muikku.plugins.worklist.rest;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.binary.StringUtils;

import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistItemTemplateRestModel;
import fi.otavanopisto.muikku.schooldata.payload.WorklistSummaryItemRestModel;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/worklist")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class WorklistRESTService {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private UserSchoolDataController userSchoolDataController;

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
   *   {id: 123
   *    description: "Teachers' meeting"
   *    price: 25
   *    factor: 1
   *    templateType: EDITABLE|UNEDITABLE|COURSE_ASSESSMENT|GRADE_RAISE
   *    removable: true},
   *    ...
   *  ]
   */
  @Path("/templates")
  @GET
  @RESTPermit(MuikkuPermissions.LIST_WORKLISTITEMTEMPLATES)
  public Response listWorklistItemTemplates() {
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
   * Payload: Any one template from the templates endpoint
   * 
   * Output: New worklist item
   * 
   * {id: 123
   *  entryDate: 2021-03-01
   *  description: "Course assessment"
   *  price: 75
   *  factor: 1
   *  courseAssessment: {
   *    courseName: "BI1 - Ihmisen biologia"
   *    studentName: "John "Joe" Doe (Nettilukio)"
   *    grade: 10
   *    raisedGrade: true 
   *  }
   *  editable: false
   *  removable: false}
   */
  @Path("/worklistItems")
  @POST
  @RESTPermit(MuikkuPermissions.CREATE_WORKLISTITEM)
  public Response createWorklistItem(WorklistItemTemplateRestModel template) {
    String dataSource = sessionController.getLoggedUserSchoolDataSource();
    BridgeResponse<WorklistItemRestModel> response = userSchoolDataController.createWorklistItem(dataSource, template);
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
   * Payload: An existing worklist item
   * 
   * Output: Updated worklist item
   * 
   * Errors:
   * 403 if trying to update a worklist item that has editable false
   */
  @Path("/worklistItems")
  @PUT
  @RESTPermit(MuikkuPermissions.UPDATE_WORKLISTITEM)
  public Response updateWorklistItem(WorklistItemRestModel item) {
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
   * Removes an existing worklist item.
   * 
   * Payload: An existing worklist item
   * 
   * Output: 204 (no content)
   * 
   * Errors:
   * 403 if trying to remove a worklist item that has removable false
   */
  @Path("/worklistItems")
  @DELETE
  @RESTPermit(MuikkuPermissions.DELETE_WORKLISTITEM)
  public Response removeWorklistItem(WorklistItemRestModel item) {
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
   */
  @Path("/worklistItems")
  @GET
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorklistItemsByOwnerAndTimeframe(@QueryParam("owner") String identifier, @QueryParam("beginDate") String beginDate, @QueryParam("endDate") String endDate) {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_WORKLISTITEMS)) {
      if (!StringUtils.equals(identifier, sessionController.getLoggedUserIdentifier())) {
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
   *   {displayName: March 2021
   *    beginDate: 2021-03-01
   *    endDate: 2021-03-31
   *    count: 28},
   *    ...
   * ]
   */
  @Path("/worklistSummary")
  @GET
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorklistItemsByOwnerAndTimeframe(@QueryParam("owner") String identifier) {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_WORKLISTITEMS)) {
      if (!StringUtils.equals(identifier, sessionController.getLoggedUserIdentifier())) {
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
  
}
