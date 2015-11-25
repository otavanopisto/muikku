package fi.muikku.schooldata.entity;

import fi.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractUserPhoneNumber implements UserPhoneNumber {

  public AbstractUserPhoneNumber(SchoolDataIdentifier userIdentifier, String number) {
    super();
    this.userIdentifier = userIdentifier;
    this.number = number;
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
  
  private SchoolDataIdentifier userIdentifier;
  private String number;
}
