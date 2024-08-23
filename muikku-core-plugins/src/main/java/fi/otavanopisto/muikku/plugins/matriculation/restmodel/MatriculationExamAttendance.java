package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

import java.time.OffsetDateTime;

public class MatriculationExamAttendance {

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public Boolean getMandatory() {
    return mandatory;
  }

  public void setMandatory(Boolean mandatory) {
    this.mandatory = mandatory;
  }

  public Boolean getRepeat() {
    return repeat;
  }

  public void setRepeat(Boolean repeat) {
    this.repeat = repeat;
  }

  public Integer getYear() {
    return year;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  public String getTerm() {
    return term;
  }

  public void setTerm(String term) {
    this.term = term;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getGrade() {
    return grade;
  }

  public void setGrade(String grade) {
    this.grade = grade;
  }

  public String getFunding() {
    return funding;
  }

  public void setFunding(String funding) {
    this.funding = funding;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public OffsetDateTime getGradeDate() {
    return gradeDate;
  }

  public void setGradeDate(OffsetDateTime gradeDate) {
    this.gradeDate = gradeDate;
  }

  private Long id;
  private String subject;
  private Boolean mandatory;
  private Boolean repeat;
  private Integer year;
  private String term;
  private String status;
  private String grade;
  private OffsetDateTime gradeDate;
  private String funding;

}

