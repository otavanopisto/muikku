package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

// This thing is not thrown anywhere, but it's caught in few places, what's going on?
public class PyramusRestClientUnauthorizedException extends RuntimeException {

  private static final long serialVersionUID = 8308910988572195475L;

  public PyramusRestClientUnauthorizedException(String message) {
    super(message);
  }
}
