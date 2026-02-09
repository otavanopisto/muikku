package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class RestAssessment {
  
  public RestAssessment() {
  }

  public RestAssessment(
      String identifier,
      String assessorIdentifier,
      String gradingScaleIdentifier,
      String gradeIdentifier,
      String verbalAssessment,
      Date assessmentDate,
      Boolean passing,
      Double points) {
    this.identifier = identifier;
    this.assessorIdentifier = assessorIdentifier;
    this.gradingScaleIdentifier = gradingScaleIdentifier;
    this.gradeIdentifier = gradeIdentifier;
    this.verbalAssessment = verbalAssessment;
    this.assessmentDate = assessmentDate;
    this.passing = passing;
    this.points = points;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public String getAssessorIdentifier() {
    return assessorIdentifier;
  }

  public void setAssessorIdentifier(String assessorIdentifier) {
    this.assessorIdentifier = assessorIdentifier;
  }

  public String getGradingScaleIdentifier() {
    return gradingScaleIdentifier;
  }

  public void setGradingScaleIdentifier(String gradingScaleIdentifier) {
    this.gradingScaleIdentifier = gradingScaleIdentifier;
  }

  public String getGradeIdentifier() {
    return gradeIdentifier;
  }

  public void setGradeIdentifier(String gradeIdentifier) {
    this.gradeIdentifier = gradeIdentifier;
  }

  public String getVerbalAssessment() {
    return verbalAssessment;
  }

  public void setVerbalAssessment(String verbalAssessment) {
    this.verbalAssessment = verbalAssessment;
  }

  public Date getAssessmentDate() {
    return assessmentDate;
  }

  public void setAssessmentDate(Date assessmentDate) {
    this.assessmentDate = assessmentDate;
  }

  public Boolean getPassing() {
    return passing;
  }

  public void setPassing(Boolean passing) {
    this.passing = passing;
  }

  public Double getPoints() {
    return points;
  }

  public void setPoints(Double points) {
    this.points = points;
  }

  private String identifier;
  private String assessorIdentifier;
  private String gradingScaleIdentifier;
  private String gradeIdentifier;
  private String verbalAssessment;
  private Date assessmentDate;
  private Boolean passing;
  private Double points;

}
