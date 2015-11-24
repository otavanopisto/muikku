package fi.muikku.plugins.evaluation.rest.model;

public class WorkspaceGrade {

  public WorkspaceGrade(String name, String id, String dataSource) {
    super();
    this.name = name;
    this.id = id;
    this.dataSource = dataSource;
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  public String getDataSource() {
    return dataSource;
  }
  public void setDataSource(String dataSource) {
    this.dataSource = dataSource;
  }

  private String name;
  private String id;
  private String dataSource;
}
