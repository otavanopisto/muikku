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

  public Integer getMandatoryCourses() {
    return mandatoryCourses;
  }

  public void setMandatoryCourses(Integer mandatoryCourses) {
    this.mandatoryCourses = mandatoryCourses;
  }

  public Long getStudentId() {
    return studentId;
  }

  public void setStudentId(Long studentId) {
    this.studentId = studentId;
  }


  String name;
  String ssn;
  String email;
  String phone;
  String address;
  String postalCode;
  String locality;
  String guidanceCounselor;
  Integer mandatoryCourses;
  Long studentId;

}

