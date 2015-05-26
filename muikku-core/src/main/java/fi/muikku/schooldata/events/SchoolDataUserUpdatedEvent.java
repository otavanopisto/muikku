package fi.muikku.schooldata.events;

import java.util.List;

public class SchoolDataUserUpdatedEvent {

  public SchoolDataUserUpdatedEvent(String dataSource, String identifier, String defaultDataSource, String defaultIdentifier, List<String> emails) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.defaultDataSource = defaultDataSource;
    this.defaultIdentifier = defaultIdentifier;
    this.emails = emails;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public String getDefaultDataSource() {
    return defaultDataSource;
  }

  public String getDefaultIdentifier() {
    return defaultIdentifier;
  }

  public List<String> getEmails() {
    return emails;
  }

  private String dataSource;
  private String identifier;
  private String defaultDataSource;
  private String defaultIdentifier;
  private List<String> emails;
}
