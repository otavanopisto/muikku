package fi.muikku.plugins.material.fieldmeta;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class ChecklistFieldMeta extends FieldMeta {

  public ChecklistFieldMeta() {

  }

  public ChecklistFieldMeta(String name, List<ChecklistFieldOptionMeta> options) {
    super(name);
    this.setOptions(options);
  }

  public List<ChecklistFieldOptionMeta> getOptions() {
    return options;
  }
  
  public void setOptions(List<ChecklistFieldOptionMeta> options) {
    this.options = options;
  }

  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.checklist";
  }

  private List<ChecklistFieldOptionMeta> options;
}
