package fi.otavanopisto.muikku.schooldata;

public class SchoolDataBridgeUnauthorizedException extends SchoolDataBridgeException {

  private static final long serialVersionUID = -5638593821030832894L;

  public SchoolDataBridgeUnauthorizedException(String message) {
    super(403, message);
  }

  public SchoolDataBridgeUnauthorizedException(Throwable rootCause) {
    super(403, rootCause);
  }

}
