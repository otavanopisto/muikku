package fi.otavanopisto.muikku.plugins.ceepos.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.util.ArchivableEntity;

@Entity
@Inheritance (strategy = InheritanceType.JOINED)
public class CeeposOrder implements ArchivableEntity {

  public Long getId() {
    return id;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public void setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }

  public String getCeeposOrderNumber() {
    return ceeposOrderNumber;
  }

  public void setCeeposOrderNumber(String ceeposOrderNumber) {
    this.ceeposOrderNumber = ceeposOrderNumber;
  }

  public CeeposOrderState getState() {
    return state;
  }

  public void setState(CeeposOrderState state) {
    this.state = state;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Long getCreatorId() {
    return creatorId;
  }

  public void setCreatorId(Long creatorId) {
    this.creatorId = creatorId;
  }

  public Long getLastModifierId() {
    return lastModifierId;
  }

  public void setLastModifierId(Long lastModifierId) {
    this.lastModifierId = lastModifierId;
  }

  public String getProductDescription() {
    return productDescription;
  }

  public void setProductDescription(String productDescription) {
    this.productDescription = productDescription;
  }

  public Integer getProductPrice() {
    return productPrice;
  }

  public void setProductPrice(Integer productPrice) {
    this.productPrice = productPrice;
  }

  public String getProductCode() {
    return productCode;
  }

  public void setProductCode(String productCode) {
    this.productCode = productCode;
  }

  public Long getProductId() {
    return productId;
  }

  public void setProductId(Long productId) {
    this.productId = productId;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String userIdentifier;
  
  @Column
  private String ceeposOrderNumber;

  @NotNull
  @Column(nullable = false)
  private Long productId;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String productCode;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String productDescription;

  @NotNull
  @Column(nullable = false)
  private Integer productPrice;

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private CeeposOrderState state;

  @NotNull
  @Column(nullable = false)
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date created;

  @NotNull
  @Column(nullable = false)
  private Long creatorId;

  @NotNull
  @Column(nullable = false)
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date lastModified;

  @NotNull
  @Column(nullable = false)
  private Long lastModifierId;

  @NotNull
  @Column(nullable = false)
  private Boolean archived;

}