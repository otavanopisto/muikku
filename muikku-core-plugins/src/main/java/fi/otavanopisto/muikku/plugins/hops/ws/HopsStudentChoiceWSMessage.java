package fi.otavanopisto.muikku.plugins.hops.ws;

import fi.otavanopisto.muikku.plugins.hops.rest.StudentChoiceRestModel;

public class HopsStudentChoiceWSMessage extends StudentChoiceRestModel {
  
  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private String studentIdentifier;

}
