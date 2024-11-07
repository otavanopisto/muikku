package fi.otavanopisto.muikku.plugins.hops.ws;

import fi.otavanopisto.muikku.plugins.hops.rest.HopsGoalsRestModel;

public class HopsGoalsWSMessage extends HopsGoalsRestModel {

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private String studentIdentifier;

}
