package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;

@Entity
@Inheritance (strategy = InheritanceType.JOINED)
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
  
  public WorkspaceMaterialField getField() {
    return field;
  }
  
  public void setField(WorkspaceMaterialField field) {
    this.field = field;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterialReply reply;

  @ManyToOne
  private WorkspaceMaterialField field;
  
}
