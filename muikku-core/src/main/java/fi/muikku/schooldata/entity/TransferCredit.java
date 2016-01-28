package fi.muikku.schooldata.entity;

import org.joda.time.DateTime;

import fi.muikku.schooldata.SchoolDataIdentifier;

public interface TransferCredit extends SchoolDataEntity {
  
  public SchoolDataIdentifier getIdentifier();

  public SchoolDataIdentifier getStudentIdentifier();

  public DateTime getDate();

  public SchoolDataIdentifier getGradeIdentifier();

  public SchoolDataIdentifier getGradingScaleIdentifier();

  public String getVerbalAssessment();

  public SchoolDataIdentifier getAssessorIdentifier();

  public String getCourseName();

  public Integer getCourseNumber();

  public Double getLength();

  public SchoolDataIdentifier getLengthUnitIdentifier();

  public SchoolDataIdentifier getSchoolIdentifier();

  public SchoolDataIdentifier getSubjectIdentifier();

}