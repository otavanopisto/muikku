package fi.otavanopisto.muikku.plugins.websocket;

import java.util.Date;
import java.util.UUID;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
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
  private WebSocketTicketController webSocketTicketController;
  
  @Context
  private HttpServletRequest request;
  
  @GET
  @Path ("/ticket")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createTicket() {
    System.out.println("Creating new ticket");
    UserEntity userEntity = sessionController.getLoggedUserEntity(); 
    Long userEntityId = userEntity.getId();
    Date timestamp = new Date();
    String ip = request.getRemoteAddr();
    String ticket = UUID.randomUUID().toString();
    System.out.println("It is " + ticket);
    webSocketTicketController.createTicket(ticket, userEntityId, ip, timestamp);
    return Response.ok(ticket).build();
  }

  @GET
  @Path ("/ticket/{TICKET}/check")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response check(@PathParam("TICKET") String ticketStr) {
    System.out.println("ticket check user is " + sessionController.getLoggedUserIdentifier());
    WebSocketTicket ticket = webSocketTicketController.findTicket(ticketStr);
    if (ticket != null) {
      UserEntity user = sessionController.getLoggedUserEntity(); 
      return user.getId().equals(ticket.getUser()) ? Response.noContent().build() : Response.status(Response.Status.FORBIDDEN).build();
    }
    else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }
  
}
