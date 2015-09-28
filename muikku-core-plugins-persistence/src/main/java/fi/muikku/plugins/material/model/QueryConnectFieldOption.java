package fi.muikku.plugins.material.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class QueryConnectFieldOption {

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
  
  public String getText() {
    return text;
  }
  
  public void setText(String text) {
    this.text = text;
  }
  
  public QueryConnectField getField() {
    return field;
  }
  
  public void setField(QueryConnectField field) {
    this.field = field;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  private String text;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String name;

  @ManyToOne
  private QueryConnectField field; 
}
