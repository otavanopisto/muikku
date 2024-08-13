package fi.otavanopisto.muikku.plugins.chat.rest;

import fi.otavanopisto.muikku.plugins.chat.model.ChatUserVisibility;

public class ChatSettingsRestModel {

  public ChatUserVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(ChatUserVisibility visibility) {
    this.visibility = visibility;
  }

  public String getNick() {
    return nick;
  }

  public void setNick(String nick) {
    this.nick = nick;
  }

  private ChatUserVisibility visibility;
  private String nick;

}
