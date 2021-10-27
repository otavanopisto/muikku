package fi.otavanopisto.muikku.plugins.ceepos.rest;

public class CeeposPaymentConfirmationRestModel {

  public String getId() {
    return Id;
  }

  public void setId(String id) {
    Id = id;
  }

  public Integer getStatus() {
    return Status;
  }

  public void setStatus(Integer status) {
    Status = status;
  }

  public String getReference() {
    return Reference;
  }

  public void setReference(String reference) {
    Reference = reference;
  }

  public String getHash() {
    return Hash;
  }

  public void setHash(String hash) {
    Hash = hash;
  }

  private String Id;
  private Integer Status;
  private String Reference;
  private String Hash;

}
