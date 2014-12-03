package fi.muikku.plugins.material.coops.event;

public class CoOpsSessionOpenEvent {

  public CoOpsSessionOpenEvent(String sessionId) {
    super();
    this.sessionId = sessionId;
  }

  public String getSessionId() {
    return sessionId;
  }

  private String sessionId;
}
