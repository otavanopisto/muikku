package fi.otavanopisto.muikku.plugins.ceepos.rest;

import java.util.List;

/**
 * Payload for a purchase order to Ceepos (see API documentation chapter 3.2.1).
 * Some optional fields have been omitted as they are (for now) irrelevant for our purposes.
 */
public class CeeposPaymentRestModel {
  
  public CeeposPaymentRestModel() {
  }

  public String getApiVersion() {
    return ApiVersion;
  }

  public void setApiVersion(String apiVersion) {
    ApiVersion = apiVersion;
  }

  public String getSource() {
    return Source;
  }

  public void setSource(String source) {
    Source = source;
  }

  public String getId() {
    return Id;
  }

  public void setId(String id) {
    Id = id;
  }

  public Integer getMode() {
    return Mode;
  }

  public void setMode(Integer mode) {
    Mode = mode;
  }

  public String getAction() {
    return Action;
  }

  public void setAction(String action) {
    Action = action;
  }

  public String getDescription() {
    return Description;
  }

  public void setDescription(String description) {
    Description = description;
  }

  public List<CeeposProductRestModel> getProducts() {
    return Products;
  }

  public void setProducts(List<CeeposProductRestModel> products) {
    Products = products;
  }

  public String getEmail() {
    return Email;
  }

  public void setEmail(String email) {
    Email = email;
  }

  public String getFirstName() {
    return FirstName;
  }

  public void setFirstName(String firstName) {
    FirstName = firstName;
  }

  public String getLastName() {
    return LastName;
  }

  public void setLastName(String lastName) {
    LastName = lastName;
  }

  public String getReturnAddress() {
    return ReturnAddress;
  }

  public void setReturnAddress(String returnAddress) {
    ReturnAddress = returnAddress;
  }

  public String getNotificationAddress() {
    return NotificationAddress;
  }

  public void setNotificationAddress(String notificationAddress) {
    NotificationAddress = notificationAddress;
  }

  public String getHash() {
    return Hash;
  }

  public void setHash(String hash) {
    Hash = hash;
  }

  public String getLanguage() {
    return Language;
  }

  public void setLanguage(String language) {
    Language = language;
  }

  private String ApiVersion;               // required; always 3.0.0
  private String Source;                   // required; provided by ceepos; plugin setting ceepos.source
  private String Id;                       // required; our internal order number
  private Integer Mode;                    // required; always 3
  private String Action;                   // required; always new payment
  private String Description;              // optional; 100 characters of free-form data (e.g. customer name)
  private List<CeeposProductRestModel> Products;    // required; list of products to buy
  private String Email;                    // optional; customer's e-mail address
  private String FirstName;                // optional; customer's first name
  private String LastName;                 // optional; customer's last name
  private String Language;                 // optional; two character language code for online payment interface
  private String ReturnAddress;            // required; redirect address when payment is either completed or canceled
  private String NotificationAddress;      // required; programmatic address called when payment is complete
  private String Hash;                     // required; calculated from the other values of this object

}
