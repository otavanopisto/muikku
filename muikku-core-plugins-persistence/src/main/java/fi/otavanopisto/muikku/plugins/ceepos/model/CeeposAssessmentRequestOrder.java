package fi.otavanopisto.muikku.plugins.ceepos.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CeeposAssessmentRequestOrder extends CeeposOrder {
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public String getRequestText() {
    return requestText;
  }

  public void setRequestText(String requestText) {
    this.requestText = requestText;
  }

  @NotNull
  @Column(nullable = false)
  private Long workspaceEntityId;

  @Column(columnDefinition = "mediumtext")
  private String requestText;
  
}
