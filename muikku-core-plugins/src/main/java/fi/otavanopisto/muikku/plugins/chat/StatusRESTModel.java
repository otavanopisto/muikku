package fi.otavanopisto.muikku.plugins.chat;

public class StatusRESTModel {
  public StatusRESTModel(boolean loggedIn) {
    super();
    this.enabled = loggedIn;
  }
  
  public boolean isEnabled() {
    return enabled;
  }

  private final boolean enabled;
}
