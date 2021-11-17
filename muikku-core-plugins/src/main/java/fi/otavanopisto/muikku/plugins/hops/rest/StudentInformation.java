package fi.otavanopisto.muikku.plugins.hops.rest;

public class StudentInformation {
  
  public StudentInformation(
      Long id,
      String firstName,
      String lastName,
      String counselorName) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.counselorName = counselorName;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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

  public String getCounselorName() {
    return counselorName;
  }

  public void setCounselorName(String counselorName) {
    this.counselorName = counselorName;
  }
  
  private Long id;
  private String firstName;
  private String lastName;
  private String counselorName;
}
