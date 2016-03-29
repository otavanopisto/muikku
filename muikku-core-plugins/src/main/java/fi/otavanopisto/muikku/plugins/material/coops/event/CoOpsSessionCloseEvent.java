package fi.otavanopisto.muikku.plugins.material.coops.event;

public class CoOpsSessionCloseEvent {

  public CoOpsSessionCloseEvent(String sessionId) {
    super();
    this.sessionId = sessionId;
  }

  public String getSessionId() {
    return sessionId;
  }

  private String sessionId;
}
