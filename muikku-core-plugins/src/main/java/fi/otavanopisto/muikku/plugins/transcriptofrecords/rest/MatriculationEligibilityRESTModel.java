package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

public class MatriculationEligibilityRESTModel {
  
  public int getCreditPoints() {
    return creditPoints;
  }
  public void setCreditPoints(int creditPoints) {
    this.creditPoints = creditPoints;
  }
  public int getCreditPointsRequired() {
    return creditPointsRequired;
  }
  public void setCreditPointsRequired(int creditPointsRequired) {
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
  private MatriculationExamEligibilityStatus status;
  private int coursesCompleted;
  private int coursesRequired;
  private int creditPoints;
  private int creditPointsRequired;
}