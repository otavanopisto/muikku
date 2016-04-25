package fi.otavanopisto.muikku.mock.model;

import org.joda.time.DateTime;

import fi.otavanopisto.pyramus.rest.model.Sex;

public class MockStudent extends MockLoggable{

  public MockStudent(Long id, long personId, String firstName, String lastName, String email, long studyProgrammeId, DateTime birthday, String socialSecurityNumber, Sex sex,
    DateTime studyStartDate, DateTime studyEndTime) {
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
  public DateTime getBirthday() {
    return birthday;
  }
  public void setBirthday(DateTime birthday) {
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
  public DateTime getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(DateTime studyStartDate) {
    this.studyStartDate = studyStartDate;
  }

  public DateTime getStudyEndTime() {
    return studyEndTime;
  }

  public void setStudyEndTime(DateTime studyEndTime) {
    this.studyEndTime = studyEndTime;
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
  private DateTime birthday;
  private String socialSecurityNumber;
  private fi.otavanopisto.pyramus.rest.model.Sex sex;
  private DateTime studyStartDate;
  private DateTime studyEndTime;
//  private List<Long> courses;
  
}
