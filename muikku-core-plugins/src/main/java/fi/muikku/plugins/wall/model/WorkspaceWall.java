package fi.muikku.plugins.wall.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceWall extends Wall {

  public Long getWorkspace() {
    return workspace;
  }

  public void setWorkspace(Long workspace) {
    this.workspace = workspace;
  }

  @Override
  @Transient
  public WallType getWallType() {
    return WallType.WORKSPACE;
  }
  
  @Column (name = "workspace_id")
  private Long workspace;
}
