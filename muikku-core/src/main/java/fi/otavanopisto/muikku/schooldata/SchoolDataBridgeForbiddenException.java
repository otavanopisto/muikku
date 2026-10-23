package fi.otavanopisto.muikku.schooldata;

public class SchoolDataBridgeForbiddenException extends SchoolDataBridgeException {

  private static final long serialVersionUID = -5638593821030832894L;

  public SchoolDataBridgeForbiddenException(String message) {
    super(403, message);
  }

  public SchoolDataBridgeForbiddenException(Throwable rootCause) {
    super(403, rootCause);
  }

}
