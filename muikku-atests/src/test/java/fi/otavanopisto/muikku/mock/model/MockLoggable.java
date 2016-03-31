package fi.otavanopisto.muikku.mock.model;

public abstract class MockLoggable {
  
  public Long getId() {
    return id;
  }
  public void setUserId(Long id) {
    this.id = id;
  }
  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
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
  
  private Long id;
  private String email;
  private String firstName;
  private String lastName;
  
}
