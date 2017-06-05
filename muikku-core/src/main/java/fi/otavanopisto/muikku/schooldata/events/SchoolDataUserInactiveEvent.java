package fi.otavanopisto.muikku.schooldata.events;

public class SchoolDataUserInactiveEvent {

  public SchoolDataUserInactiveEvent(String dataSource, String identifier) {
    this.dataSource = dataSource;
    this.identifier = identifier;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  private String dataSource;
  private String identifier;

}

