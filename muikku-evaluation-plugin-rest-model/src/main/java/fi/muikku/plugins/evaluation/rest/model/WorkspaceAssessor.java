package fi.muikku.plugins.evaluation.rest.model;

public class WorkspaceAssessor {

  public WorkspaceAssessor(String displayName, long userEntityId, boolean selected) {
    super();
    this.displayName = displayName;
    this.userEntityId = userEntityId;
    this.selected = selected;
  }
  
  public String getDisplayName() {
    return displayName;
  }
  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }
  public long getUserEntityId() {
    return userEntityId;
  }
  public void setUserEntityId(long userEntityId) {
    this.userEntityId = userEntityId;
  }
  public boolean isSelected() {
    return selected;
  }
  public void setSelected(boolean selected) {
    this.selected = selected;
  }

  private String displayName;
  private long userEntityId;
  private boolean selected;
}
