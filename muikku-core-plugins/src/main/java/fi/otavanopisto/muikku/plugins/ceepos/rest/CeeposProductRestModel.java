package fi.otavanopisto.muikku.plugins.ceepos.rest;

/**
 * Single product within a Ceepos payment (see API documentation chapter 3.2.1).
 * Some optional fields have been omitted as they are (for now) irrelevant for our purposes.
 */
public class CeeposProductRestModel {
  
  public CeeposProductRestModel() {
  }

  public CeeposProductRestModel(String code, String description, Integer price) {
    Code = code;
    Description = description;
    Price = price;
  }

  public String getCode() {
    return Code;
  }

  public void setCode(String code) {
    Code = code;
  }

  public String getDescription() {
    return Description;
  }

  public void setDescription(String description) {
    Description = description;
  }

  public Integer getPrice() {
    return Price;
  }

  public void setPrice(Integer price) {
    Price = price;
  }

  private String Code;                 // required; product code in Ceepos webstore
  private String Description;          // optional; 100 characters of free-form data to describe the product
  private Integer Price;               // optional; unit price in cents including tax (if omitted, uses price in webstore)

}
