package fi.muikku.mock.model;

import java.util.List;

import org.joda.time.DateTime;

import fi.pyramus.rest.model.Sex;

public class MockStudent{
  private long id;
  private long personId;
  private String firstName;
  private String lastName;
  private String email;
  private long studyProgrammeId;
  private DateTime birthday;
  private String socialSecurityNumber;
  private fi.pyramus.rest.model.Sex sex;
  private List<Long> courses;

  public MockStudent(Long id, long personId, String firstName, String lastName, String email, long studyProgrammeId, DateTime birthday, String socialSecurityNumber, Sex sex, List<Long> courses) {
    this.id = id;
    this.personId = personId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.setEmail(email);
    this.studyProgrammeId = studyProgrammeId;
    this.birthday = birthday;
    this.socialSecurityNumber = socialSecurityNumber;
    this.sex = sex;
    this.setCourses(courses);
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public long getPersonId() {
    return personId;
  }

  public void setPersonId(long personId) {
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

  public long getStudyProgrammeId() {
    return studyProgrammeId;
  }

  public void setStudyProgrammeId(long studyProgrammeId) {
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

  public fi.pyramus.rest.model.Sex getSex() {
    return sex;
  }

  public void setSex(fi.pyramus.rest.model.Sex sex) {
    this.sex = sex;
  }

  public List<Long> getCourses() {
    return courses;
  }

  public void setCourses(List<Long> courses) {
    this.courses = courses;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}
