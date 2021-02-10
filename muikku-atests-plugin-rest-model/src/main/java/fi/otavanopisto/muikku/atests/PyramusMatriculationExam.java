package fi.otavanopisto.muikku.atests;

public class PyramusMatriculationExam {

  public PyramusMatriculationExam() {
    
  }
  
  public long getStarts() {
    return startTime;
  }
  
  public void setStarts(long startTime) {
    this.startTime = startTime;
  }

  public long getEnds() {
    return endTime;
  }
  
  public void setEnds(long endTime) {
    this.endTime = endTime;
  }
  
  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public boolean isEligible() {
    return eligible;
  }
  
  public void setEligible(boolean eligible) {
    this.eligible = eligible;
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

  private long id;
  private long startTime;
  private long endTime;
  private boolean eligible; 
  private boolean enrolled; 
  private long enrollmentDate;
}
