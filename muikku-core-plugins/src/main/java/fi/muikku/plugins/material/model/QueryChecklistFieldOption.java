package fi.muikku.plugins.material.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class QueryChecklistFieldOption {

  public Long getId() {
    return id;
  }

  public String getText() {
    return text;
  }
  
  public void setText(String text) {
    this.text = text;
  }
  
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public QueryChecklistField getField() {
    return field;
  }
  
  public void setField(QueryChecklistField field) {
    this.field = field;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String text;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String name;

  @ManyToOne
  private QueryChecklistField field; 
}
