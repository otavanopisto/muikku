package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class MultiSelectFieldMeta extends FieldMeta {

  public MultiSelectFieldMeta() {

  }

  public MultiSelectFieldMeta(String name, String listType, List<MultiSelectFieldOptionMeta> options, String explanation) {
    super(name);
    this.listType = listType;
    this.options = options;
    this.explanation = explanation;
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

  public String getExplanation() {
    return explanation;
  }

  public void setExplanation(String explanation) {
    this.explanation = explanation;
  }

  private List<MultiSelectFieldOptionMeta> options;
  private String listType; // checkbox-vertical | checkbox-horizontal
  private String explanation;
}
