package fi.otavanopisto.muikku.plugins.hops.ws;

import fi.otavanopisto.muikku.plugins.hops.rest.HopsSuggestionRestModel;

public class HopsSuggestionWSMessage extends HopsSuggestionRestModel {
  
  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private String studentIdentifier;

}
