package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.plugins.material.model.QueryChecklistFieldOption;

@Entity
public class WorkspaceMaterialChecklistFieldAnswerOption {
  
  public Long getId() {
    return id;
  }
  
  public WorkspaceMaterialChecklistFieldAnswer getFieldAnswer() {
    return fieldAnswer;
  }
  
  public void setFieldAnswer(WorkspaceMaterialChecklistFieldAnswer fieldAnswer) {
    this.fieldAnswer = fieldAnswer;
  }
  
  public QueryChecklistFieldOption getOption() {
    return option;
  }
  
  public void setOption(QueryChecklistFieldOption option) {
    this.option = option;
  }
 
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterialChecklistFieldAnswer fieldAnswer;
  
  @ManyToOne
  private QueryChecklistFieldOption option;  
}
