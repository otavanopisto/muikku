package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class MultiSelectFieldMeta extends FieldMeta {

  public MultiSelectFieldMeta() {

  }

  public MultiSelectFieldMeta(String name, String listType, List<MultiSelectFieldOptionMeta> options) {
    super(name);
    this.listType = listType;
    this.setOptions(options);
  }

  public List<MultiSelectFieldOptionMeta> getOptions() {
    return options;
  }
  
  public void setOptions(List<MultiSelectFieldOptionMeta> options) {
    this.options = options;
  }

  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.multiselect";
  }

  public String getListType() {
    return listType;
  }

  public void setListType(String listType) {
    this.listType = listType;
  }

  private List<MultiSelectFieldOptionMeta> options;
  private String listType; // checkbox-vertical | checkbox-horizontal
}
