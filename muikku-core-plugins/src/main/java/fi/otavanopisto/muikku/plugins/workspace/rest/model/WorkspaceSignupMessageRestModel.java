package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceSignupMessageRestModel {

  public WorkspaceSignupMessageRestModel() {
  }

  public WorkspaceSignupMessageRestModel(boolean enabled, String caption, String content) {
    this.setEnabled(enabled);
    this.setCaption(caption);
    this.setContent(content);
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

  private boolean enabled;
  private String caption;
  private String content;
}
