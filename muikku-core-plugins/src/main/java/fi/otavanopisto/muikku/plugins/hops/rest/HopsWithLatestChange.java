package fi.otavanopisto.muikku.plugins.hops.rest;

public class HopsWithLatestChange {
  
  public HopsWithLatestChange() {
  }
  
  public HopsWithLatestChange(String formData, HistoryItem latestChange) {
    this.formData = formData;
    this.latestChange = latestChange;
  }

  public String getFormData() {
    return formData;
  }

  public void setFormData(String formData) {
    this.formData = formData;
  }

  public HistoryItem getLatestChange() {
    return latestChange;
  }

  public void setLatestChange(HistoryItem latestChange) {
    this.latestChange = latestChange;
  }

  private String formData;
  private HistoryItem latestChange;

}
