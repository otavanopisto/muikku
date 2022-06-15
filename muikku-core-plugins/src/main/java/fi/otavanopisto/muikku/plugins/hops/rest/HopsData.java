package fi.otavanopisto.muikku.plugins.hops.rest;

public class HopsData {

  public String getFormData() {
    return formData;
  }
  public void setFormData(String formData) {
    this.formData = formData;
  }
  
  public String getHistoryDetails() {
    return historyDetails;
  }
  public void setHistoryDetails(String historyDetails) {
    this.historyDetails = historyDetails;
  }

  private String formData;
  private String historyDetails;
}
