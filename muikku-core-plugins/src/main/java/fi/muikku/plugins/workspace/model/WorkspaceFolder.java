package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
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
  
  @NotEmpty
  @NotNull
  @Column (nullable = false)
  private String title;
}
