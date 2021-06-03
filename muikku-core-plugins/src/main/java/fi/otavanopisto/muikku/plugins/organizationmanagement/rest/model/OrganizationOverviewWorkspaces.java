package fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model;

import java.util.List;

import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;

public class OrganizationOverviewWorkspaces {

  public OrganizationOverviewWorkspaces() {
  }

  public OrganizationOverviewWorkspaces(
      int unpublishedCount,
      int publishedCount,
      List<OrganizationManagerWorkspace> workspaces) {
    super();
    this.unpublishedCount = unpublishedCount;
    this.publishedCount = publishedCount;
    this.workspaces = workspaces;
  }

  public Integer getUnpublishedCount() {
    return unpublishedCount;
  }

  public void setUnpublishedCount(Integer unpublishedCount) {
    this.unpublishedCount = unpublishedCount;
  }
  
  public int getPublishedCount() {
    return publishedCount;
  }

  public void setPublishedCount(int publishedCount) {
    this.publishedCount = publishedCount;
  }

  public List<OrganizationManagerWorkspace> getWorkspaces() {
    return workspaces;
  }

  public void setWorkspaces(List<OrganizationManagerWorkspace> workspaces) {
    this.workspaces = workspaces;
  }

  private int unpublishedCount;
  private int publishedCount;
  private List<OrganizationManagerWorkspace> workspaces;
}
