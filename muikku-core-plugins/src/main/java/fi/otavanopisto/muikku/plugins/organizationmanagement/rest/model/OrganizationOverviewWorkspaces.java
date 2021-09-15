package fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model;

public class OrganizationOverviewWorkspaces {

  public OrganizationOverviewWorkspaces() {
  }

  public OrganizationOverviewWorkspaces(int unpublishedCount, int publishedCount){
    super();
    this.unpublishedCount = unpublishedCount;
    this.publishedCount = publishedCount;
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
  
  private int unpublishedCount;
  private int publishedCount;
}
