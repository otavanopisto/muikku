package fi.otavanopisto.muikku.plugins.hops.rest;

import java.util.List;

public class HopsPlannedCoursesRestModel {

  public List<HopsPlannedCourseRestModel> getPlannedCourses() {
    return plannedCourses;
  }

  public void setPlannedCourses(List<HopsPlannedCourseRestModel> plannedCourses) {
    this.plannedCourses = plannedCourses;
  }

  private List<HopsPlannedCourseRestModel> plannedCourses;

}
