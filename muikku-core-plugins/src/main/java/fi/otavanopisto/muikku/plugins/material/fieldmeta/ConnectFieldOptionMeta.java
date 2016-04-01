package fi.otavanopisto.muikku.plugins.material.fieldmeta;

public class ConnectFieldOptionMeta {

  public ConnectFieldOptionMeta() {

  }

  public ConnectFieldOptionMeta(String name, String text) {
    this.name = name;
    this.text = text;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  private String name;
  private String text;
}