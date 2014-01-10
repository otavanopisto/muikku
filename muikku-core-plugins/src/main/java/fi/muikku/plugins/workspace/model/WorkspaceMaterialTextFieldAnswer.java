package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.plugins.materialfields.model.QueryTextField;

@Entity
public class WorkspaceMaterialTextFieldAnswer  {

  public Long getId() {
    return id;
  }
  
  public WorkspaceMaterialReply getReply() {
    return reply;
  }
  
  public void setReply(WorkspaceMaterialReply reply) {
    this.reply = reply;
  }
  
  public QueryTextField getQueryField() {
    return queryField;
  }
  
  public void setQueryField(QueryTextField queryField) {
    this.queryField = queryField;
  }
  
  public String getValue() {
    return value;
  }
  
  public void setValue(String value) {
    this.value = value;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterialReply reply;

  @ManyToOne
  private QueryTextField queryField;
  
  private String value;
}
