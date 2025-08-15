package fi.otavanopisto.muikku.plugins.pedagogy;

import fi.otavanopisto.muikku.plugins.pedagogy.rest.PedagogyFormLockRestModel;

public class PedagogyFormLockWSMessage extends PedagogyFormLockRestModel {
  
  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private String studentIdentifier;

}
