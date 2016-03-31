package fi.otavanopisto.muikku.schooldata.events;

import java.util.Map;

public class SchoolDataWorkspaceUpdatedEvent {

  public SchoolDataWorkspaceUpdatedEvent(String dataSource, String identifier, String name, Map<String, Object> extra) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.name = name;
    this.extra = extra;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public String getName() {
    return name;
  }
  
  public Map<String, Object> getExtra() {
    return extra;
  }

  private String dataSource;
  private String identifier;
  private String name;
  private Map<String, Object> extra;
}
