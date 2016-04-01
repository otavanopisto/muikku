package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceMaterialProducer {
  
  public WorkspaceMaterialProducer() {
  }

  public WorkspaceMaterialProducer(Long id, Long workspaceEntityId, String name) {
    super();
    this.id = id;
    this.workspaceEntityId = workspaceEntityId;
    this.name = name;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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

  private Long id;
  private Long workspaceEntityId;
  private String name;
}
