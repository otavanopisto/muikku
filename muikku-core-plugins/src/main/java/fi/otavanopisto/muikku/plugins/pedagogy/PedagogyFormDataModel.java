package fi.otavanopisto.muikku.plugins.pedagogy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Model of the data of the Pedagogy Form.
 * 
 * A partial representation for the time being for
 * the fields needed elsewhere in the application.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PedagogyFormDataModel {

  public Boolean getDecisionToSpecialEducation() {
    return decisionToSpecialEducation;
  }

  public void setDecisionToSpecialEducation(Boolean decisionToSpecialEducation) {
    this.decisionToSpecialEducation = decisionToSpecialEducation;
  }
  
  private Boolean decisionToSpecialEducation;
}
