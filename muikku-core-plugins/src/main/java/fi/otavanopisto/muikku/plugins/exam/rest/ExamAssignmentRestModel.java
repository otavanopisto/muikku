package fi.otavanopisto.muikku.plugins.exam.rest;

public class ExamAssignmentRestModel {
  
  public ExamAssignmentRestModel() {
  }

  public ExamAssignmentRestModel(String name, Double points) {
    this.name = name;
    this.points = points;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Double getPoints() {
    return points;
  }

  public void setPoints(Double points) {
    this.points = points;
  }

  private String name;
  private Double points;

}
