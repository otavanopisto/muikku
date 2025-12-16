package fi.otavanopisto.muikku.plugins.matriculation;

import java.time.LocalDate;

import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamStudentStatus;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamTerm;

public class MatriculationCurrentExam {

  public MatriculationCurrentExam() {
  }
  
  public MatriculationCurrentExam(long id, Integer year, MatriculationExamTerm term, LocalDate starts, LocalDate ends, LocalDate confirmDate,
      boolean compulsoryEducationEligible, MatriculationExamStudentStatus studentStatus, MatriculationExamEnrollment enrollment) {
    this.id = id;
    this.year = year;
    this.term = term;
    this.starts = starts;
    this.ends = ends;
    this.confirmDate = confirmDate;
    this.compulsoryEducationEligible = compulsoryEducationEligible;
    this.studentStatus = studentStatus;
    this.enrollment = enrollment;
  }

  public LocalDate getStarts() {
    return starts;
  }
  
  public void setStarts(LocalDate starts) {
    this.starts = starts;
  }

  public LocalDate getEnds() {
    return ends;
  }

  public void setEnds(LocalDate ends) {
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

  public LocalDate getConfirmDate() {
    return confirmDate;
  }

  public void setConfirmDate(LocalDate confirmDate) {
    this.confirmDate = confirmDate;
  }

  private long id;
  private Integer year;
  private MatriculationExamTerm term;
  private LocalDate starts;
  private LocalDate ends;
  private LocalDate confirmDate;
  private boolean compulsoryEducationEligible;
  private MatriculationExamStudentStatus studentStatus;
  private MatriculationExamEnrollment enrollment;
}
