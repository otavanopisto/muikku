package fi.otavanopisto.muikku.plugins.material.fieldmeta;

 import com.fasterxml.jackson.annotation.JsonIgnore;

public class MathExerciseFieldMeta extends FieldMeta {
  
  public MathExerciseFieldMeta() {
    
  }

  public MathExerciseFieldMeta(String name, String help, String hint) {
    super(name);
    this.setHelp(help);
    this.setHint(hint);
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.mathexercise";
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

  private String hint;
  private String help;
}
