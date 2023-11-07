package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatUserRestModel {
  
  public ChatUserRestModel() {
  }

  public ChatUserRestModel(Long id, String nick, String name, ChatUserType type, boolean hasImage, boolean isOnline) {
    this.id = id;
    this.nick = nick;
    this.name = name;
    this.type = type;
    this.hasImage = hasImage;
    this.isOnline = isOnline;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public String getIdentifier() {
    return "user-" + id;
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
  
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Boolean getHasImage() {
    return hasImage;
  }

  public void setHasImage(Boolean hasImage) {
    this.hasImage = hasImage;
  }

  public Boolean getIsOnline() {
    return isOnline;
  }

  public void setIsOnline(Boolean isOnline) {
    this.isOnline = isOnline;
  }

  private Long id;
  private String nick;
  private String name;
  private ChatUserType type;
  private Boolean hasImage;
  private Boolean isOnline;

}
