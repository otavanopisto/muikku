package fi.otavanopisto.muikku.plugins.workspace.events;

public abstract class WorkspaceNodeEvent<T> {
  
  public WorkspaceNodeEvent(T workspaceNode) {
    this.workspaceNode = workspaceNode;
  }
  
  public T getWorkspaceNode() {
    return workspaceNode;
  }
  
  public void setWorkspaceNode(T workspaceNode) {
    this.workspaceNode = workspaceNode;
  }
  
  private T workspaceNode;
}
