package fi.otavanopisto.muikku.plugins.ceepos.rest;

public class CeeposReturnLinkRestModel {
  
  public CeeposReturnLinkRestModel() {
  }
  
  public CeeposReturnLinkRestModel(String path, String text) {
    this.path = path;
    this.text = text;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  private String path;
  private String text;
}
