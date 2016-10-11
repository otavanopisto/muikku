package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class WorkspaceFolder extends WorkspaceNode {

  @Transient
  public WorkspaceNodeType getType() {
    return WorkspaceNodeType.FOLDER;
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

  public MaterialViewRestrict getViewRestrict() {
    return viewRestrict;
  }
  
  public void setViewRestrict(MaterialViewRestrict viewRestrict) {
    this.viewRestrict = viewRestrict;
  }

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private WorkspaceFolderType folderType;

  @ManyToOne
  private WorkspaceNode defaultMaterial;

  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private MaterialViewRestrict viewRestrict;
}
