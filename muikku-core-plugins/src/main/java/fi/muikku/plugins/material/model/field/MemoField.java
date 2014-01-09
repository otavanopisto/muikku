package fi.muikku.plugins.material.model.field;

import org.codehaus.jackson.annotate.JsonIgnore;

public class MemoField implements Field {
  
  public MemoField() {
    
  }
  
  public MemoField(String name, Integer columns, Integer rows, String help, String hint) {
    super();
    this.name = name;
    this.columns = columns;
    this.rows = rows;
    this.help = help;
    this.hint = hint;
  }

  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.memo";
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
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

  private String name;
  private Integer columns;
  private Integer rows;
  private String help;
  private String hint;
  
}
