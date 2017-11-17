package fi.otavanopisto.muikku.plugins.chat;

public class StatusRESTModel {
  public StatusRESTModel(boolean loggedIn, String mucNickName) {
    super();
    this.enabled = loggedIn;
    this.mucNickName = mucNickName;
  }
  
  public boolean isEnabled() {
    return enabled;
  }
  
  public String getMucNickName() {
    return mucNickName;
  }

  private final String mucNickName;
  private final boolean enabled;
}
