package fi.muikku.plugins.material.fieldmeta;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class SelectFieldMeta extends FieldMeta {
  
  public SelectFieldMeta() {
    
  }

  public SelectFieldMeta(String name, String listType, List<SelectFieldOptionMeta> selectFieldOptionMetas) {
    super(name);
    this.setOptions(selectFieldOptionMetas);
    this.setListType(listType);
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

  private List<SelectFieldOptionMeta> selectFieldOptionMetas;
  private String listType;
  
}
