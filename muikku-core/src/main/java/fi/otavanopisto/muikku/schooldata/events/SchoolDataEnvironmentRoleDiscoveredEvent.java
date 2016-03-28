package fi.otavanopisto.muikku.schooldata.events;

import fi.otavanopisto.muikku.schooldata.entity.EnvironmentRoleArchetype;

public class SchoolDataEnvironmentRoleDiscoveredEvent {

  public SchoolDataEnvironmentRoleDiscoveredEvent(String dataSource, String identifier, EnvironmentRoleArchetype archetype, String name) {
    super();
    this.dataSource = dataSource;
    this.identifier = identifier;
    this.archetype = archetype;
    this.name = name;
  }

  public String getDataSource() {
    return dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public EnvironmentRoleArchetype getArchetype() {
    return archetype;
  }
  
  public String getName() {
    return name;
  }
 
  public Long getDiscoveredEnvironmentRoleEntityId() {
    return discoveredEnvironmentRoleEntityId;
  }
  
  public void setDiscoveredEnvironmentRoleEntityId(Long discoveredEnvironmentRoleEntityId) {
    this.discoveredEnvironmentRoleEntityId = discoveredEnvironmentRoleEntityId;
  }
  
  private String dataSource;
  private String identifier;
  private EnvironmentRoleArchetype archetype;
  private String name;
  private Long discoveredEnvironmentRoleEntityId;
}
