package fi.otavanopisto.muikku.plugins.ceepos.rest;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;

public class CeeposOrderRestModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public CeeposProductRestModel getProduct() {
    return product;
  }

  public void setProduct(CeeposProductRestModel product) {
    this.product = product;
  }

  public CeeposOrderState getState() {
    return state;
  }

  public void setState(CeeposOrderState state) {
    this.state = state;
  }

  public OffsetDateTime getCreated() {
    return created;
  }

  public void setCreated(OffsetDateTime created) {
    this.created = created;
  }

  public OffsetDateTime getPaid() {
    return paid;
  }

  public void setPaid(OffsetDateTime paid) {
    this.paid = paid;
  }

  private Long id;
  private String studentIdentifier;
  private CeeposProductRestModel product;
  private CeeposOrderState state;
  private OffsetDateTime paid;
  private OffsetDateTime created;

}
