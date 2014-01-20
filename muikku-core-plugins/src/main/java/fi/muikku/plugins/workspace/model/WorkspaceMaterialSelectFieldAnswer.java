package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;

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
  
  public QuerySelectFieldOption getValue() {
    return value;
  }
  
  public void setValue(QuerySelectFieldOption value) {
    this.value = value;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterialReply reply;

  // TODO: Remove this
  @ManyToOne
  private QuerySelectField queryField;
  
  @ManyToOne
  private QuerySelectFieldOption value;
}
