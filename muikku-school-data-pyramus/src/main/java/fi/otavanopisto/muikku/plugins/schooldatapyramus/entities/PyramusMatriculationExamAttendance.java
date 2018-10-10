package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;

public class PyramusMatriculationExamAttendance
    implements MatriculationExamAttendance {

  @Override
  public String getSubject() {
    return subject;
  }

  @Override
  public void setSubject(String subject) {
    this.subject = subject;
  }

  @Override
  public Boolean getMandatory() {
    return mandatory;
  }

  @Override
  public void setMandatory(Boolean mandatory) {
    this.mandatory = mandatory;
  }

  @Override
  public Boolean getRepeat() {
    return repeat;
  }

  @Override
  public void setRepeat(Boolean repeat) {
    this.repeat = repeat;
  }

  @Override
  public Integer getYear() {
    return year;
  }

  @Override
  public void setYear(Integer year) {
    this.year = year;
  }

  @Override
  public String getTerm() {
    return term;
  }

  @Override
  public void setTerm(String term) {
    this.term = term;
  }

  @Override
  public String getStatus() {
    return status;
  }

  @Override
  public void setStatus(String status) {
    this.status = status;
  }

  @Override
  public String getGrade() {
    return grade;
  }

  @Override
  public void setGrade(String grade) {
    this.grade = grade;
  }

  private String subject;
  private Boolean mandatory;
  private Boolean repeat;
  private Integer year;
  private String term;
  private String status;
  private String grade;
}
