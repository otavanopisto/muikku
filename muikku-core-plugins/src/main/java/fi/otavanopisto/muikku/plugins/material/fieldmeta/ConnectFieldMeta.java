package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class ConnectFieldMeta extends FieldMeta {

  public ConnectFieldMeta() {

  }

  public ConnectFieldMeta(String name, List<ConnectFieldOptionMeta> connectFieldOptionMetas, List<ConnectFieldOptionMeta> counterparts, List<ConnectFieldConnectionMeta> connectFieldConnectionMetas) {
    super(name);
    this.setFields(connectFieldOptionMetas);
    this.setCounterparts(counterparts);
    this.setConnections(connectFieldConnectionMetas);
  }

  public List<ConnectFieldOptionMeta> getFields() {
    return connectFieldOptionMetas;
  }

  public void setFields(List<ConnectFieldOptionMeta> connectFieldOptionMetas) {
    this.connectFieldOptionMetas = connectFieldOptionMetas;
  }

  public List<ConnectFieldOptionMeta> getCounterparts() {
    return counterparts;
  }

  public void setCounterparts(List<ConnectFieldOptionMeta> counterparts) {
    this.counterparts = counterparts;
  }

  public List<ConnectFieldConnectionMeta> getConnections() {
    return connectFieldConnectionMetas;
  }

  public void setConnections(List<ConnectFieldConnectionMeta> connectFieldConnectionMetas) {
    this.connectFieldConnectionMetas = connectFieldConnectionMetas;
  }

  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.connect";
  }

  private List<ConnectFieldOptionMeta> connectFieldOptionMetas;
  private List<ConnectFieldOptionMeta> counterparts;
  private List<ConnectFieldConnectionMeta> connectFieldConnectionMetas;

}
