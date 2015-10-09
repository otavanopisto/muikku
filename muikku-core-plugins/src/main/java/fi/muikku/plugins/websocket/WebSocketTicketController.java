package fi.muikku.plugins.websocket;

import java.util.Date;

import javax.inject.Inject;

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
    WebSocketTicket webSocketTicket = findTicket(ticket);
    if (webSocketTicket != null) {
      webSocketTicketDAO.delete(webSocketTicket);
    }
  }
  
}
