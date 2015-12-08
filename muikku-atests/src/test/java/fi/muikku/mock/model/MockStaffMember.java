package fi.muikku.mock.model;

import fi.pyramus.rest.model.Sex;
import fi.pyramus.rest.model.UserRole;


public class MockStaffMember {

  public MockStaffMember(Long id, Long personId, String firstName, String lastName, UserRole role, String socialSecurityNumber, String email) {
    super();
    this.id = id;
    this.personId = personId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.socialSecurityNumber = socialSecurityNumber;
    this.setEmail(email);
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

  public UserRole getRole() {
    return role;
  }

  public void setRole(UserRole role) {
    this.role = role;
  }
  
  public String getSocialSecurityNumber() {
    return socialSecurityNumber;
  }
  
  public void setSocialSecurityNumber(String socialSecurityNumber) {
    this.socialSecurityNumber = socialSecurityNumber;
  }

  public Sex getSex() {
    return sex;
  }
  public void setSex(Sex sex) {
    this.sex = sex;
  }

  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }

  private Long id;
  private Long personId;
  private String firstName;
  private String lastName;
  private UserRole role;
  private String socialSecurityNumber;
  private Sex sex;
  private String email;
}

