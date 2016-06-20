package fi.otavanopisto.muikku.plugins.material.fieldmeta;

 import org.codehaus.jackson.annotate.JsonIgnore;

public class AudioFieldMeta extends FieldMeta {
  
  public AudioFieldMeta() {
    
  }

  public AudioFieldMeta(String name, String help, String hint) {
    super(name);
    this.setHelp(help);
    this.setHint(hint);
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.audio";
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
