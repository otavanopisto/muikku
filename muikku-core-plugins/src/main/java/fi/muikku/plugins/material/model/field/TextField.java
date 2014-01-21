package fi.muikku.plugins.material.model.field;

 import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class TextField extends Field {
  
  public static class RightAnswer {
    
    public RightAnswer() {
      
    }
    
    public RightAnswer(Double points, String text, boolean caseSensitive, boolean normalizeWhitespace) {
      this.points = points;
      this.text = text;
      this.caseSensitive = caseSensitive;
      this.normalizeWhitespace = normalizeWhitespace;
    }

    public Double getPoints() {
      return points;
    }
    public void setPoints(Double points) {
      this.points = points;
    }
    
    public String getText() {
      return text;
    }
    public void setText(String text) {
      this.text = text;
    }
    
    public boolean isCaseSensitive() {
      return caseSensitive;
    }
    public void setCaseSensitive(boolean caseSensitive) {
      this.caseSensitive = caseSensitive;
    }
    
    public boolean isNormalizeWhitespace() {
      return normalizeWhitespace;
    }

    public void setNormalizeWhitespace(boolean normalizeWhitespace) {
      this.normalizeWhitespace = normalizeWhitespace;
    }

    private Double points;
    private String text;
    private boolean caseSensitive;
    private boolean normalizeWhitespace;
  }
  
  public TextField() {
    
  }

  public TextField(String name, Integer columns, List<RightAnswer> rightAnswers, String help, String hint) {
    super(name);
    this.setRightAnswers(rightAnswers);
    this.setColumns(columns);
    this.setHelp(help);
    this.setHint(hint);
  }
  
  public List<RightAnswer> getRightAnswers() {
    return rightAnswers;
  }

  public void setRightAnswers(List<RightAnswer> rightAnswers) {
    this.rightAnswers = rightAnswers;
  }
  
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.text";
  }

  public Integer getColumns() {
    return columns;
  }

  public void setColumns(Integer columns) {
    this.columns = columns;
  }

  public String getHint() {
    return hint;
  }

  public void setHint(String hint) {
    this.hint = hint;
  }

  public String getHelp() {
    return help;
  }

  public void setHelp(String help) {
    this.help = help;
  }

  private List<RightAnswer> rightAnswers;
  private Integer columns;
  private String hint;
  private String help;
  
}
