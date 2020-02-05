package fi.otavanopisto.muikku.rest.model;

import java.time.OffsetDateTime;

public class TransferCredit {

  public TransferCredit() {
  }

  public TransferCredit(String identifier, String studentIdentifier, OffsetDateTime date, String gradeIdentifier,
      String gradingScaleIdentifier, String grade, String gradingScale, Boolean passed, String verbalAssessment, String assessorIdentifier, String courseName,
      Integer courseNumber, Double length, String lengthUnitIdentifier, String schoolIdentifier, String subjectIdentifier,
      String curriculumIdentifier) {
    super();
    this.identifier = identifier;
    this.studentIdentifier = studentIdentifier;
    this.date = date;
    this.gradeIdentifier = gradeIdentifier;
    this.gradingScaleIdentifier = gradingScaleIdentifier;
    this.grade = grade;
    this.gradingScale = gradingScale;
    this.passed = passed;
    this.verbalAssessment = verbalAssessment;
    this.assessorIdentifier = assessorIdentifier;
    this.courseName = courseName;
    this.courseNumber = courseNumber;
    this.length = length;
    this.lengthUnitIdentifier = lengthUnitIdentifier;
    this.schoolIdentifier = schoolIdentifier;
    this.subjectIdentifier = subjectIdentifier;
    this.curriculumIdentifier = curriculumIdentifier;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public OffsetDateTime getDate() {
    return date;
  }

  public void setDate(OffsetDateTime date) {
    this.date = date;
  }

  public String getGradeIdentifier() {
    return gradeIdentifier;
  }

  public void setGradeIdentifier(String gradeIdentifier) {
    this.gradeIdentifier = gradeIdentifier;
  }

  public String getGradingScaleIdentifier() {
    return gradingScaleIdentifier;
  }

  public void setGradingScaleIdentifier(String gradingScaleIdentifier) {
    this.gradingScaleIdentifier = gradingScaleIdentifier;
  }

  public String getVerbalAssessment() {
    return verbalAssessment;
  }

  public void setVerbalAssessment(String verbalAssessment) {
    this.verbalAssessment = verbalAssessment;
  }

  public String getAssessorIdentifier() {
    return assessorIdentifier;
  }

  public void setAssessorIdentifier(String assessorIdentifier) {
    this.assessorIdentifier = assessorIdentifier;
  }

  public String getCourseName() {
    return courseName;
  }

  public void setCourseName(String courseName) {
    this.courseName = courseName;
  }

  public Integer getCourseNumber() {
    return courseNumber;
  }

  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }

  public Double getLength() {
    return length;
  }

  public void setLength(Double length) {
    this.length = length;
  }

  public String getLengthUnitIdentifier() {
    return lengthUnitIdentifier;
  }

  public void setLengthUnitIdentifier(String lengthUnitIdentifier) {
    this.lengthUnitIdentifier = lengthUnitIdentifier;
  }

  public String getSchoolIdentifier() {
    return schoolIdentifier;
  }
  
  public void setSchoolIdentifier(String schoolIdentifier) {
    this.schoolIdentifier = schoolIdentifier;
  }

  public String getSubjectIdentifier() {
    return subjectIdentifier;
  }

  public void setSubjectIdentifier(String subjectIdentifier) {
    this.subjectIdentifier = subjectIdentifier;
  }

  public String getCurriculumIdentifier() {
    return curriculumIdentifier;
  }

  public void setCurriculumIdentifier(String curriculumIdentifier) {
    this.curriculumIdentifier = curriculumIdentifier;
  }

  public String getGrade() {
	return grade;
  }

  public void setGrade(String grade) {
	this.grade = grade;
  }

  public String getGradingScale() {
	return gradingScale;
  }

  public void setGradingScale(String gradingScale) {
	this.gradingScale = gradingScale;
  }

  public Boolean getPassed() {
	return passed;
  }

  public void setPassed(Boolean passed) {
	this.passed = passed;
  }

  private String identifier;
  private String studentIdentifier;
  private OffsetDateTime date;
  private String gradeIdentifier;
  private String gradingScaleIdentifier;
  private String grade;
  private String gradingScale;
  private Boolean passed;
  private String verbalAssessment;
  private String assessorIdentifier;
  private String courseName;
  private Integer courseNumber;
  private Double length;
  private String lengthUnitIdentifier;
  private String schoolIdentifier;
  private String subjectIdentifier;
  private String curriculumIdentifier;
}