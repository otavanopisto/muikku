package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.List;

public class WorkspaceSignupMessageRestModel {

  public WorkspaceSignupMessageRestModel() {
  }

  public WorkspaceSignupMessageRestModel(Long id, boolean enabled, String caption, String content, List<WorkspaceSignupGroupRestModel> signupGroups) {
    this.setId(id);
    this.setEnabled(enabled);
    this.setCaption(caption);
    this.setContent(content);
    this.setSignupGroups(signupGroups);
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

  public List<WorkspaceSignupGroupRestModel> getSignupGroups() {
    return signupGroups;
  }

  public void setSignupGroups(List<WorkspaceSignupGroupRestModel> signupGroups) {
    this.signupGroups = signupGroups;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  private Long id;
  private boolean enabled;
  private String caption;
  private String content;
  private List<WorkspaceSignupGroupRestModel> signupGroups;
}
