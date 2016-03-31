package fi.otavanopisto.muikku.plugins.workspace;

public class WorkspaceMaterialDeleteError {

  public WorkspaceMaterialDeleteError() {
  }

  public WorkspaceMaterialDeleteError(Reason reason) {
    super();
    this.reason = reason;
  }

  public Reason getReason() {
    return reason;
  }

  public void setReason(Reason reason) {
    this.reason = reason;
  }

  private Reason reason;

  public enum Reason {
    CONTAINS_ANSWERS
  }
}