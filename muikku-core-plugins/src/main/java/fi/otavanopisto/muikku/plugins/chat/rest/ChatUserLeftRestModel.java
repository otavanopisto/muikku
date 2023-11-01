package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatUserLeftRestModel {
  
  public ChatUserLeftRestModel() {
  }
  
  public ChatUserLeftRestModel(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long id) {
    this.userEntityId = id;
  }

  private Long userEntityId;

}
