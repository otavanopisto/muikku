package fi.otavanopisto.muikku.plugins.material.fieldmeta;

public class FieldMeta {
  
  public FieldMeta() {
  }
  
  public FieldMeta(String name) {
    this.name = name;
  }

  public String getType() {
    throw new RuntimeException("Not Implemented");
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String name;

}
