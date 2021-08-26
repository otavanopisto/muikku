package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class SelectFieldMeta extends FieldMeta {
  
  public SelectFieldMeta() {
    
  }

  public SelectFieldMeta(String name, String listType, List<SelectFieldOptionMeta> selectFieldOptionMetas, String explanation) {
    super(name);
    this.selectFieldOptionMetas = selectFieldOptionMetas;
    this.listType = listType;
    this.explanation = explanation;
  }
  
  public List<SelectFieldOptionMeta> getOptions() {
    return selectFieldOptionMetas;
  }

  public void setOptions(List<SelectFieldOptionMeta> selectFieldOptionMetas) {
    this.selectFieldOptionMetas = selectFieldOptionMetas;
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.select";
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

  private List<SelectFieldOptionMeta> selectFieldOptionMetas;
  private String listType; // dropdown | list | radio-horizontal | radio-vertical
  private String explanation;

}
