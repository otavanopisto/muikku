package fi.muikku.security;

public class AuthorizationException extends RuntimeException {

  public AuthorizationException(String message) {
    super(message);
  }

  private static final long serialVersionUID = -4525363454627755218L;

}
