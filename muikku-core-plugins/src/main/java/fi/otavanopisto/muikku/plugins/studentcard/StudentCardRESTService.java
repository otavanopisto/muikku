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
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.StudentCard;
import fi.otavanopisto.muikku.schooldata.payload.StudentCardRESTModel;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
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
  
  @Inject
  private UserEntityController userEntityController;
  
  @PUT
  @Path ("/student/{STUDENTIDENTIFIER}/studentCard/{CARDID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateStudentCardActivity(@PathParam ("STUDENTIDENTIFIER") String studentIdentifier, @PathParam ("CARDID") Long cardId, @QueryParam ("active") Boolean active) {
    
    SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(studentIdentifier);
    
    // Access
    
    if (sdi != null && !sessionController.getLoggedUser().equals(sdi) && !sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Find student card
    
    StudentCard studentCard = studentCardController.getStudentCard(sdi);
    
    if (studentCard == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Student card for student %s not found", sdi)).build();
    }
    
    if (!studentCard.getId().equals(cardId)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Update
    
    // Return if active is already same value as in payload
    if (studentCard.getActive().equals(active) || active == null) {
      return Response.status(Status.OK).build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
    
    StudentCardRESTModel restModel = new StudentCardRESTModel();
    
    restModel.setUserEntityId(userEntity.getId());
    restModel.setId(cardId);
    BridgeResponse<StudentCardRESTModel> response = studentCardController.updateActive(sdi, restModel, active);
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

    if (!SchoolDataIdentifier.fromId(studentIdentifier).equals(sessionController.getLoggedUser()) && !sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    StudentCard studentCard = studentCardController.getStudentCard(schoolDataIdentifier);

    return Response.ok(studentCard).build();
  }
} 