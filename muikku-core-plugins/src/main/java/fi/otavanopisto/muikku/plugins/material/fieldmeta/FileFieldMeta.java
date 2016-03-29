package fi.otavanopisto.muikku.plugins.material.fieldmeta;

 import org.codehaus.jackson.annotate.JsonIgnore;

public class FileFieldMeta extends FieldMeta {
  
  public FileFieldMeta() {
    
  }

  public FileFieldMeta(String name, String help, String hint) {
    super(name);
    this.setHelp(help);
    this.setHint(hint);
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.file";
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
  //TODO: Add list of accepted mimetypes, add property if multiple files are accepted
}
