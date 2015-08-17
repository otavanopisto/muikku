package fi.muikku.plugins.forum.rest;


public class WorkspaceForumAreaRESTModel extends ForumAreaRESTModel {

  public WorkspaceForumAreaRESTModel() {
    
  }
  
  public WorkspaceForumAreaRESTModel(Long id, Long workspaceId, String name, Long groupId, Long numThreads) {
    super(id, name, groupId, numThreads);
    this.workspaceId = workspaceId;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  private Long workspaceId;
}
