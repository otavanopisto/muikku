package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;

public class PyramusStudentCourseStats implements StudentCourseStats {

  public PyramusStudentCourseStats(int numMandatoryCompletedCourses, double sumMandatoryCompletedCreditPoints, boolean personHasCourseAssessments) {
    super();
    this.numMandatoryCompletedCourses = numMandatoryCompletedCourses;
    this.sumMandatoryCompletedCreditPoints = sumMandatoryCompletedCreditPoints;
    this.personHasCourseAssessments = personHasCourseAssessments;
  }

  @Override
  public int getNumMandatoryCompletedCourses() {
    return numMandatoryCompletedCourses;
  }

  public void setNumMandatoryCompletedCourses(int numMandatoryCompletedCourses) {
    this.numMandatoryCompletedCourses = numMandatoryCompletedCourses;
  }

  @Override
  public double getSumMandatoryCompletedCreditPoints() {
    return sumMandatoryCompletedCreditPoints;
  }

  public void setSumMandatoryCompletedCreditPoints(double sumMandatoryCompletedCreditPoints) {
    this.sumMandatoryCompletedCreditPoints = sumMandatoryCompletedCreditPoints;
  }

  @Override
  public boolean getPersonHasCourseAssessments() {
    return personHasCourseAssessments;
  }

  public void setPersonHasCourseAssessments(boolean personHasCourseAssessments) {
    this.personHasCourseAssessments = personHasCourseAssessments;
  }

  private int numMandatoryCompletedCourses;
  private double sumMandatoryCompletedCreditPoints;
  private boolean personHasCourseAssessments;
}
