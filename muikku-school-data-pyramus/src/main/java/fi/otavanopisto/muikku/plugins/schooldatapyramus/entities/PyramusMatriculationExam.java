package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;

public class PyramusMatriculationExam implements MatriculationExam {

  @Override
  public long getStarts() {
    return startTime;
  }
  
  public void setStarts(long startTime) {
    this.startTime = startTime;
  }

  @Override
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

  @Override
  public boolean isEligible() {
    return eligible;
  }
  
  public void setEligible(boolean eligible) {
    this.eligible = eligible;
  }

  @Override
  public boolean isEnrolled() {
    return enrolled;
  }

  public void setEnrolled(boolean enrolled) {
    this.enrolled = enrolled;
  }

  @Override
  public long getEnrollmentDate() {
    return enrollmentDate;
  }

  public void setEnrollmentDate(long enrollmentDate) {
    this.enrollmentDate = enrollmentDate;
  }

  @Override
  public boolean isCompulsoryEducationEligible() {
    return compulsoryEducationEligible;
  }

  public void setCompulsoryEducationEligible(boolean compulsoryEducationEligible) {
    this.compulsoryEducationEligible = compulsoryEducationEligible;
  }

  private long id;
  private long startTime;
  private long endTime;
  private boolean eligible; 
  private boolean enrolled; 
  private long enrollmentDate;
  private boolean compulsoryEducationEligible;
}
