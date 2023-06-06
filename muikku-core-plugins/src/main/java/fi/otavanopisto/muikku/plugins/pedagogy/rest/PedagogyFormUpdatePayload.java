package fi.otavanopisto.muikku.plugins.pedagogy.rest;

import java.util.List;

public class PedagogyFormUpdatePayload {

  public String getFormData() {
    return formData;
  }

  public void setFormData(String formData) {
    this.formData = formData;
  }

  public List<String> getFields() {
    return fields;
  }

  public void setFields(List<String> fields) {
    this.fields = fields;
  }

  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  private String formData;
  private List<String> fields;
  private String details;

}
