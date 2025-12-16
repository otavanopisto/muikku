package fi.otavanopisto.muikku.schooldata.entity;

import java.time.LocalDate;

public class MatriculationGrade {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
    
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
  
  public Integer getTotalPoints() {
    return totalPoints;
  }

  public void setTotalPoints(Integer totalPoints) {
    this.totalPoints = totalPoints;
  }

  private Long id;
  private String subject;
  private Integer year;
  private MatriculationExamTerm term;
  private String grade;
  private Integer totalPoints;
  private LocalDate gradeDate;
}
