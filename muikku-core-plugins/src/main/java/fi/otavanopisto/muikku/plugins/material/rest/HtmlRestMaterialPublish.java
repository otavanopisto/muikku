package fi.otavanopisto.muikku.plugins.material.rest;

public class HtmlRestMaterialPublish {

  public Long getFromRevision() {
    return fromRevision;
  }
  
  public void setFromRevision(Long fromRevision) {
    this.fromRevision = fromRevision;
  }
  
  public Long getToRevision() {
    return toRevision;
  }
  
  public void setToRevision(Long toRevision) {
    this.toRevision = toRevision;
  }
  
  public Boolean getRemoveAnswers() {
    return removeAnswers;
  }
  
  public void setRemoveAnswers(Boolean removeAnswers) {
    this.removeAnswers = removeAnswers;
  }
  
  private Long fromRevision;
  private Long toRevision;
  private Boolean removeAnswers;
}