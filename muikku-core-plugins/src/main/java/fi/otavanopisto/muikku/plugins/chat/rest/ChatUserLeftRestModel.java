package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatUserLeftRestModel {
  
  public ChatUserLeftRestModel() {
  }
  
  public ChatUserLeftRestModel(Long id, ChatLeaveType reason) {
    this.id = id;
    this.setReason(reason);
  }
  
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public ChatLeaveType getReason() {
    return reason;
  }

  public void setReason(ChatLeaveType reason) {
    this.reason = reason;
  }

  private Long id;
  private ChatLeaveType reason;

}
