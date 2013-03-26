package fi.muikku.session;

public interface SessionControllerDelegate extends SessionController, MutableSessionController {

  public void setImplementation(SessionController implementation);
  
}
