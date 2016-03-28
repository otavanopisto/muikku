package fi.otavanopisto.muikku.model.base;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class Tag {

  public Long getId() {
    return id;
  }
  
  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false, unique = true)
  private String text;
}
