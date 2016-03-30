package fi.otavanopisto.muikku.plugins.material.coops;

public class CoOpsSessionEvent {
  
  public CoOpsSessionEvent(String sessionId, String displayName, String email, String status) {
    this.sessionId = sessionId;
    this.displayName = displayName;
    this.email = email;
    this.status = status;
  }

  public String getSessionId() {
    return sessionId;
  }
  
  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }
  
  public String getDisplayName() {
    return displayName;
  }
  
  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }
  
  public String getEmail() {
    return email;
  }
  
  public void setEmail(String email) {
    this.email = email;
  }
  
  public String getStatus() {
    return status;
  }
  
  public void setStatus(String status) {
    this.status = status;
  }
  
  private String sessionId;
  private String displayName;
  private String email;
  private String status;
}