package fi.otavanopisto.muikku.plugins.chat.rest;

import com.fasterxml.jackson.annotation.JsonProperty;

import fi.otavanopisto.muikku.plugins.chat.model.ChatUserVisibility;

public class ChatUserRestModel {
  
  public ChatUserRestModel() {
  }
  
  public ChatUserRestModel(ChatUserRestModel chatUser) {
    this.id = chatUser.id;
    this.nick = chatUser.nick;
    this.name = chatUser.name;
    this.type = chatUser.type;
    this.visibility = chatUser.visibility;
    this.hasImage = chatUser.hasImage;
    this.isOnline = chatUser.isOnline;
  }

  public ChatUserRestModel(Long id, String nick, String name, ChatUserType type, ChatUserVisibility visibility, boolean hasImage, boolean isOnline) {
    this.id = id;
    this.nick = nick;
    this.name = name;
    this.type = type;
    this.hasImage = hasImage;
    this.visibility = visibility;
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

  public ChatUserVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(ChatUserVisibility visibility) {
    this.visibility = visibility;
  }

  private Long id;
  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private String identifier;
  private String nick;
  private String name;
  private ChatUserType type;
  private ChatUserVisibility visibility;
  private Boolean hasImage;
  private Boolean isOnline;

}
