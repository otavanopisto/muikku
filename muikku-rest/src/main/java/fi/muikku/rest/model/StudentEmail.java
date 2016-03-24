package fi.muikku.rest.model;

public class StudentEmail {

  public StudentEmail() {
  }

  public StudentEmail(String studentIdentifier, String type, String address, Boolean defaultAddress) {
    super();
    this.studentIdentifier = studentIdentifier;
    this.type = type;
    this.address = address;
    this.defaultAddress = defaultAddress;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }
  
  public String getType() {
    return type;
  }
  
  public String getAddress() {
    return address;
  }
  
  public Boolean getDefaultAddress() {
    return defaultAddress;
  }
  
  private String studentIdentifier;
  private String type;
  private String address;
  private Boolean defaultAddress;
}
