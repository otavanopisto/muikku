package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface CompositeAssessmentRequest extends SchoolDataEntity {
	
  public SchoolDataIdentifier getIdentifier();
  public SchoolDataIdentifier getCourseStudentIdentifier();
  public SchoolDataIdentifier getUserIdentifier();
  public String getFirstName();
  public String getLastName();
  public String getStudyProgramme();
  public SchoolDataIdentifier getCourseIdentifier();
  public String getCourseName();
  public String getCourseNameExtension();
  public Date getCourseEnrollmentDate();
  public Date getAssessmentRequestDate();
  public Date getEvaluationDate();
  public boolean getPassing();
  public boolean getLocked();

}