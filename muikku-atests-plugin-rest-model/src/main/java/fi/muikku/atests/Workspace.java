package fi.muikku.atests;

public class Workspace {

  public Workspace() {
  }

  public Workspace(Long id, String name, String urlName, String schoolDataSource, String identifier, Boolean published) {
    super();
    this.id = id;
    this.name = name;
    this.urlName = urlName;
    this.schoolDataSource = schoolDataSource;
    this.identifier = identifier;
    this.published = published;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getUrlName() {
    return urlName;
  }
  
  public void setUrlName(String urlName) {
    this.urlName = urlName;
  }
  
  public String getSchoolDataSource() {
    return schoolDataSource;
  }
  
  public void setSchoolDataSource(String schoolDataSource) {
    this.schoolDataSource = schoolDataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public Boolean getPublished() {
    return published;
  }

  public void setPublished(Boolean published) {
    this.published = published;
  }

  private Long id;
  private String urlName;
  private String name;
  private String schoolDataSource;
  private String identifier;
  private Boolean published;
}
