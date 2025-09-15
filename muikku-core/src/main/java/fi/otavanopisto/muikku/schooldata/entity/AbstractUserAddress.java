package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractUserAddress implements UserAddress {
  
  public AbstractUserAddress(
      SchoolDataIdentifier identifier,
      SchoolDataIdentifier userIdentifier,
      String street,
      String postalCode,
      String city,
      String region,
      String country,
      Boolean defaultAddress) {
    super();
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.street = street;
    this.postalCode = postalCode;
    this.city = city;
    this.region = region;
    this.country = country;
    this.defaultAddress = defaultAddress;
  }

  @Override
  public SchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public String getStreet() {
    return street;
  }

  @Override
  public void setStreet(String street) {
    this.street = street;
  }

  @Override
  public String getPostalCode() {
    return postalCode;
  }

  @Override
  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  @Override
  public String getCity() {
    return city;
  }

  @Override
  public void setCity(String city) {
    this.city = city;
  }

  @Override
  public String getRegion() {
    return region;
  }

  @Override
  public void setRegion(String region) {
    this.region = region;
  }

  @Override
  public String getCountry() {
    return country;
  }

  @Override
  public void setCountry(String country) {
    this.country = country;
  }
  
  @Override
  public Boolean getDefaultAddress() {
    return defaultAddress;
  }
  
  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }
  
  public void setIdentifier(SchoolDataIdentifier identifier) {
    this.identifier = identifier;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier userIdentifier;
  private String street;
  private String postalCode;
  private String city;
  private String region;
  private String country;
  private Boolean defaultAddress;
}
