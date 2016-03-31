package fi.otavanopisto.muikku.auth;

public class AuthenticationHandleException extends Exception {

  private static final long serialVersionUID = -4328233264797797120L;

  public AuthenticationHandleException(String message) {
    super(message);
  }
  
  public AuthenticationHandleException(Throwable cause) {
    super(cause);
  }

}
