package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatRoomDeletedRestModel {
  
  public ChatRoomDeletedRestModel() {
  }
  
  public ChatRoomDeletedRestModel(String identifier) {
    this.setIdentifier(identifier);
  }
  
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  private String identifier;
  
}
