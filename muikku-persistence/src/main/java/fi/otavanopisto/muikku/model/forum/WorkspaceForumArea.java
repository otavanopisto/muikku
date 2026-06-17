package fi.otavanopisto.muikku.model.forum;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceForumArea extends ForumArea {

  public Long getWorkspace() {
    return workspace;
  }

  public void setWorkspace(Long workspace) {
    this.workspace = workspace;
  }
  
  @Column (name = "workspace_id")
  private Long workspace;
}
