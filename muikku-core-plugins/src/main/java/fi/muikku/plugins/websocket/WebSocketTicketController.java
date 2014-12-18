package fi.muikku.plugins.websocket;

import java.util.Date;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

@Dependent
@Stateful
public class WebSocketTicketController {
   
  @Inject
  private WebSocketTicketDAO webSocketTicketDAO;

  public WebSocketTicket createTicket(String ticket, Long user, String ip, Date timestamp) {
    return webSocketTicketDAO.create(ticket, user, ip, timestamp);
  }

  public WebSocketTicket findTicket(String ticket) {
    return webSocketTicketDAO.findByTicket(ticket);
  }

  public void removeTicket(String ticket) {
    WebSocketTicket ticketO = findTicket(ticket);
    webSocketTicketDAO.delete(ticketO);
  }
  
  
}
