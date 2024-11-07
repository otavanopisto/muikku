package fi.otavanopisto.muikku.plugins.hops.ws;

import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationPlanRESTModel;

public class HopsMatriculationPlanWSMessage extends MatriculationPlanRESTModel {
  
  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private String studentIdentifier;

}
