package fi.muikku.schooldata;

public class SchoolDataIdentifier {

  public SchoolDataIdentifier(String identifier, String dataSource) {
    super();
    this.identifier = identifier;
    this.dataSource = dataSource;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  @Override
  public String toString() {
    return String.format("%s/%s", getDataSource(), getIdentifier());
  }

  private String identifier;
  private String dataSource;
}
