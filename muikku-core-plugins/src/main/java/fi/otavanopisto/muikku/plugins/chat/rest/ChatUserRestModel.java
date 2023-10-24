package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatUserRestModel {
  
  public ChatUserRestModel() {
  }

  public ChatUserRestModel(Long id, String nick, ChatUserType type) {
    this.id = id;
    this.nick = nick;
    this.type = type;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public String getNick() {
    return nick;
  }
  
  public void setNick(String nick) {
    this.nick = nick;
  }
  
  public ChatUserType getType() {
    return type;
  }
  
  public void setType(ChatUserType type) {
    this.type = type;
  }
  
  private Long id;
  private String nick;
  private ChatUserType type;

}
