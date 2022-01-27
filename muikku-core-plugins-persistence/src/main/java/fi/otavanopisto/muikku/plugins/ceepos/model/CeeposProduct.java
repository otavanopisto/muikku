package fi.otavanopisto.muikku.plugins.ceepos.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class CeeposProduct {

  public Long getId() {
    return id;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Integer getPrice() {
    return price;
  }

  public void setPrice(Integer price) {
    this.price = price;
  }

  public CeeposProductType getType() {
    return type;
  }

  public void setType(CeeposProductType type) {
    this.type = type;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  @NotNull
  @Column(nullable = false, unique = true)
  private String code;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String description;

  @NotNull
  @Column(nullable = false)
  private Integer price;
  
  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private CeeposProductType type;


}
