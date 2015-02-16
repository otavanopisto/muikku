package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class WorkspaceFolder extends WorkspaceNode {

  @Transient
  public WorkspaceNodeType getType() {
    return WorkspaceNodeType.FOLDER;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public WorkspaceFolderType getFolderType() {
    return folderType;
  }

  public void setFolderType(WorkspaceFolderType folderType) {
    this.folderType = folderType;
  }

  public WorkspaceNode getDefaultMaterial() {
    return defaultMaterial;
  }

  public void setDefaultMaterial(WorkspaceNode defaultMaterial) {
    this.defaultMaterial = defaultMaterial;
  }

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String title;

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private WorkspaceFolderType folderType;

  @ManyToOne
  private WorkspaceNode defaultMaterial;
}
