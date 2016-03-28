package fi.otavanopisto.muikku.plugins.material.rest;

public class HtmlRestMaterialPublishError {

  public HtmlRestMaterialPublishError() {
  }

  public HtmlRestMaterialPublishError(Reason reason) {
    super();
    this.reason = reason;
  }

  public Reason getReason() {
    return reason;
  }

  public void setReason(Reason reason) {
    this.reason = reason;
  }

  private Reason reason;

  public enum Reason {
    
    CONCURRENT_MODIFICATIONS,
    
    CONTAINS_ANSWERS
    
  }
}