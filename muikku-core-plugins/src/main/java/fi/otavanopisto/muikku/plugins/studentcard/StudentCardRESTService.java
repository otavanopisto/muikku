package fi.otavanopisto.muikku.plugins.studentcard;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.StudentCard;
import fi.otavanopisto.muikku.schooldata.payload.StudentCardRESTModel;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/studentCards")
@RestCatchSchoolDataExceptions
public class StudentCardRESTService extends PluginRESTService {

  private static final long serialVersionUID = -4105588666105155763L;

  @Inject
  private SessionController sessionController;

  @Inject 
  private StudentCardController studentCardController;
  @PUT
  @Path ("/studentCard/{CARDID}/active")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateStudentCardActivity(@PathParam ("CARDID") Long noteId, StudentCardRESTModel payload) {
    
    SchoolDataIdentifier schoolDataIdentifier = sessionController.getLoggedUser();

    // Payload validation
    
    StudentCard studentCard = studentCardController.getStudentCard(schoolDataIdentifier);
    
    if (studentCard == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Student card for student %s not found", schoolDataIdentifier)).build();
    }
    
    // Access
    
    if (payload != null && payload.getUserEntityId() != null) {
      if (payload.getUserEntityId() != sessionController.getLoggedUserEntity().getId()) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Update
    
    if (studentCard.getUserEntityId() != sessionController.getLoggedUserEntity().getId() && payload.getId() != studentCard.getId()) {
      return Response.status(Status.FORBIDDEN).build();
    } 
    
    if (studentCard.getActive() == payload.getActive()) {
      return Response.status(Status.OK).build();
    }
    
    BridgeResponse<StudentCard> response = studentCardController.updateActive(sessionController.getLoggedUser(), payload, payload.getActive());
    if (response.ok()) {
      return Response.status(response.getStatusCode()).entity(response.getEntity()).build();
    } else {
      return Response.status(response.getStatusCode()).entity(response.getMessage()).build(); 
    }
   
  }
  
  @GET
  @Path("/studentCard/{STUDENTIDENTIFIER}")
  @RESTPermit(handling = Handling.INLINE)
  public Response getStudentCard(@PathParam ("STUDENTIDENTIFIER") String studentIdentifier) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing student identifier").build();
    }
    
    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
    
    if (schoolDataIdentifier != sessionController.getLoggedUser() || !sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    StudentCard studentCard = studentCardController.getStudentCard(schoolDataIdentifier);

    return Response.ok(studentCard).build();
  }
} 