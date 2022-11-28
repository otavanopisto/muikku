package fi.otavanopisto.muikku.workspaces;

public class WorkspaceEntityName {
  
  public WorkspaceEntityName(String name, String nameExtension) {
    this.setName(name);
    this.setNameExtension(nameExtension);
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  public String getNameExtension() {
    return nameExtension;
  }

  public void setNameExtension(String nameExtension) {
    this.nameExtension = nameExtension;
  }

  public String getDisplayName() {
    return nameExtension == null ? getName() : String.format("%s (%s)", name, nameExtension);
  }

  private String name;
  private String nameExtension;

}
