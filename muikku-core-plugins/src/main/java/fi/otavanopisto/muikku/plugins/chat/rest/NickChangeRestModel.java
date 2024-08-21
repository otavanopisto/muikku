package fi.otavanopisto.muikku.plugins.chat.rest;

public class NickChangeRestModel {
  
  public NickChangeRestModel() {
  }
  
  public NickChangeRestModel(Long userEntityId, String nick) {
    this.userEntityId = userEntityId;
    this.nick = nick;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public String getNick() {
    return nick;
  }
  
  public void setNick(String nick) {
    this.nick = nick;
  }
  
  private Long userEntityId;
  private String nick;

}
