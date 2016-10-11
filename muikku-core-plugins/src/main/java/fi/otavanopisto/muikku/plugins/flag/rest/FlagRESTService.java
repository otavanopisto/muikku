package fi.otavanopisto.muikku.plugins.flag.rest;

import java.util.Objects;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.FlagController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("flag")
@Stateful
@RequestScoped
@Produces ("application/json")
public class FlagRESTService extends PluginRESTService {

  private static final long serialVersionUID = 687114723532731651L;

  
  @Inject
  private FlagController flagController;
  
  @Inject
  private SessionController sessionController;
  
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @DELETE
  @RESTPermit(requireLoggedIn = true, handling = Handling.INLINE)
  @Path("/flags/{ID}")
  public Response deleteFlag(@PathParam("ID") long flagId) {
    Flag flag = flagController.findFlagById(flagId);

    if (flag == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    boolean isOwner = false;
    UserSchoolDataIdentifier ownerIdentifier = flag.getOwnerIdentifier();
    SchoolDataIdentifier loggedIdentifier = sessionController.getLoggedUser();
    if (loggedIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Must be logged in.").build();
    }

    UserSchoolDataIdentifier loggedUserIdentifier =
        userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(
            loggedIdentifier);
    
    if (loggedUserIdentifier == null) {
      return Response
                .status(Status.BAD_REQUEST)
                .entity("No user school data identifier for logged user")
                .build();
    }
    
    if (Objects.equals(ownerIdentifier.getIdentifier(), loggedUserIdentifier.getIdentifier())) {
      isOwner = true;
    }
    
    if (!flagController.hasFlagPermission(flag, loggedIdentifier)) {
      return Response
                  .status(Status.FORBIDDEN)
                  .entity("You don't have the permission to delete this flag")
                  .build();
    }

    if (isOwner) {
      flagController.deleteFlagCascade(flag);
      return Response.noContent().build();
    } else {
      flagController.unshareFlag(flag, loggedUserIdentifier);
      return Response.noContent().build();
    }
  }
}
