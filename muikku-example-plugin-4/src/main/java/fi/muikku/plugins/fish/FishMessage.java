package fi.otavanopisto.muikku.plugins.fish;

public class FishMessage {
  public FishMessage(String content) {
    this.setContent(content);
  }
  
  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  private String content;
}
