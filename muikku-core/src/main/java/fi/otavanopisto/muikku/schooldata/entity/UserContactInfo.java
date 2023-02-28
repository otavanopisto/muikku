package fi.otavanopisto.muikku.schooldata.entity;

import java.time.LocalDate;

public interface UserContactInfo extends SchoolDataEntity {

  public String getFirstName();
  public String getLastName();
  public LocalDate getDateOfBirth();
  public String getPhoneNumber();
  public String getAddressName();
  public String getStreetAddress();
  public String getZipCode();
  public String getCity();
  public String getCountry();
  public String getEmail();

}
