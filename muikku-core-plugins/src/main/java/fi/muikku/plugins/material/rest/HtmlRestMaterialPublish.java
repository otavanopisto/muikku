package fi.muikku.plugins.material.rest;

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
  
  private Long fromRevision;
  private Long toRevision;
}