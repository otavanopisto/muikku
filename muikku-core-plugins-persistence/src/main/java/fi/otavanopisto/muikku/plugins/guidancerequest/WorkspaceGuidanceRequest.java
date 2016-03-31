package fi.otavanopisto.muikku.plugins.guidancerequest;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class WorkspaceGuidanceRequest extends GuidanceRequest {

  public Long getWorkspace() {
    return workspace;
  }

  public void setWorkspace(Long workspace) {
    this.workspace = workspace;
  }

  @Column (name = "workspace_id")
  private Long workspace;
}
