package fi.otavanopisto.muikku.plugins.websocket;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.websocket.WebSocketTicket;

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

  public void removeAllTickets() {
    List<WebSocketTicket> tickets = webSocketTicketDAO.listAll();
    for (WebSocketTicket ticket : tickets) {
      webSocketTicketDAO.delete(ticket);
    }
  }
  
}
