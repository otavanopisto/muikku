package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceFolder extends WorkspaceNode {

  @Transient
  public WorkspaceNodeType getType() {
    return WorkspaceNodeType.FOLDER;
  }
  
}
