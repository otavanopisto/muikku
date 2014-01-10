package fi.muikku.plugins.materialfields.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class SelectFieldOption {

  public Long getId() {
    return id;
  }

  public String getOptText() {
    return optText;
  }

  public void setOptText(String optText) {
    this.optText = optText;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public QuerySelectField getSelectField() {
    return selectField;
  }

  public void setSelectField(QuerySelectField selectField) {
    this.selectField = selectField;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String optText;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String name;

  @ManyToOne
  private QuerySelectField selectField; 
}
