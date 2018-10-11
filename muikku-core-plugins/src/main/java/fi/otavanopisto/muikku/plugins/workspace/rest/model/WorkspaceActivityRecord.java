package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;

public class WorkspaceActivityRecord {

  public WorkspaceActivityRecord(String type, Date date) {
    this.type = type; 
    this.date = date;
  }
  
  public String getType() {
    return this.type;
  }
  
  public Date getDate() {
    return this.date;
  }
  
  private String type;
  private Date date;
}