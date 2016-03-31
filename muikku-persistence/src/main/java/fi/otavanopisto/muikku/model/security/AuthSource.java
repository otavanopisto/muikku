package fi.otavanopisto.muikku.model.security;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class AuthSource {

  public Long getId() {
    return id;
  }
  
  public String getStrategy() {
    return strategy;
  }
  
  public void setStrategy(String strategy) {
    this.strategy = strategy;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @NotEmpty
  @Column (nullable = false)
  private String strategy;

  @NotBlank
  @NotEmpty
  @Column (nullable = false)
  private String name;

}
