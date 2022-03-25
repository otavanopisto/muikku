package fi.otavanopisto.muikku.plugins.hops.rest;

public class HopsData {

  public Object getFormData() {
    return formData;
  }
  public void setFormData(Object formData) {
    this.formData = formData;
  }
  
  public String getHistoryDetails() {
    return historyDetails;
  }
  public void setHistoryDetails(String historyDetails) {
    this.historyDetails = historyDetails;
  }

  private Object formData;
  private String historyDetails;
}
