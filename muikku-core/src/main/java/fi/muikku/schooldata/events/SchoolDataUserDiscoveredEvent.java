package fi.muikku.schooldata.events;

import java.util.List;

public class SchoolDataUserDiscoveredEvent {

  public SchoolDataUserDiscoveredEvent(String dataSource, String identifier, List<String> emails) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.emails = emails;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public List<String> getEmails() {
    return emails;
  }

  public void setDiscoveredUserEntityId(Long discoveredUserEntityId) {
    this.discoveredUserEntityId = discoveredUserEntityId;
  }
  
  public Long getDiscoveredUserEntityId() {
    return discoveredUserEntityId;
  }

  private String dataSource;
  private String identifier;
  private List<String> emails;
  private Long discoveredUserEntityId;
}
