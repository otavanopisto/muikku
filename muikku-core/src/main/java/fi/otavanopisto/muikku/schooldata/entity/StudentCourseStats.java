package fi.otavanopisto.muikku.schooldata.entity;

public interface StudentCourseStats {

  boolean getPersonHasCourseAssessments();
  int getNumMandatoryCompletedCourses();
  double getSumMandatoryCompletedCreditPoints();
  
}
