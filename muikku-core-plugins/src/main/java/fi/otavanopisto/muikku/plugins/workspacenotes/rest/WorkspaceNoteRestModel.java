package fi.otavanopisto.muikku.plugins.workspacenotes.rest;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNoteType;

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

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
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

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public String getStart() {
    return start;
  }

  public void setStart(String start) {
    this.start = start;
  }

  public String getEnd() {
    return end;
  }

  public void setEnd(String end) {
    this.end = end;
  }

  public Long getIndex() {
    return index;
  }

  public void setIndex(Long index) {
    this.index = index;
  }

  public WorkspaceNoteType getType() {
    return type;
  }

  public void setType(WorkspaceNoteType type) {
    this.type = type;
  }

  private Long id;
  private String title;
  private String text;
  private Long workspaceEntityId;
  private Long owner;
  private Long workspaceMaterialId;
  private String start;
  private String end;
  private Long index;
  private WorkspaceNoteType type;

}