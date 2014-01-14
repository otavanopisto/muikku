package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;


@Entity
public class WorkspaceMaterialFieldAnswer {
  
  public Long getId() {
    return id;
  }
  
  public WorkspaceMaterialReply getReply() {
    return reply;
  }
  
  public void setReply(WorkspaceMaterialReply reply) {
    this.reply = reply;
  }
  
  public WorkspaceMaterialField getWorkspaceMaterialField() {
    return workspaceMaterialField;
  }

  public void setWorkspaceMaterialField(WorkspaceMaterialField workspaceMaterialField) {
    this.workspaceMaterialField = workspaceMaterialField;
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
  private WorkspaceMaterialField workspaceMaterialField;
  
  private String value;
}
