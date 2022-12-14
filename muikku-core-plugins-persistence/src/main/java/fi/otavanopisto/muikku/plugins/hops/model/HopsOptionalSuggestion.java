package fi.otavanopisto.muikku.plugins.hops.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
public class HopsOptionalSuggestion {

  public Long getId() {
    return id;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public Integer getCourseNumber() {
    return courseNumber;
  }

  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String studentIdentifier;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String subject;
  
  @Column
  private Integer courseNumber;
}
