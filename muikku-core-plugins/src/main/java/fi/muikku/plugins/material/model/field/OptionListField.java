package fi.muikku.plugins.material.model.field;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class OptionListField extends Field {
  
  public static class Option {
    public Option() {
      
    }
    
    public Option(String name, Double points, String text) {
      this.name = name;
      this.points = points;
      this.text = text;
    }

    public String getName() {
      return name;
    }

    public Double getPoints() {
      return points;
    }

    public String getText() {
      return text;
    }

    private String name;
    private Double points;
    private String text;
  }
  
  public OptionListField() {
    
  }

  public OptionListField(String name, String listType, List<Option> options) {
    super(name);
    this.setOptions(options);
    this.setListType(listType);
  }
  
  public List<Option> getOptions() {
    return options;
  }

  public void setOptions(List<Option> options) {
    this.options = options;
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.option-list";
  }

  public String getListType() {
    return listType;
  }

  public void setListType(String listType) {
    this.listType = listType;
  }

  private List<Option> options;
  private String listType;
  
}
