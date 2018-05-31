package fi.otavanopisto.muikku.plugins.chat;

public class StatusRESTModel {
public StatusRESTModel(boolean loggedIn, boolean chatSettingsVisible, String mucNickName) {
    super();
    this.enabled = loggedIn;
    this.chatSettingsVisible = chatSettingsVisible;
    this.mucNickName = mucNickName;
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

  private final String mucNickName;
  private final boolean chatSettingsVisible;
  private final boolean enabled;
}
