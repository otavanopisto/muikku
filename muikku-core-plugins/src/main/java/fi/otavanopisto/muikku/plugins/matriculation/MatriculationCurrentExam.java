package fi.otavanopisto.muikku.plugins.matriculation;

public class MatriculationCurrentExam {

  public MatriculationCurrentExam() {
  }
  
  public MatriculationCurrentExam(long id, long starts, long ends, boolean eligible, boolean enrolled, long enrollmentDate, boolean compulsoryEducationEligible) {
    this.id = id;
    this.starts = starts;
    this.ends = ends;
    this.eligible = eligible;
    this.enrolled = enrolled;
    this.enrollmentDate = enrollmentDate;
    this.compulsoryEducationEligible = compulsoryEducationEligible;
  }

  public long getStarts() {
    return starts;
  }
  
  public void setStarts(long starts) {
    this.starts = starts;
  }

  public long getEnds() {
    return ends;
  }

  public void setEnds(long ends) {
    this.ends = ends;
  }

  public boolean isEligible() {
    return eligible;
  }

  public void setEligible(boolean eligible) {
    this.eligible = eligible;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public boolean isEnrolled() {
    return enrolled;
  }

  public void setEnrolled(boolean enrolled) {
    this.enrolled = enrolled;
  }

  public long getEnrollmentDate() {
    return enrollmentDate;
  }

  public void setEnrollmentDate(long enrollmentDate) {
    this.enrollmentDate = enrollmentDate;
  }

  public boolean isCompulsoryEducationEligible() {
    return compulsoryEducationEligible;
  }

  public void setCompulsoryEducationEligible(boolean compulsoryEducationEligible) {
    this.compulsoryEducationEligible = compulsoryEducationEligible;
  }

  private long id;
  private long starts;
  private long ends;
  private boolean eligible;
  private boolean enrolled;
  private long enrollmentDate;
  private boolean compulsoryEducationEligible;
}
