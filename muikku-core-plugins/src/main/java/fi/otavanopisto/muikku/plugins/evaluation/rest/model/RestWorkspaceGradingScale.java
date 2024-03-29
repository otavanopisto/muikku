package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.List;

public class RestWorkspaceGradingScale {

  public RestWorkspaceGradingScale(String name, String id, String dataSource, List<RestWorkspaceGrade> grades, boolean active) {
    super();
    this.name = name;
    this.id = id;
    this.dataSource = dataSource;
    this.grades = grades;
    this.active = active;
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

  public List<RestWorkspaceGrade> getGrades() {
    return grades;
  }

  public void setGrades(List<RestWorkspaceGrade> grades) {
    this.grades = grades;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  private String name;
  private String id;
  private String dataSource;
  private List<RestWorkspaceGrade> grades;
  private boolean active;
}
