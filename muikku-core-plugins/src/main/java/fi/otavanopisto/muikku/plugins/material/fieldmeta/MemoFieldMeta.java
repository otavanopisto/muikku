package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import org.codehaus.jackson.annotate.JsonIgnore;

public class MemoFieldMeta extends FieldMeta {
  
  public MemoFieldMeta() {
    
  }
  
  public MemoFieldMeta(String name, Integer columns, Integer rows, String help, String hint, String example, Boolean richedit) {
    super(name);
    this.columns = columns;
    this.rows = rows;
    this.help = help;
    this.hint = hint;
    this.example = example;
    this.richedit = richedit;
  }

  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.memo";
  }

  public Integer getColumns() {
    return columns;
  }

  public void setColumns(Integer columns) {
    this.columns = columns;
  }
  
  public Integer getRows() {
    return rows;
  }
  
  public void setRows(Integer rows) {
    this.rows = rows;
  }
  
  public String getHelp() {
    return help;
  }
  
  public void setHelp(String help) {
    this.help = help;
  }
  
  public String getHint() {
    return hint;
  }
  
  public void setHint(String hint) {
    this.hint = hint;
  }

  public String getExample() {
    return example;
  }

  public void setExample(String example) {
    this.example = example;
  }

  public Boolean getRichedit() {
    return richedit;
  }

  public void setRichedit(Boolean richedit) {
    this.richedit = richedit;
  }

  private Integer columns;
  private Integer rows;
  private String help;
  private String hint;
  private String example;
  private Boolean richedit;
  
}
