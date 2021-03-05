package fi.otavanopisto.muikku.search;

public class WorkspaceSignupPermissionsSynchronizeEvent {
  
  public WorkspaceSignupPermissionsSynchronizeEvent(boolean resume) {
    this.resume = resume;
  }
  
  public boolean isResume() {
    return resume;
  }

  public void setResume(boolean resume) {
    this.resume = resume;
  }

  private boolean resume;
}
