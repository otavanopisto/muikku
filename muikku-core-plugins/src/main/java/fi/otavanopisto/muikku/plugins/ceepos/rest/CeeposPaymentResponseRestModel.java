package fi.otavanopisto.muikku.plugins.ceepos.rest;

/**
 * Response object to a payment request to Ceepos (see API documentation chapter 3.2.4).
 */
public class CeeposPaymentResponseRestModel {

  public CeeposPaymentResponseRestModel() {
  }

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

  public String getAction() {
    return Action;
  }

  public void setAction(String action) {
    Action = action;
  }

  public String getPaymentAddress() {
    return PaymentAddress;
  }

  public void setPaymentAddress(String paymentAddress) {
    PaymentAddress = paymentAddress;
  }

  public String getHash() {
    return Hash;
  }

  public void setHash(String hash) {
    Hash = hash;
  }

  private String Id; // our order number originally sent with the payment request
  private Integer Status; // always 2 (processing payment) see api documentation 3.6
  private String Reference; // order number in Ceepos
  private String Action; // always new payment
  private String PaymentAddress; // the address to which the user should be redirected
  private String Hash; // calculated from the other values of this object; null if error

}
