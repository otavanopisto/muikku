package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

public class PyramusRestClientUnauthorizedException extends RuntimeException {

  private static final long serialVersionUID = 8308910988572195475L;

  public PyramusRestClientUnauthorizedException(String message) {
    super(message);
  }
}
