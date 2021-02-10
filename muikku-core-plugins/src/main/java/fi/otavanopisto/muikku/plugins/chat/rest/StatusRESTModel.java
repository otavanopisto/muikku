package fi.otavanopisto.muikku.plugins.chat.rest;

public class StatusRESTModel {
public StatusRESTModel(boolean loggedIn, boolean chatSettingsVisible, String mucNickName, String nick) {
    super();
    this.enabled = loggedIn;
    this.chatSettingsVisible = chatSettingsVisible;
    this.mucNickName = mucNickName;
    this.nick = nick;
  }
  
  public boolean isEnabled() {
    return enabled;
  }
  
  public boolean isChatSettingsVisible() {
	return chatSettingsVisible;
  }
  
  public String getMucNickName() {
    return mucNickName;
  }
  
  public String getNick() {
    return nick;
  }

  private final String mucNickName;
  private final String nick;
  private final boolean chatSettingsVisible;
  private final boolean enabled;
}
