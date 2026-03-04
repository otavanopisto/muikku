package fi.otavanopisto.muikku.schooldata.payload;

public class StudentEducationType {

  public String getEducationTypeCode() {
    return educationTypeCode;
  }

  public void setEducationTypeCode(String educationTypeCode) {
    this.educationTypeCode = educationTypeCode;
  }

  public Long getStudentId() {
    return studentId;
  }

  public void setStudentId(Long studentId) {
    this.studentId = studentId;
  }

  private String educationTypeCode;
  private Long studentId;

}
