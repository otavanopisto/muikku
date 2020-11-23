package fi.otavanopisto.muikku.plugins.chat.rest;

import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;

public class ChatSettingsRESTModel {

  public UserChatVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(UserChatVisibility visibility) {
    this.visibility = visibility;
  }

  public String getNick() {
    return nick;
  }

  public void setNick(String nick) {
    this.nick = nick;
  }

  private UserChatVisibility visibility;
  private String nick;

}
