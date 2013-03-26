package fi.muikku.session;

public interface MutableSessionController {
  /**
   * Sets current environment by id
   * 
   * @param environment environment
   */
  public void setEnvironmentId(Long environmentId);
}
