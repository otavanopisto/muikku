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
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Inheritance (strategy = InheritanceType.JOINED)
public class CeeposOrder {

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

  public String getCeeposPaymentAddress() {
    return ceeposPaymentAddress;
  }

  public void setCeeposPaymentAddress(String ceeposPaymentAddress) {
    this.ceeposPaymentAddress = ceeposPaymentAddress;
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

  public CeeposProduct getProduct() {
    return product;
  }

  public void setProduct(CeeposProduct product) {
    this.product = product;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Long getCreator() {
    return creator;
  }

  public void setCreator(Long creator) {
    this.creator = creator;
  }

  public Long getLastModifier() {
    return lastModifier;
  }

  public void setLastModifier(Long lastModifier) {
    this.lastModifier = lastModifier;
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

  @Column
  private String ceeposPaymentAddress;

  @ManyToOne
  private CeeposProduct product;

  @NotNull
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private CeeposOrderState state;

  @NotNull
  @Column(nullable = false)
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date created;

  @NotNull
  @Column(nullable = false, name = "creator_id")
  private Long creator;

  @NotNull
  @Column(nullable = false)
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date lastModified;

  @NotNull
  @Column(nullable = false, name = "lastModifier_id")
  private Long lastModifier;

  @NotNull
  @Column(nullable = false)
  private Boolean archived;

}