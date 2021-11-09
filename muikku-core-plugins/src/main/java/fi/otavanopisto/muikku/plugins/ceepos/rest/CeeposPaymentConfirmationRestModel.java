package fi.otavanopisto.muikku.plugins.ceepos.rest;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

public class CeeposPaymentConfirmationRestModel {

  @JsonGetter("Id")
  public String getId() {
    return Id;
  }

  @JsonSetter("Id")
  public void setId(String id) {
    Id = id;
  }

  @JsonGetter("Status")
  public Integer getStatus() {
    return Status;
  }

  @JsonSetter("Status")
  public void setStatus(Integer status) {
    Status = status;
  }

  @JsonGetter("Reference")
  public String getReference() {
    return Reference;
  }

  @JsonSetter("Reference")
  public void setReference(String reference) {
    Reference = reference;
  }

  @JsonGetter("Hash")
  public String getHash() {
    return Hash;
  }

  @JsonSetter("Hash")
  public void setHash(String hash) {
    Hash = hash;
  }

  @JsonProperty("Id")
  private String Id;

  @JsonProperty("Status")
  private Integer Status;

  @JsonProperty("Reference")
  private String Reference;

  @JsonProperty("Hash")
  private String Hash;

}
