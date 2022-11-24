package fi.otavanopisto.muikku.plugins.workspacenotes.rest;

public class WorkspaceNoteRestModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getWorkspaceNote() {
    return workspaceNote;
  }

  public void setWorkspaceNote(String workspaceNote) {
    this.workspaceNote = workspaceNote;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Long getOwner() {
    return owner;
  }

  public void setOwner(Long owner) {
    this.owner = owner;
  }

  public Boolean getIsArchived() {
    return isArchived;
  }

  public void setIsArchived(Boolean isArchived) {
    this.isArchived = isArchived;
  }

  private Long id;
  private String title;
  private String workspaceNote;
  private Long workspaceEntityId;
  private Long owner;
  private Boolean isArchived;

}