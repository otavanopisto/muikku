package fi.otavanopisto.muikku.plugins.hops.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
//TODO Add userEntityId + category index after conversion
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

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column
  // TODO Make non-nullable after conversion
  private Long userEntityId;
  
  @Column
  // TODO Make non-nullable after conversion
  private String category;

  @Column
  // TODO Remove after conversion
  private String studentIdentifier;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String subject;
  
  @Column
  private Integer courseNumber;
}
