package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

import java.time.LocalDate;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamTerm;

public class MatriculationGrade {

  public String getSubject() {
    return subject;
  }
  
  public void setSubject(String subject) {
    this.subject = subject;
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
  
  public String getGrade() {
    return grade;
  }
  
  public void setGrade(String grade) {
    this.grade = grade;
  }
  
  public LocalDate getGradeDate() {
    return gradeDate;
  }
  
  public void setGradeDate(LocalDate gradeDate) {
    this.gradeDate = gradeDate;
  }
  
  private String subject;
  private Integer year;
  private MatriculationExamTerm term;
  private String grade;
  private LocalDate gradeDate;
}
