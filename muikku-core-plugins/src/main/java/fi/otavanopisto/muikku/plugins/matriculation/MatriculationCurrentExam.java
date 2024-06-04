package fi.otavanopisto.muikku.plugins.matriculation;

import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamStudentStatus;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamTerm;

public class MatriculationCurrentExam {

  public MatriculationCurrentExam() {
  }
  
  public MatriculationCurrentExam(long id, Integer year, MatriculationExamTerm term, long starts, long ends, 
      boolean compulsoryEducationEligible, MatriculationExamStudentStatus studentStatus, MatriculationExamEnrollment enrollment) {
    this.id = id;
    this.year = year;
    this.term = term;
    this.starts = starts;
    this.ends = ends;
    this.compulsoryEducationEligible = compulsoryEducationEligible;
    this.studentStatus = studentStatus;
    this.enrollment = enrollment;
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

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public boolean isCompulsoryEducationEligible() {
    return compulsoryEducationEligible;
  }

  public void setCompulsoryEducationEligible(boolean compulsoryEducationEligible) {
    this.compulsoryEducationEligible = compulsoryEducationEligible;
  }

  public MatriculationExamStudentStatus getStudentStatus() {
    return studentStatus;
  }

  public void setStudentStatus(MatriculationExamStudentStatus studentStatus) {
    this.studentStatus = studentStatus;
  }

  public Integer getYear() {
    return year;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  public MatriculationExamTerm getTerm() {
    return term;
  }

  public void setTerm(MatriculationExamTerm term) {
    this.term = term;
  }

  public MatriculationExamEnrollment getEnrollment() {
    return enrollment;
  }

  public void setEnrollment(MatriculationExamEnrollment enrollment) {
    this.enrollment = enrollment;
  }

  private long id;
  private Integer year;
  private MatriculationExamTerm term;
  private long starts;
  private long ends;
  private boolean compulsoryEducationEligible;
  private MatriculationExamStudentStatus studentStatus;
  private MatriculationExamEnrollment enrollment;
}
