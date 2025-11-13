package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractUserPhoneNumber implements UserPhoneNumber {

  public AbstractUserPhoneNumber(SchoolDataIdentifier userIdentifier, String number, Boolean defaultNumber) {
    super();
    this.userIdentifier = userIdentifier;
    this.number = number;
    this.defaultNumber = defaultNumber;
  }

  @Override
  public SchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public String getNumber() {
    return number;
  }

  @Override
  public void setNumber(String number) {
    this.number = number;
  }
  
  @Override
  public Boolean getDefaultNumber() {
    return defaultNumber;
  }
  
  private SchoolDataIdentifier userIdentifier;
  private String number;
  private Boolean defaultNumber;
}
