package fi.otavanopisto.muikku.mock.model;

import java.util.HashSet;
import java.util.Set;

import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;


public class MockStaffMember extends MockLoggable{

  public MockStaffMember(Long id, Long personId, Long organizationId, String firstName, String lastName, UserRole role, String socialSecurityNumber, String email, Sex sex) {
    super();
    this.id = id;
    this.personId = personId;
    this.setOrganizationId(organizationId);
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.socialSecurityNumber = socialSecurityNumber;
    this.email = email;
    this.sex = sex;
    this.staffStudyProgrammes = new HashSet<>();
    staffStudyProgrammes.add(1l);
    staffStudyProgrammes.add(2l);
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

  public Long getOrganizationId() {
    return organizationId;
  }

  public void setOrganizationId(Long organizationId) {
    this.organizationId = organizationId;
  }

  public Set<Long> getStaffStudyProgrammes() {
      return this.staffStudyProgrammes;
    }
  
  public void setStaffStudyProgrammes(Set<Long> staffStudyProgrammes) {
    this.staffStudyProgrammes = staffStudyProgrammes;
  }
  
  private Long id;
  private Long personId;
  private Long organizationId;
  private String firstName;
  private String lastName;
  private UserRole role;
  private String socialSecurityNumber;
  private Sex sex;
  private String email;
  private Set<Long> staffStudyProgrammes;
}

