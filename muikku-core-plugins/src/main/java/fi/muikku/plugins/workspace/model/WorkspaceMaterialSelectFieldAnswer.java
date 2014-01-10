package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.SelectFieldOption;

@Entity
public class WorkspaceMaterialSelectFieldAnswer  {

  public Long getId() {
    return id;
  }
  
  public WorkspaceMaterialReply getReply() {
    return reply;
  }
  
  public void setReply(WorkspaceMaterialReply reply) {
    this.reply = reply;
  }
  
  public QuerySelectField getQueryField() {
    return queryField;
  }
  
  public void setQueryField(QuerySelectField queryField) {
    this.queryField = queryField;
  }
  
  public SelectFieldOption getValue() {
    return value;
  }
  
  public void setValue(SelectFieldOption value) {
    this.value = value;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterialReply reply;

  @ManyToOne
  private QuerySelectField queryField;
  
  private SelectFieldOption value;
}
