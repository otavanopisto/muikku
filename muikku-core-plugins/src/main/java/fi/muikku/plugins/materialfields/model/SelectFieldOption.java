package fi.muikku.plugins.materialfields.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class SelectFieldOption implements Serializable {

  private static final long serialVersionUID = -7908385182285507614L;

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

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String optText;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String name;

  @ManyToOne
  private QuerySelectField selectField; //TODO find out why this is not included in generated metamodel
}
