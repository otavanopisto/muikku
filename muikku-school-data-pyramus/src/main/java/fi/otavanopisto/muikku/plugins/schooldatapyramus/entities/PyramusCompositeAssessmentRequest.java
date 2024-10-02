package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.CompositeAssessmentRequest;

public class PyramusCompositeAssessmentRequest implements CompositeAssessmentRequest {
  
  public PyramusCompositeAssessmentRequest(String identifier, String courseStudentIdentifier, String userIdentifier, String firstName, String lastName,
      String studyProgramme, String courseIdentifier, String courseName, String courseNameExtension, Date courseEnrollmentDate,
      Date assessmentRequestDate, Date evaluationDate, boolean passing, boolean locked) {
    this.identifier = new SchoolDataIdentifier(identifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.courseStudentIdentifier = new SchoolDataIdentifier(courseStudentIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.userIdentifier = new SchoolDataIdentifier(userIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.firstName = firstName;
    this.lastName = lastName;
    this.studyProgramme = studyProgramme;
    this.courseIdentifier = new SchoolDataIdentifier(courseIdentifier, SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    this.courseName = courseName;
    this.courseNameExtension = courseNameExtension;
    this.courseEnrollmentDate = courseEnrollmentDate;
    this.assessmentRequestDate = assessmentRequestDate;
    this.evaluationDate = evaluationDate;
    this.passing = passing;
    this.locked = locked;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public SchoolDataIdentifier getCourseStudentIdentifier() {
    return courseStudentIdentifier;
  }

  @Override
  public SchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public String getFirstName() {
    return firstName;
  }

  @Override
  public String getLastName() {
    return lastName;
  }

  @Override
  public String getStudyProgramme() {
    return studyProgramme;
  }

  @Override
  public SchoolDataIdentifier getCourseIdentifier() {
    return courseIdentifier;
  }

  @Override
  public String getCourseName() {
    return courseName;
  }

  @Override
  public String getCourseNameExtension() {
    return courseNameExtension;
  }

  @Override
  public Date getCourseEnrollmentDate() {
    return courseEnrollmentDate;
  }

  @Override
  public Date getAssessmentRequestDate() {
    return assessmentRequestDate;
  }

  @Override
  public Date getEvaluationDate() {
    return evaluationDate;
  }

  @Override
  public boolean getPassing() {
    return passing;
  }

  @Override
  public boolean getLocked() {
    return locked;
  }

  private final SchoolDataIdentifier identifier;
  private final SchoolDataIdentifier courseStudentIdentifier;
  private final SchoolDataIdentifier userIdentifier;
  private final String firstName;
  private final String lastName;
  private final String studyProgramme;
  private final SchoolDataIdentifier courseIdentifier;
  private final String courseName;
  private final String courseNameExtension;
  private final Date courseEnrollmentDate;
  private final Date assessmentRequestDate;
  private final Date evaluationDate;
  private final boolean passing;
  private final boolean locked;

}
