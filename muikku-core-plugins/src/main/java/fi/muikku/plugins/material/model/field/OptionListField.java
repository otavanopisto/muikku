package fi.muikku.plugins.material.model.field;

import java.util.List;

public class OptionListField {
  
  public static class Option {
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

  public OptionListField(List<Option> options) {
    this.setOptions(options);
  }
  
  public List<Option> getOptions() {
    return options;
  }

  public void setOptions(List<Option> optionns) {
    this.options = options;
  }

  private List<Option> options;
  
}
