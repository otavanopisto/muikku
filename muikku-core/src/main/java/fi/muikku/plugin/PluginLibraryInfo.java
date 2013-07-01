package fi.muikku.plugin;

public class PluginLibraryInfo {

  public PluginLibraryInfo(String groupId, String artifactId, String version) {
    this.groupId = groupId;
    this.artifactId = artifactId;
    this.version = version;
  }
  
  public String getArtifactId() {
    return artifactId;
  }
  
  public String getGroupId() {
    return groupId;
  }
  
  public String getVersion() {
    return version;
  }

  @Override
  public String toString() {
    return groupId + '.' + artifactId + ':' + version;
  }

  private String groupId;
  private String artifactId;
  private String version;
}
