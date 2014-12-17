package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.plugins.material.model.QueryMultiSelectFieldOption;

@Entity
public class WorkspaceMaterialMultiSelectFieldAnswerOption {
  
  public Long getId() {
    return id;
  }
  
  public WorkspaceMaterialMultiSelectFieldAnswer getFieldAnswer() {
    return fieldAnswer;
  }
  
  public void setFieldAnswer(WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer) {
    this.fieldAnswer = fieldAnswer;
  }
  
  public QueryMultiSelectFieldOption getOption() {
    return option;
  }
  
  public void setOption(QueryMultiSelectFieldOption option) {
    this.option = option;
  }
 
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceMaterialMultiSelectFieldAnswer fieldAnswer;
  
  @ManyToOne
  private QueryMultiSelectFieldOption option;  
}
