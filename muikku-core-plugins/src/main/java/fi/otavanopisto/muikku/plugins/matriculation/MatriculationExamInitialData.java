package fi.otavanopisto.muikku.plugins.matriculation;

public class MatriculationExamInitialData {

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSsn() {
    return ssn;
  }

  public void setSsn(String ssn) {
    this.ssn = ssn;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getPostalCode() {
    return postalCode;
  }

  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  public String getLocality() {
    return locality;
  }

  public void setLocality(String locality) {
    this.locality = locality;
  }

  public String getGuidanceCounselor() {
    return guidanceCounselor;
  }

  public void setGuidanceCounselor(String guidanceCounselor) {
    this.guidanceCounselor = guidanceCounselor;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public boolean isEnrollmentSent() {
    return enrollmentSent;
  }

  public void setEnrollmentSent(boolean enrollmentSent) {
    this.enrollmentSent = enrollmentSent;
  }

  public Double getCompletedCreditPointsCount() {
    return completedCreditPointsCount;
  }

  public void setCompletedCreditPointsCount(Double completedCreditPointsCount) {
    this.completedCreditPointsCount = completedCreditPointsCount;
  }

  private String name;
  private String ssn;
  private String email;
  private String phone;
  private String address;
  private String postalCode;
  private String locality;
  private String guidanceCounselor;
  private String studentIdentifier;
  private boolean enrollmentSent;
  private Double completedCreditPointsCount;

}

