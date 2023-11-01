package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatUserLeftRestModel {
  
  public ChatUserLeftRestModel() {
  }
  
  public ChatUserLeftRestModel(Long id) {
    this.id = id;
  }
  
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  private Long id;

}
