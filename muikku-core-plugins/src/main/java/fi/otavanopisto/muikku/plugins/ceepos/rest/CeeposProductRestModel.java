package fi.otavanopisto.muikku.plugins.ceepos.rest;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonSetter;

/**
 * Single product within a Ceepos order (see API documentation chapter 3.2.1).
 * Some optional fields have been omitted as they are (for now) irrelevant for our purposes.
 */
@JsonPropertyOrder({ "Code", "Amount", "Price", "Description" })
public class CeeposProductRestModel {
  
  public CeeposProductRestModel() {
  }

  public CeeposProductRestModel(String code, Integer amount, Integer price, String description) {
    Code = code;
    Amount = amount;
    Price = price;
    Description = description;
  }

  @JsonGetter("Code")
  public String getCode() {
    return Code;
  }

  @JsonSetter("Code")
  public void setCode(String code) {
    Code = code;
  }

  @JsonGetter("Description")
  public String getDescription() {
    return Description;
  }

  @JsonSetter("Description")
  public void setDescription(String description) {
    Description = description;
  }

  @JsonGetter("Price")
  public Integer getPrice() {
    return Price;
  }

  @JsonSetter("Price")
  public void setPrice(Integer price) {
    Price = price;
  }

  @JsonGetter("Amount")
  public Integer getAmount() {
    return Amount;
  }

  @JsonSetter("Amount")
  public void setAmount(Integer amount) {
    Amount = amount;
  }

  @JsonProperty("Code")
  private String Code;                 // required; product code in Ceepos webstore

  @JsonProperty("Amount")
  private Integer Amount;               // optional; number of products to buy

  @JsonProperty("Description")
  private String Description;          // optional; 100 characters of free-form data to describe the product

  @JsonProperty("Price")
  private Integer Price;               // optional; unit price in cents including tax (if omitted, uses price in webstore)

}
