package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExam;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamStudentStatus;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamTerm;

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
  public boolean isCompulsoryEducationEligible() {
    return compulsoryEducationEligible;
  }

  public void setCompulsoryEducationEligible(boolean compulsoryEducationEligible) {
    this.compulsoryEducationEligible = compulsoryEducationEligible;
  }

  @Override
  public MatriculationExamStudentStatus getStudentStatus() {
    return studentStatus;
  }

  public void setStudentStatus(MatriculationExamStudentStatus studentStatus) {
    this.studentStatus = studentStatus;
  }

  @Override
  public Integer getYear() {
    return year;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  @Override
  public MatriculationExamTerm getTerm() {
    return term;
  }

  public void setTerm(MatriculationExamTerm term) {
    this.term = term;
  }

  @Override
  public MatriculationExamEnrollment getEnrollment() {
    return enrollment;
  }

  public void setEnrollment(PyramusMatriculationExamEnrollment enrollment) {
    this.enrollment = enrollment;
  }

  private long id;
  private Integer year;
  private MatriculationExamTerm term;
  private long startTime;
  private long endTime;
  private boolean compulsoryEducationEligible;
  private MatriculationExamStudentStatus studentStatus;
  private PyramusMatriculationExamEnrollment enrollment;
}
