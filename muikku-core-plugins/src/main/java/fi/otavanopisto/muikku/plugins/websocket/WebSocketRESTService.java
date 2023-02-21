package fi.otavanopisto.muikku.plugins.websocket;

import java.util.UUID;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@Path("/websocket")
@RequestScoped
@Produces ("application/json")
public class WebSocketRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8566984492048734313L;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private WebSocketMessenger websocketMessenger;
  
  @GET
  @Path ("/ticket")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createTicket() {
    String ticket = UUID.randomUUID().toString();
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    websocketMessenger.registerTicket(ticket, userEntityId);
    return Response.ok(ticket).build();
  }

  @GET
  @Path ("/ticket/{TICKET}/check")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response check(@PathParam("TICKET") String ticket) {
    WebSocketSessionInfo sessionInfo = websocketMessenger.getSessionInfo(ticket);
    if (sessionInfo != null) {
      UserEntity user = sessionController.getLoggedUserEntity(); 
      return user.getId().equals(sessionInfo.getUserEntityId()) ? Response.noContent().build() : Response.status(Response.Status.FORBIDDEN).build();
    }
    else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }
  
}
