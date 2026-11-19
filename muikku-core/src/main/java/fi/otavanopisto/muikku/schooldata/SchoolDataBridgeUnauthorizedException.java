package fi.otavanopisto.muikku.schooldata;

/**
 * SchoolDataBridgeException for HTTP 401.
 */
public class SchoolDataBridgeUnauthorizedException extends SchoolDataBridgeException {

  private static final long serialVersionUID = -5386085918578921089L;

  public SchoolDataBridgeUnauthorizedException(String message) {
    super(401, message);
  }

  public SchoolDataBridgeUnauthorizedException(Throwable rootCause) {
    super(401, rootCause);
  }

}
