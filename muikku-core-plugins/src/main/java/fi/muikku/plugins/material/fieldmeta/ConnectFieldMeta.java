package fi.muikku.plugins.material.fieldmeta;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class ConnectFieldMeta extends FieldMeta {

  public static class Field {

    public Field() {

    }

    public Field(String name, String text) {
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

  public static class Connection {

    public Connection() {

    }

    public Connection(String field, String counterpart) {
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

  public ConnectFieldMeta() {

  }

  public ConnectFieldMeta(String name, List<Field> fields, List<Field> counterparts, List<Connection> connections) {
    super(name);
    this.setFields(fields);
    this.setCounterparts(counterparts);
    this.setConnections(connections);
  }

  public List<Field> getFields() {
    return fields;
  }

  public void setFields(List<Field> fields) {
    this.fields = fields;
  }

  public List<Field> getCounterparts() {
    return counterparts;
  }

  public void setCounterparts(List<Field> counterparts) {
    this.counterparts = counterparts;
  }

  public List<Connection> getConnections() {
    return connections;
  }

  public void setConnections(List<Connection> connections) {
    this.connections = connections;
  }

  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.connect";
  }

  private List<Field> fields;
  private List<Field> counterparts;
  private List<Connection> connections;

}
