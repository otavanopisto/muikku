package fi.muikku.plugins.websocket;

import java.util.Date;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.session.SessionController;

@Path("/websocket")
@RequestScoped
@Stateful
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
  public Response ticket() {
    UserEntity user = sessionController.getLoggedUserEntity(); 

    Long userId = user != null ? user.getId() : null;
    Date timestamp = new Date();
    // TODO: Proxy?
    String ip = request.getRemoteAddr();
    
    String ticket = DigestUtils.md5Hex(Long.toString(timestamp.getTime()) + ":" + ip + ":" + userId);
    
    webSocketTicketController.createTicket(ticket, userId, ip, timestamp);
    
    return Response.ok(new WebSocketTicketRESTModel(ticket)).build();
  }

}
