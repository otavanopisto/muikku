package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

public class RestEvaluablesLock {

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public boolean getLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }

  private Long workspaceMaterialId;
  private boolean locked;

}
