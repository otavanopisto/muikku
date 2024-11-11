package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

public class MatriculationEligibilityRESTModel {
  
  public double getCreditPoints() {
    return creditPoints;
  }
  public void setCreditPoints(double creditPoints) {
    this.creditPoints = creditPoints;
  }
  public double getCreditPointsRequired() {
    return creditPointsRequired;
  }
  public void setCreditPointsRequired(double creditPointsRequired) {
    this.creditPointsRequired = creditPointsRequired;
  }
  public MatriculationExamEligibilityStatus getStatus() {
    return status;
  }
  public void setStatus(MatriculationExamEligibilityStatus status) {
    this.status = status;
  }
  public int getCoursesCompleted() {
    return coursesCompleted;
  }
  public void setCoursesCompleted(int coursesCompleted) {
    this.coursesCompleted = coursesCompleted;
  }
  public int getCoursesRequired() {
    return coursesRequired;
  }
  public void setCoursesRequired(int coursesRequired) {
    this.coursesRequired = coursesRequired;
  }
  public boolean isPersonHasCourseAssessments() {
    return personHasCourseAssessments;
  }
  public void setPersonHasCourseAssessments(boolean personHasCourseAssessments) {
    this.personHasCourseAssessments = personHasCourseAssessments;
  }
  private MatriculationExamEligibilityStatus status;
  private boolean personHasCourseAssessments;
  private int coursesCompleted;
  private int coursesRequired;
  private double creditPoints;
  private double creditPointsRequired;
}