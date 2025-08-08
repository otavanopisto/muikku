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
  public String getNationalStudentNumber() {
    return nationalStudentNumber;
  }

  @Override
  public void setNationalStudentNumber(String nationalStudentNumber) {
    this.nationalStudentNumber = nationalStudentNumber;
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

  @Override
  public String getContactInfoChange() {
    return contactInfoChange;
  }

  @Override
  public void setContactInfoChange(String contactInfoChange) {
    this.contactInfoChange = contactInfoChange;
  }

  public Long id;
  public Long examId;
  public String nationalStudentNumber;
  public String enrollAs;
  public String degreeType;
  public boolean restartExam;
  public int numMandatoryCourses;
  public String location;
  public boolean canPublishName;
  public String contactInfoChange;
  public String message;
  public Long studentId;
  public String state;
  public List<MatriculationExamAttendance> attendances;
  private String degreeStructure;
  private OffsetDateTime enrollmentDate;
}
