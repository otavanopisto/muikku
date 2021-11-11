package fi.otavanopisto.muikku.plugins.ceepos.rest;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonSetter;

/**
 * Payload for a purchase order to Ceepos (see API documentation chapter 3.2.1).
 * Some optional fields have been omitted as they are (for now) irrelevant for our purposes.
 */
@JsonPropertyOrder({ "ApiVersion", "Source", "Id", "Mode", "Action", "Description", "Products", "Email", "FirstName", "LastName", "Language", "ReturnAddress", "NotificationAddress", "Hash" })
public class CeeposPaymentRestModel {
  
  public CeeposPaymentRestModel() {
  }

  @JsonGetter("ApiVersion")
  public String getApiVersion() {
    return ApiVersion;
  }

  @JsonSetter("ApiVersion")
  public void setApiVersion(String apiVersion) {
    ApiVersion = apiVersion;
  }

  @JsonGetter("Source")
  public String getSource() {
    return Source;
  }

  @JsonSetter("Source")
  public void setSource(String source) {
    Source = source;
  }

  @JsonGetter("Id")
  public String getId() {
    return Id;
  }

  @JsonSetter("Id")
  public void setId(String id) {
    Id = id;
  }

  @JsonGetter("Mode")
  public Integer getMode() {
    return Mode;
  }

  @JsonSetter("Mode")
  public void setMode(Integer mode) {
    Mode = mode;
  }

  @JsonGetter("Action")
  public String getAction() {
    return Action;
  }

  @JsonSetter("Action")
  public void setAction(String action) {
    Action = action;
  }

  @JsonGetter("Description")
  public String getDescription() {
    return Description;
  }

  @JsonSetter("Description")
  public void setDescription(String description) {
    Description = description;
  }

  @JsonGetter("Products")
  public List<CeeposProductRestModel> getProducts() {
    return Products;
  }

  @JsonSetter("Products")
  public void setProducts(List<CeeposProductRestModel> products) {
    Products = products;
  }

  @JsonGetter("Email")
  public String getEmail() {
    return Email;
  }

  @JsonSetter("Email")
  public void setEmail(String email) {
    Email = email;
  }

  @JsonGetter("FirstName")
  public String getFirstName() {
    return FirstName;
  }

  @JsonSetter("FirstName")
  public void setFirstName(String firstName) {
    FirstName = firstName;
  }

  @JsonGetter("LastName")
  public String getLastName() {
    return LastName;
  }

  @JsonSetter("LastName")
  public void setLastName(String lastName) {
    LastName = lastName;
  }

  @JsonGetter("ReturnAddress")
  public String getReturnAddress() {
    return ReturnAddress;
  }

  @JsonSetter("ReturnAddress")
  public void setReturnAddress(String returnAddress) {
    ReturnAddress = returnAddress;
  }

  @JsonGetter("NotificationAddress")
  public String getNotificationAddress() {
    return NotificationAddress;
  }

  @JsonSetter("NotificationAddress")
  public void setNotificationAddress(String notificationAddress) {
    NotificationAddress = notificationAddress;
  }

  @JsonGetter("Hash")
  public String getHash() {
    return Hash;
  }

  @JsonSetter("Hash")
  public void setHash(String hash) {
    Hash = hash;
  }

  @JsonGetter("Language")
  public String getLanguage() {
    return Language;
  }

  @JsonSetter("Language")
  public void setLanguage(String language) {
    Language = language;
  }

  @JsonProperty("ApiVersion")
  private String ApiVersion;               // required; always 3.0.0

  @JsonProperty("Source")
  private String Source;                   // required; provided by ceepos; plugin setting ceepos.source

  @JsonProperty("Id")
  private String Id;                       // required; our internal order number

  @JsonProperty("Mode")
  private Integer Mode;                    // required; always 3

  @JsonProperty("Action")
  private String Action;                   // required; always new payment

  @JsonProperty("Description")
  private String Description;              // optional; 100 characters of free-form data (e.g. customer name)

  @JsonProperty("Products")
  private List<CeeposProductRestModel> Products;    // required; list of products to buy

  @JsonProperty("Email")
  private String Email;                    // optional; customer's email address

  @JsonProperty("FirstName")
  private String FirstName;                // optional; customer's first name

  @JsonProperty("LastName")
  private String LastName;                 // optional; customer's last name

  @JsonProperty("Language")
  private String Language;                 // optional; two character language code for online payment interface

  @JsonProperty("ReturnAddress")
  private String ReturnAddress;            // required; redirect address when payment is either completed or canceled

  @JsonProperty("NotificationAddress")
  private String NotificationAddress;      // required; programmatic address called when payment is complete

  @JsonProperty("Hash")
  private String Hash;                     // required; calculated from the other values of this object

}
