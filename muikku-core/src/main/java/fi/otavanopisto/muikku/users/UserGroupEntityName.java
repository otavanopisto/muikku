package fi.otavanopisto.muikku.users;

public class UserGroupEntityName {
  
  public UserGroupEntityName(String name, Boolean isGuidanceGroup) {
    this.name = name;
    this.isGuidanceGroup = isGuidanceGroup;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Boolean getIsGuidanceGroup() {
    return isGuidanceGroup;
  }

  public void setIsGuidanceGroup(Boolean isGuidanceGroup) {
    this.isGuidanceGroup = isGuidanceGroup;
  }

  private String name;
  private Boolean isGuidanceGroup;
}
