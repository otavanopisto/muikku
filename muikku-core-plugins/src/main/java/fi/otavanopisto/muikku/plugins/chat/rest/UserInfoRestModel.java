package fi.otavanopisto.muikku.plugins.chat.rest;

public class UserInfoRestModel {
  
  public UserInfoRestModel() {
  }
  
  public UserInfoRestModel(Long userEntityId, String nick, String name, ChatUserType type) {
    this.userEntityId = userEntityId;
    this.nick = nick;
    this.name = name;
    this.type = type;
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
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public ChatUserType getType() {
    return type;
  }
  
  public void setType(ChatUserType type) {
    this.type = type;
  }
  
  private Long userEntityId;
  private String nick;
  private String name;
  private ChatUserType type;

}
