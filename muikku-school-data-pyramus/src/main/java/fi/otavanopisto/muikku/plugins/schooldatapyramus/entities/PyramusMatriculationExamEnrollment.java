package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamAttendance;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;

@JsonIgnoreProperties(ignoreUnknown=true)
public class PyramusMatriculationExamEnrollment
    implements MatriculationExamEnrollment {

  @Override
  public Long getId() {
    return id;
  }

  @Override
  public void setId(Long id) {
    this.id = id;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public void setName(String name) {
    this.name = name;
  }

  @Override
  public String getSsn() {
    return ssn;
  }

  @Override
  public void setSsn(String ssn) {
    this.ssn = ssn;
  }

  @Override
  public String getEmail() {
    return email;
  }

  @Override
  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public String getPhone() {
    return phone;
  }

  @Override
  public void setPhone(String phone) {
    this.phone = phone;
  }

  @Override
  public String getAddress() {
    return address;
  }

  @Override
  public void setAddress(String address) {
    this.address = address;
  }

  @Override
  public String getPostalCode() {
    return postalCode;
  }

  @Override
  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  @Override
  public String getCity() {
    return city;
  }

  @Override
  public void setCity(String city) {
    this.city = city;
  }

  @Override
  public String getNationalStudentNumber() {
    return nationalStudentNumber;
  }

  @Override
  public void setNationalStudentNumber(String nationalStudentNumber) {
    this.nationalStudentNumber = nationalStudentNumber;
  }

  @Override
  public String getGuider() {
    return guider;
  }

  @Override
  public void setGuider(String guider) {
    this.guider = guider;
  }

  @Override
  public String getEnrollAs() {
    return enrollAs;
  }

  @Override
  public void setEnrollAs(String enrollAs) {
    this.enrollAs = enrollAs;
  }
  
  @Override
  public boolean isRestartExam() {
    return restartExam;
  }

  @Override
  public void setRestartExam(boolean restartExam) {
    this.restartExam = restartExam;
  }

  @Override
  public int getNumMandatoryCourses() {
    return numMandatoryCourses;
  }

  @Override
  public void setNumMandatoryCourses(int numMandatoryCourses) {
    this.numMandatoryCourses = numMandatoryCourses;
  }

  @Override
  public String getLocation() {
    return location;
  }

  @Override
  public void setLocation(String location) {
    this.location = location;
  }
  
  @Override
  public boolean isCanPublishName() {
    return canPublishName;
  }

  @Override
  public void setCanPublishName(boolean canPublishName) {
    this.canPublishName = canPublishName;
  }

  @Override
  public String getMessage() {
    return message;
  }

  @Override
  public void setMessage(String message) {
    this.message = message;
  }

  @Override
  public Long getStudentId() {
    return studentId;
  }

  @Override
  public void setStudentId(Long studentId) {
    this.studentId = studentId;
  }

  @Override
  public String getState() {
    return state;
  }

  @Override
  public void setState(String state) {
    this.state = state;
  }
  
  @Override
  public List<MatriculationExamAttendance> getAttendances() {
    return attendances;
  }

  @Override
  public void setAttendances(List<MatriculationExamAttendance> attendances) {
    this.attendances = attendances;
  }

  @Override
  public String getDegreeType() {
    return degreeType;
  }

  @Override
  public void setDegreeType(String degreeType) {
    this.degreeType = degreeType;
  }
  
  @Override
  public Long getExamId() {
    return examId;
  }

  @Override
  public void setExamId(Long examId) {
    this.examId = examId;
  }
  
  @Override
  public String getDegreeStructure() {
    return degreeStructure;
  }

  @Override
  public void setDegreeStructure(String degreeStructure) {
    this.degreeStructure = degreeStructure;
  }

  @Override
  public OffsetDateTime getEnrollmentDate() {
    return enrollmentDate;
  }

  @Override
  public void setEnrollmentDate(OffsetDateTime enrollmentDate) {
    this.enrollmentDate = enrollmentDate;
  }

  public Long id;
  public Long examId;
  public String name;
  public String ssn;
  public String email;
  public String phone;
  public String address;
  public String postalCode;
  public String city;
  public String nationalStudentNumber;
  public String guider;
  public String enrollAs;
  public String degreeType;
  public boolean restartExam;
  public int numMandatoryCourses;
  public String location;
  public boolean canPublishName;
  public String message;
  public Long studentId;
  public String state;
  public List<MatriculationExamAttendance> attendances;
  private String degreeStructure;
  private OffsetDateTime enrollmentDate;
}
