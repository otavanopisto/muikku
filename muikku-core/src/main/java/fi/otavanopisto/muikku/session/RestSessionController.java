package fi.otavanopisto.muikku.session;

public interface RestSessionController extends SessionController, MutableSessionController {
  
  public void setAuthentication(RestAuthentication authentication);
  
}
