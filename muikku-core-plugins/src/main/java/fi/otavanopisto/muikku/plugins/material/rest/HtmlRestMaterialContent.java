package fi.otavanopisto.muikku.plugins.material.rest;

public class HtmlRestMaterialContent {

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Boolean getRemoveAnswers() {
    return removeAnswers;
  }
  
  public void setRemoveAnswers(Boolean removeAnswers) {
    this.removeAnswers = removeAnswers;
  }

  private String content;
  private Boolean removeAnswers;

}