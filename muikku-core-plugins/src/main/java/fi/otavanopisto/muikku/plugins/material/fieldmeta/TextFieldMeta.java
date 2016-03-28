package fi.otavanopisto.muikku.plugins.material.fieldmeta;

 import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class TextFieldMeta extends FieldMeta {
  
  public TextFieldMeta() {
    
  }

  public TextFieldMeta(String name, Integer columns, List<TextFieldRightAnswer> rightAnswers, String hint) {
    super(name);
    this.setRightAnswers(rightAnswers);
    this.setColumns(columns);
    this.setHint(hint);
  }
  
  public List<TextFieldRightAnswer> getRightAnswers() {
    return rightAnswers;
  }

  public void setRightAnswers(List<TextFieldRightAnswer> rightAnswers) {
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

  private List<TextFieldRightAnswer> rightAnswers;
  private Integer columns;
  private String hint;
  
}
