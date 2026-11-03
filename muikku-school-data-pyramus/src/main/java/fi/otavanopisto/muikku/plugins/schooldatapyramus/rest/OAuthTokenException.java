package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

public class OAuthTokenException extends Exception {

  private static final long serialVersionUID = -271711976288873069L;

  public OAuthTokenException(String reason) {
    this.reason = reason;
  }
  
  public String getReason() {
    return reason;
  }

  private final String reason;
}
