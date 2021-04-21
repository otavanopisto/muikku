package fi.otavanopisto.muikku.schooldata.events;

import java.util.Map;

public class SchoolDataUserGroupDiscoveredEvent {

  public SchoolDataUserGroupDiscoveredEvent(String dataSource, String identifier, Map<String, Object> extra) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.extra = extra;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public Long getDiscoveredUserGroupEntityId() {
    return discoveredUserGroupEntityId;
  }

  public void setDiscoveredUserGroupEntityId(Long discoveredUserGroupEntityId) {
    this.discoveredUserGroupEntityId = discoveredUserGroupEntityId;
  }

  public Map<String, Object> getExtra() {
    return extra;
  }

  public void setExtra(Map<String, Object> extra) {
    this.extra = extra;
  }

  private String dataSource;
  private String identifier;
  private Long discoveredUserGroupEntityId;
  private Map<String, Object> extra;

}
