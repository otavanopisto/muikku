package fi.muikku.session;

public class AlternativeIdentity {

  public AlternativeIdentity(String displayName, String identifier, String schoolDataSource) {
    super();
    this.displayName = displayName;
    this.identifier = identifier;
    this.schoolDataSource = schoolDataSource;
  }

  public String getDisplayName() {
    return displayName;
  }

  public String getIdentifier() {
    return identifier;
  }

  public String getSchoolDataSource() {
    return schoolDataSource;
  }

  private String displayName;
  private String identifier;
  private String schoolDataSource;
}