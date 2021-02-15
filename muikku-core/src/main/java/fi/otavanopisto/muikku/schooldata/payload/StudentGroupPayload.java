package fi.otavanopisto.muikku.schooldata.payload;

public class StudentGroupPayload {

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
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

  private String identifier;
  private String name;
  private Boolean isGuidanceGroup;

}
