package fi.otavanopisto.muikku.plugins.hops.ws;

import fi.otavanopisto.muikku.plugins.hops.rest.HopsPlannedCoursesRestModel;

public class HopsPlannedCoursesWSMessage extends HopsPlannedCoursesRestModel {

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private String studentIdentifier;

}
