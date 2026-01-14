package fi.otavanopisto.muikku.rest.model;

public class StudentEmail {

  public StudentEmail() {
  }

  public StudentEmail(String studentIdentifier, String address, Boolean defaultAddress) {
    super();
    this.studentIdentifier = studentIdentifier;
    this.address = address;
    this.defaultAddress = defaultAddress;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }
  
  public String getAddress() {
    return address;
  }
  
  public Boolean getDefaultAddress() {
    return defaultAddress;
  }
  
  private String studentIdentifier;
  private String address;
  private Boolean defaultAddress;
}
