package fi.otavanopisto.muikku.mock.model;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.StudentGroupUser;

public class MockStudent extends MockLoggable{

  public MockStudent(Long id, long personId, String firstName, String lastName, String email, long studyProgrammeId, OffsetDateTime birthday, String socialSecurityNumber, Sex sex,
    OffsetDateTime studyStartDate, OffsetDateTime studyEndTime) {
    super();
    this.id = id;
    this.personId = personId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.studyProgrammeId = studyProgrammeId;
    this.birthday = birthday;
    this.socialSecurityNumber = socialSecurityNumber;
    this.sex = sex;
    this.studyStartDate = studyStartDate;
    this.studyEndTime = studyEndTime;
//    this.setCourses(courses);
  }

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public Long getPersonId() {
    return personId;
  }
  public void setPersonId(Long personId) {
    this.personId = personId;
  }
  public String getFirstName() {
    return firstName;
  }
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }
  public String getLastName() {
    return lastName;
  }
  public void setLastName(String lastName) {
    this.lastName = lastName;
  }
  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }
  public Long getStudyProgrammeId() {
    return studyProgrammeId;
  }
  public void setStudyProgrammeId(Long studyProgrammeId) {
    this.studyProgrammeId = studyProgrammeId;
  }
  public OffsetDateTime getBirthday() {
    return birthday;
  }
  public void setBirthday(OffsetDateTime birthday) {
    this.birthday = birthday;
  }
  public String getSocialSecurityNumber() {
    return socialSecurityNumber;
  }
  public void setSocialSecurityNumber(String socialSecurityNumber) {
    this.socialSecurityNumber = socialSecurityNumber;
  }
  public fi.otavanopisto.pyramus.rest.model.Sex getSex() {
    return sex;
  }
  public void setSex(fi.otavanopisto.pyramus.rest.model.Sex sex) {
    this.sex = sex;
  }
  public OffsetDateTime getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(OffsetDateTime studyStartDate) {
    this.studyStartDate = studyStartDate;
  }

  public OffsetDateTime getStudyEndTime() {
    return studyEndTime;
  }

  public void setStudyEndTime(OffsetDateTime studyEndTime) {
    this.studyEndTime = studyEndTime;
  }
  
  public List<StudentGroupUser> getCounselors() {
    return counselors;
  }
  
  public void addCounselor(StudentGroupUser counselor) {
    this.counselors.add(counselor);
  }
  
  //  public List<Long> getCourses() {
//    return courses;
//  }
//  public void setCourses(List<Long> courses) {
//    this.courses = courses;
//  }

  private Long id;
  private Long personId;
  private String firstName;
  private String lastName;
  private String email;
  private Long studyProgrammeId;
  private OffsetDateTime birthday;
  private String socialSecurityNumber;
  private fi.otavanopisto.pyramus.rest.model.Sex sex;
  private OffsetDateTime studyStartDate;
  private OffsetDateTime studyEndTime;
//  private List<Long> courses;
  private List<StudentGroupUser> counselors = new ArrayList<>();
}
