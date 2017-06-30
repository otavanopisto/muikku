package fi.otavanopisto.muikku.plugins.transcriptofrecords.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {
                "subjectSchoolDataIdentifier",
                "courseNumber",
                "studentSchoolDataIdentifier"
            }
        )
    }
)
public class StudiesViewCourseChoice {
  
  public StudiesViewCourseChoice() {
    this.subjectSchoolDataIdentifier = null;
    this.courseNumber = 0;
    this.studentSchoolDataIdentifier = null;
  }
  
  public StudiesViewCourseChoice(
      String subjectSchoolDataIdentifier,
      int courseNumber,
      String studentSchoolDataIdentifier
  ) {
    super();
    this.subjectSchoolDataIdentifier = subjectSchoolDataIdentifier;
    this.courseNumber = courseNumber;
    this.studentSchoolDataIdentifier = studentSchoolDataIdentifier;
  }

  public Long getId() {
    return id;
  }
  
  public String getStudentSchoolDataIdentifier() {
    return studentSchoolDataIdentifier;
  }
  
  public void setSubjectSchoolDataIdentifier(String subjectSchoolDataIdentifier) {
    this.subjectSchoolDataIdentifier = subjectSchoolDataIdentifier;
  }
  
  public String getSubjectSchoolDataIdentifier() {
    return subjectSchoolDataIdentifier;
  }
  
  public void setStudentSchoolDataIdentifier(String studentSchoolDataIdentifier) {
    this.studentSchoolDataIdentifier = studentSchoolDataIdentifier;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  private String subjectSchoolDataIdentifier;

  @Column
  private String studentSchoolDataIdentifier;

  @Column
  private int courseNumber;
}
