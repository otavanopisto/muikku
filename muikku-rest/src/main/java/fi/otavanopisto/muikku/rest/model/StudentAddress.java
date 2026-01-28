package fi.otavanopisto.muikku.rest.model;

public class StudentAddress {

  public StudentAddress() {
  }

  public StudentAddress(String identifier, String studentIdentifier, String street, String postalCode, String city, String region,
      String country, Boolean defaultAddress) {
    super();
    this.identifier = identifier;
    this.studentIdentifier = studentIdentifier;
    this.street = street;
    this.postalCode = postalCode;
    this.city = city;
    this.region = region;
    this.country = country;
    this.defaultAddress = defaultAddress;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public String getStreet() {
    return street;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public String getPostalCode() {
    return postalCode;
  }

  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getRegion() {
    return region;
  }

  public void setRegion(String region) {
    this.region = region;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public Boolean getDefaultAddress() {
    return defaultAddress;
  }

  public void setDefaultAddress(Boolean defaultAddress) {
    this.defaultAddress = defaultAddress;
  }
  
  public String getIdentifier() {
    return identifier;
  }
  
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  private String identifier;
  private String studentIdentifier;
  private String street;
  private String postalCode;
  private String city;
  private String region;
  private String country;
  private Boolean defaultAddress;
}
