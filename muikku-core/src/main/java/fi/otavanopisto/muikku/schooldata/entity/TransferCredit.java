package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface TransferCredit extends SchoolDataEntity {
  
  public SchoolDataIdentifier getIdentifier();

  public SchoolDataIdentifier getStudentIdentifier();

  public OffsetDateTime getDate();

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