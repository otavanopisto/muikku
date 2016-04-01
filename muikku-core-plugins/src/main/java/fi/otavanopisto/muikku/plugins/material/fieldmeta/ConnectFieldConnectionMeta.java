package fi.otavanopisto.muikku.plugins.material.fieldmeta;

public class ConnectFieldConnectionMeta {

  public ConnectFieldConnectionMeta() {

  }

  public ConnectFieldConnectionMeta(String field, String counterpart) {
    this.field = field;
    this.counterpart = counterpart;
  }

  public String getField() {
    return field;
  }

  public void setField(String field) {
    this.field = field;
  }

  public String getCounterpart() {
    return counterpart;
  }

  public void setCounterpart(String counterpart) {
    this.counterpart = counterpart;
  }

  private String field;
  private String counterpart;
}