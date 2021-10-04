package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;

public class PyramusStudentCourseStats implements StudentCourseStats {

  public PyramusStudentCourseStats(int numMandatoryCompletedCourses, double sumMandatoryCompletedCreditPoints) {
    super();
    this.numMandatoryCompletedCourses = numMandatoryCompletedCourses;
    this.sumMandatoryCompletedCreditPoints = sumMandatoryCompletedCreditPoints;
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

  private int numMandatoryCompletedCourses;
  private double sumMandatoryCompletedCreditPoints;
}
