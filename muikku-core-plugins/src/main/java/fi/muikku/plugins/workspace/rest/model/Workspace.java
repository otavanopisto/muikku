package fi.muikku.plugins.workspace.rest.model;

public class Workspace {

  public Workspace() {
  }

  public Workspace(Long id, String urlName, Boolean archived, String name, String description) {
    super();
    this.id = id;
    this.urlName = urlName;
    this.archived = archived;
    this.name = name;
    this.description = description;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUrlName() {
    return urlName;
  }

  public void setUrlName(String urlName) {
    this.urlName = urlName;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  private Long id;
  private String urlName;
  private Boolean archived;
  private String name;
  private String description;
}
