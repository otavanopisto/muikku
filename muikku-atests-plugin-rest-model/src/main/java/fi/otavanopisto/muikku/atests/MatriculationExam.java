package fi.otavanopisto.muikku.atests;

import java.util.Date;

public class MatriculationExam {

  /**
   * Returns the unique identifier of this object.
   * 
   * @return The unique identifier of this object
   */
  public Long getId() {
    return id;
  }
  
  public Date getStarts() {
    return starts;
  }

  public void setStarts(Date starts) {
    this.starts = starts;
  }

  public Date getEnds() {
    return ends;
  }

  public void setEnds(Date ends) {
    this.ends = ends;
  }

  public Long getVersion() {
    return version;
  }

  public void setVersion(Long version) {
    this.version = version;
  }

  public Grade getSignupGrade() {
    return signupGrade;
  }

  public void setSignupGrade(Grade signupGrade) {
    this.signupGrade = signupGrade;
  }

  public Integer getExamYear() {
    return examYear;
  }

  public void setExamYear(Integer examYear) {
    this.examYear = examYear;
  }

  public MatriculationExamTerm getExamTerm() {
    return examTerm;
  }

  public void setExamTerm(MatriculationExamTerm examTerm) {
    this.examTerm = examTerm;
  }

  public boolean isEnrollmentActive() {
    return enrollmentActive;
  }

  public void setEnrollmentActive(boolean enrollmentActive) {
    this.enrollmentActive = enrollmentActive;
  }

  private Long id;
  
  private boolean enrollmentActive;

  private Date starts;
  
  private Date ends;

  private Integer examYear;

  private MatriculationExamTerm examTerm;

  private Grade signupGrade;

  private Long version;
}
