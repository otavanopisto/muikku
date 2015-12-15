package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = {"name", "workspaceEntityId"})   
  }
)
public class WorkspaceToolSettings {

  public Long getId() {
    return id;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Boolean getVisible() {
    return visible;
  }

  public void setVisible(Boolean visible) {
    this.visible = visible;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column(nullable = false)
  @NotEmpty
  private String name;
  
  @NotNull
  @Column(nullable = false)
  private Boolean visible;

  @NotNull
  @Column(nullable = false)
  private Long workspaceEntityId;

}
