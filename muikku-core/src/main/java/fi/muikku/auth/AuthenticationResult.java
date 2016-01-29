package fi.muikku.auth;

public class AuthenticationResult {
  
  public AuthenticationResult(Status status) {
    this(status, null, null);
  }

  public AuthenticationResult(Status status, String redirectUrl) {
    this(status, redirectUrl, null);
  }

  public AuthenticationResult(Status status, ConflictReason conflictReason) {
    this(status, null, conflictReason);
  }
  
  public AuthenticationResult(Status status, String redirectUrl, ConflictReason conflictReason) {
    this.status = status;
    this.redirectUrl = redirectUrl;
    this.conflictReason = conflictReason;
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
  
  public void setConflictReason(ConflictReason conflictReason) {
    this.conflictReason = conflictReason;
  }
  
  public ConflictReason getConflictReason() {
    return conflictReason;
  }
  
  private Status status;
  private String redirectUrl;
  private ConflictReason conflictReason;
  
  public static enum Status {
    PROCESSING,
    GRANT,
    LOGIN,
    NEW_ACCOUNT,
    CONFLICT, 
    INVALID_CREDENTIALS, 
    NO_EMAIL,
    ERROR
  }
  
  public static enum ConflictReason {
    EMAIL_BELONGS_TO_ANOTHER_USER,
    SEVERAL_USERS_BY_EMAILS,
    LOGGED_IN_AS_DIFFERENT_USER
    
  }
  
}
