package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class RestAssignment {
  
  public RestAssignment(Long workspaceMaterialEvaluationId, Long workspaceMaterialId, Long materialId, String path, String title, Boolean evaluable, Date submitted, Date evaluated, String grade) {
    this.workspaceMaterialEvaluationId = workspaceMaterialEvaluationId;
    this.workspaceMaterialId = workspaceMaterialId;
    this.materialId = materialId;
    this.path = path;
    this.title = title;
    this.evaluable = evaluable;
    this.submitted = submitted;
    this.evaluated = evaluated;
    this.grade = grade;
  }

  public Long getWorkspaceMaterialEvaluationId() {
    return workspaceMaterialEvaluationId;
  }

  public void setWorkspaceMaterialEvaluationId(Long workspaceMaterialEvaluationId) {
    this.workspaceMaterialEvaluationId = workspaceMaterialEvaluationId;
  }

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public Boolean getEvaluable() {
    return evaluable;
  }

  public void setEvaluable(Boolean evaluable) {
    this.evaluable = evaluable;
  }

  public Date getSubmitted() {
    return submitted;
  }

  public void setSubmitted(Date submitted) {
    this.submitted = submitted;
  }

  public Date getEvaluated() {
    return evaluated;
  }

  public void setEvaluated(Date evaluated) {
    this.evaluated = evaluated;
  }

  public String getGrade() {
    return grade;
  }

  public void setGrade(String grade) {
    this.grade = grade;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  private Long workspaceMaterialEvaluationId;
  private Long workspaceMaterialId;
  private Long materialId;
  private String path;
  private String title;
  private Boolean evaluable;
  private Date submitted;
  private Date evaluated;
  private String grade;
}
