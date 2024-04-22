package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceSignupMessageRestModel {

  public WorkspaceSignupMessageRestModel() {
  }

  public WorkspaceSignupMessageRestModel(Long userGroupId, boolean enabled, String caption, String content) {
    this.userGroupId = userGroupId;
    this.enabled = enabled;
    this.caption = caption;
    this.content = content;
  }
  
  public boolean isEnabled() {
    return enabled;
  }
  
  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }
  
  public String getCaption() {
    return caption;
  }
  
  public void setCaption(String caption) {
    this.caption = caption;
  }
  
  public String getContent() {
    return content;
  }
  
  public void setContent(String content) {
    this.content = content;
  }
  
  public Long getUserGroupId() {
    return userGroupId;
  }

  public void setUserGroupId(Long userGroupId) {
    this.userGroupId = userGroupId;
  }

  private Long userGroupId;
  private boolean enabled;
  private String caption;
  private String content;
}
