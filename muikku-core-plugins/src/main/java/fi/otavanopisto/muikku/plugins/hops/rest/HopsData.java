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
  
  public String getHistoryChanges() {
    return historyChanges;
  }

  public void setHistoryChanges(String historyChanges) {
    this.historyChanges = historyChanges;
  }

  private String formData;
  private String historyDetails;
  private String historyChanges;
  
}
