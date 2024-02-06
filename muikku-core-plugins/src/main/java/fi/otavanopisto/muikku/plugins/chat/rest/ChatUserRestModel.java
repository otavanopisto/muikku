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
    this.presence = chatUser.presence;
  }

  public ChatUserRestModel(Long id, String nick, String name, ChatUserType type, ChatUserVisibility visibility, boolean hasImage, ChatUserPresence presence) {
    this.id = id;
    this.nick = nick;
    this.name = name;
    this.type = type;
    this.hasImage = hasImage;
    this.visibility = visibility;
    this.presence = presence;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
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

  public ChatUserVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(ChatUserVisibility visibility) {
    this.visibility = visibility;
  }

  public ChatUserPresence getPresence() {
    return presence;
  }

  public void setPresence(ChatUserPresence presence) {
    this.presence = presence;
  }

  private Long id;
  private String nick;
  private String name;
  private ChatUserType type;
  private ChatUserVisibility visibility;
  private Boolean hasImage;
  private ChatUserPresence presence;

}
