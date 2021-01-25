package fi.otavanopisto.muikku.rest.model;

public class UserGroup {

  public UserGroup() {
  }

  public UserGroup(Long id, String name, Long userCount, OrganizationRESTModel organization, boolean guidanceGroup) {
    this.id = id;
    this.name = name;
    this.userCount = userCount;
    this.organization = organization;
    this.guidanceGroup = guidanceGroup;
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

  public Long getUserCount() {
    return userCount;
  }

  public void setUserCount(Long userCount) {
    this.userCount = userCount;
  }

  public OrganizationRESTModel getOrganization() {
    return organization;
  }

  public void setOrganization(OrganizationRESTModel organization) {
    this.organization = organization;
  }

  public boolean isGuidanceGroup() {
    return guidanceGroup;
  }

  public void setGuidanceGroup(boolean guidanceGroup) {
    this.guidanceGroup = guidanceGroup;
  }

  private Long id;
  private String name;
  private Long userCount;
  private OrganizationRESTModel organization;
  private boolean guidanceGroup;
}
