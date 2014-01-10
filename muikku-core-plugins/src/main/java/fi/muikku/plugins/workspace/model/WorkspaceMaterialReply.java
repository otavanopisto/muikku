package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class WorkspaceMaterialReply  {

  public Long getId() {
    return id;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public WorkspaceMaterial getWorkspaceMaterial() {
    return workspaceMaterial;
  }
  
  public void setWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    this.workspaceMaterial = workspaceMaterial;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterial workspaceMaterial;

  @NotNull
  @Column (nullable = false)
  private Long userEntityId;
}
