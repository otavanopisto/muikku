package fi.otavanopisto.muikku.rest.model;

public class StudentPhoneNumber {

  public StudentPhoneNumber() {
  }

  public StudentPhoneNumber(String studentIdentifier, String number, Boolean defaultNumber) {
    super();
    this.studentIdentifier = studentIdentifier;
    this.number = number;
    this.defaultNumber = defaultNumber;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }
  
  public String getNumber() {
    return number;
  }
  
  public Boolean getDefaultNumber() {
    return defaultNumber;
  }
  
  private String studentIdentifier;
  private String number;
  private Boolean defaultNumber;
}
