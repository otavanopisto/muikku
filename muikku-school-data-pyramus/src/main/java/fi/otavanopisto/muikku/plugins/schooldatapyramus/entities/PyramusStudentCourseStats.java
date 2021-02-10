package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;

public class PyramusStudentCourseStats implements StudentCourseStats {

  public PyramusStudentCourseStats(int numMandatoryCompletedCourses) {
    super();
    this.numMandatoryCompletedCourses = numMandatoryCompletedCourses;
  }

  @Override
  public int getNumMandatoryCompletedCourses() {
    return numMandatoryCompletedCourses;
  }

  public void setNumMandatoryCompletedCourses(int numMandatoryCompletedCourses) {
    this.numMandatoryCompletedCourses = numMandatoryCompletedCourses;
  }

  int numMandatoryCompletedCourses;

}
