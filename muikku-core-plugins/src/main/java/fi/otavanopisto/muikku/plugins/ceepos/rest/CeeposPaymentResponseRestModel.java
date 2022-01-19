package fi.otavanopisto.muikku.plugins.ceepos.rest;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonSetter;

/**
 * Response object to a payment request to Ceepos (see API documentation chapter 3.2.4).
 */
@JsonPropertyOrder({ "Id", "Status", "Reference", "Action", "PaymentAddress", "Hash" })
public class CeeposPaymentResponseRestModel {

  public CeeposPaymentResponseRestModel() {
  }

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

  @JsonGetter("Action")
  public String getAction() {
    return Action;
  }

  @JsonSetter("Action")
  public void setAction(String action) {
    Action = action;
  }

  @JsonGetter("PaymentAddress")
  public String getPaymentAddress() {
    return PaymentAddress;
  }

  @JsonSetter("PaymentAddress")
  public void setPaymentAddress(String paymentAddress) {
    PaymentAddress = paymentAddress;
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
  private String Id; // our order number originally sent with the payment request

  @JsonProperty("Status")
  private Integer Status; // always 2 (processing payment) see api documentation 3.6

  @JsonProperty("Reference")
  private String Reference; // order number in Ceepos

  @JsonProperty("Action")
  private String Action; // always new payment

  @JsonProperty("PaymentAddress")
  private String PaymentAddress; // the address to which the user should be redirected

  @JsonProperty("Hash")
  private String Hash; // calculated from the other values of this object; null if error

}
