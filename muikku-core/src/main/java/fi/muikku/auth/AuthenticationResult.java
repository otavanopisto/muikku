package fi.muikku.auth;

public class AuthenticationResult {
  
  public AuthenticationResult(Status status) {
    this(status, null);
  }
  
  public AuthenticationResult(Status status, String redirectUrl) {
    this.status = status;
    this.redirectUrl = redirectUrl;
  }
  
  public String getRedirectUrl() {
    return redirectUrl;
  }
  
  public void setRedirectUrl(String redirectUrl) {
    this.redirectUrl = redirectUrl;
  }
  
  public Status getStatus() {
    return status;
  }
  
  public void setStatus(Status status) {
    this.status = status;
  }
  
  private Status status;
  private String redirectUrl;
  
  public static enum Status {
    PROCESSING,
    GRANT,
    LOGIN,
    NEW_ACCOUNT
  }
  
}
