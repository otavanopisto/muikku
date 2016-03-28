package fi.otavanopisto.muikku.plugins.websocket;

public class WebSocketTicketRESTModel {

  public WebSocketTicketRESTModel(String ticket) {
    this.ticket = ticket;
  }
  
  public String getTicket() {
    return ticket;
  }

  public void setTicket(String ticket) {
    this.ticket = ticket;
  }

  private String ticket;
}
