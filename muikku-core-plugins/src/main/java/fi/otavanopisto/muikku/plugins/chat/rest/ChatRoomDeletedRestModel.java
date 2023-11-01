package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatRoomDeletedRestModel {
  
  public ChatRoomDeletedRestModel() {
  }
  
  public ChatRoomDeletedRestModel(Long id) {
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
