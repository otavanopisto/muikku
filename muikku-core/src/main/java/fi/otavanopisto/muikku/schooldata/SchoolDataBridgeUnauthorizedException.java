package fi.otavanopisto.muikku.schooldata;

public class SchoolDataBridgeUnauthorizedException extends SchoolDataBridgeRequestException {

  private static final long serialVersionUID = -5638593821030832894L;

  public SchoolDataBridgeUnauthorizedException(String message) {
    super(message);
  }
}
