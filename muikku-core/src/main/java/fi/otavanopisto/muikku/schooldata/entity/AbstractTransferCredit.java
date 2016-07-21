package fi.otavanopisto.muikku.schooldata.entity;

import org.threeten.bp.ZonedDateTime;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractTransferCredit implements TransferCredit {

  public AbstractTransferCredit() {
  }
  
  public AbstractTransferCredit(SchoolDataIdentifier identifier, SchoolDataIdentifier studentIdentifier, ZonedDateTime date,
      SchoolDataIdentifier gradeIdentifier, SchoolDataIdentifier gradingScaleIdentifier, String verbalAssessment, 
      SchoolDataIdentifier assessorIdentifier, String courseName, Integer courseNumber, Double length, 
      SchoolDataIdentifier lengthUnitIdentifier, SchoolDataIdentifier schoolIdentifier, SchoolDataIdentifier subjectIdentifier) {
    super();
    this.identifier = identifier;
    this.studentIdentifier = studentIdentifier;
    this.date = date;
    this.gradeIdentifier = gradeIdentifier;
    this.gradingScaleIdentifier = gradingScaleIdentifier;
    this.verbalAssessment = verbalAssessment;
    this.assessorIdentifier = assessorIdentifier;
    this.courseName = courseName;
    this.courseNumber = courseNumber;
    this.length = length;
    this.lengthUnitIdentifier = lengthUnitIdentifier;
    this.schoolIdentifier = schoolIdentifier;
    this.subjectIdentifier = subjectIdentifier;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public SchoolDataIdentifier getStudentIdentifier() {
    return studentIdentifier;
  }

  @Override
  public ZonedDateTime getDate() {
    return date;
  }

  @Override
  public SchoolDataIdentifier getGradeIdentifier() {
    return gradeIdentifier;
  }
  
  @Override
  public SchoolDataIdentifier getGradingScaleIdentifier() {
    return gradingScaleIdentifier;
  }
  
  public void setGradingScaleIdentifier(SchoolDataIdentifier gradingScaleIdentifier) {
    this.gradingScaleIdentifier = gradingScaleIdentifier;
  }

  @Override
  public String getVerbalAssessment() {
    return verbalAssessment;
  }

  @Override
  public SchoolDataIdentifier getAssessorIdentifier() {
    return assessorIdentifier;
  }

  @Override
  public String getCourseName() {
    return courseName;
  }

  @Override
  public Integer getCourseNumber() {
    return courseNumber;
  }

  @Override
  public Double getLength() {
    return length;
  }

  @Override
  public SchoolDataIdentifier getLengthUnitIdentifier() {
    return lengthUnitIdentifier;
  }

  @Override
  public SchoolDataIdentifier getSubjectIdentifier() {
    return subjectIdentifier;
  }

  public void setIdentifier(SchoolDataIdentifier identifier) {
    this.identifier = identifier;
  }

  public void setStudentIdentifier(SchoolDataIdentifier studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public void setDate(ZonedDateTime date) {
    this.date = date;
  }

  public void setGradeIdentifier(SchoolDataIdentifier gradeIdentifier) {
    this.gradeIdentifier = gradeIdentifier;
  }

  public void setVerbalAssessment(String verbalAssessment) {
    this.verbalAssessment = verbalAssessment;
  }

  public void setAssessorIdentifier(SchoolDataIdentifier assessorIdentifier) {
    this.assessorIdentifier = assessorIdentifier;
  }

  public void setCourseName(String courseName) {
    this.courseName = courseName;
  }

  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }

  public void setLength(Double length) {
    this.length = length;
  }

  public void setLengthUnitIdentifier(SchoolDataIdentifier lengthUnitIdentifier) {
    this.lengthUnitIdentifier = lengthUnitIdentifier;
  }

  @Override
  public SchoolDataIdentifier getSchoolIdentifier() {
    return schoolIdentifier;
  }
  
  public void setSchoolIdentifier(SchoolDataIdentifier schoolIdentifier) {
    this.schoolIdentifier = schoolIdentifier;
  }
  
  public void setSubjectIdentifier(SchoolDataIdentifier subjectIdentifier) {
    this.subjectIdentifier = subjectIdentifier;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier studentIdentifier;
  private ZonedDateTime date;
  private SchoolDataIdentifier gradeIdentifier;
  private SchoolDataIdentifier gradingScaleIdentifier;
  private String verbalAssessment;
  private SchoolDataIdentifier assessorIdentifier;
  private String courseName;
  private Integer courseNumber;
  private Double length;
  private SchoolDataIdentifier lengthUnitIdentifier;
  private SchoolDataIdentifier schoolIdentifier;
  private SchoolDataIdentifier subjectIdentifier;

  // TODO: Optionality?
}
