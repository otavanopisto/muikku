package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class WorkspaceMaterialProducer {
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }
  
  public WorkspaceEntity getWorkspaceEntity() {
    return workspaceEntity;
  }
  
  public void setWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    this.workspaceEntity = workspaceEntity;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceEntity workspaceEntity;

  @NotNull
  @NotEmpty
  private String name;
}
