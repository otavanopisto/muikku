package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;

public class WorkspaceMaterialFieldAnswerSnapshot {

  public WorkspaceMaterialFieldAnswerSnapshot() {
  }

  public WorkspaceMaterialFieldAnswerSnapshot(Long id, Date date, String value) {
    this.id = id;
    this.date = date;
    this.value = value;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }
  
  private Long id;
  private Date date;
  private String value;

}