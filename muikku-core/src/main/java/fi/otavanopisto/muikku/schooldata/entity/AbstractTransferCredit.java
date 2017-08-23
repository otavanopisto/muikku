package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractTransferCredit implements TransferCredit {

  public AbstractTransferCredit() {
  }
  
  public AbstractTransferCredit(SchoolDataIdentifier identifier, SchoolDataIdentifier studentIdentifier, OffsetDateTime date,
      SchoolDataIdentifier gradeIdentifier, SchoolDataIdentifier gradingScaleIdentifier, String verbalAssessment, 
      SchoolDataIdentifier assessorIdentifier, String courseName, Integer courseNumber, Double length, 
      SchoolDataIdentifier lengthUnitIdentifier, SchoolDataIdentifier schoolIdentifier, SchoolDataIdentifier subjectIdentifier,
      SchoolDataIdentifier curriculumIdentifier, Optionality optionality, Boolean offCurriculum) {
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
    this.curriculumIdentifier = curriculumIdentifier;
    this.optionality = optionality;
    this.offCurriculum = offCurriculum;
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
  public OffsetDateTime getDate() {
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

  public void setDate(OffsetDateTime date) {
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

  @Override
  public SchoolDataIdentifier getCurriculumIdentifier() {
    return curriculumIdentifier;
  }

  public void setCurriculumIdentifier(SchoolDataIdentifier curriculumIdentifier) {
    this.curriculumIdentifier = curriculumIdentifier;
  }
  
  @Override
  public Optionality getOptionality() {
    return optionality;
  }

  @Override
  public Boolean getOffCurriculum() {
    return offCurriculum;
  }

  public void setOffCurriculum(Boolean offCurriculum) {
    this.offCurriculum = offCurriculum;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier studentIdentifier;
  private OffsetDateTime date;
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
  private SchoolDataIdentifier curriculumIdentifier;
  private Optionality optionality;
  private Boolean offCurriculum;
}
