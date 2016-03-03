package fi.muikku.rest.model;

public class StudentPhoneNumber {

  public StudentPhoneNumber() {
  }

  public StudentPhoneNumber(String studentIdentifier, String type, String number, Boolean defaultNumber) {
    super();
    this.studentIdentifier = studentIdentifier;
    this.type = type;
    this.number = number;
    this.defaultNumber = defaultNumber;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }
  
  public String getType() {
    return type;
  }

  public String getNumber() {
    return number;
  }
  
  public Boolean getDefaultNumber() {
    return defaultNumber;
  }
  
  private String studentIdentifier;
  private String type;
  private String number;
  private Boolean defaultNumber;
}
