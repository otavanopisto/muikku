package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractUserEmail implements UserEmail {
  
  public AbstractUserEmail(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, String address,
      Boolean defaultAddress) {
    super();
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.address = address;
    this.defaultAddress = defaultAddress;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public SchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public String getAddress() {
    return address;
  }

  @Override
  public void setAddress(String address) {
    this.address = address;
  }

  @Override
  public Boolean getDefaultAddress() {
    return defaultAddress;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier userIdentifier;
  private String address;
  private Boolean defaultAddress;
}
