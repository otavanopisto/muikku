package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.LocalDate;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.UserContactInfo;

public class PyramusUserContactInfo implements UserContactInfo {
  
  public PyramusUserContactInfo(String firstName, String lastName, LocalDate dateOfBirth, String phoneNumber,
      String addressName, String streetAddress, String zipCode, String city, String country, String email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
    this.addressName = addressName;
    this.streetAddress = streetAddress;
    this.zipCode = zipCode;
    this.city = city;
    this.country = country;
    this.email = email;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getFirstName() {
    return firstName;
  }

  @Override
  public String getLastName() {
    return lastName; 
  }

  @Override
  public LocalDate getDateOfBirth() {
    return dateOfBirth; 
  }

  @Override
  public String getPhoneNumber() {
    return phoneNumber; 
  }

  @Override
  public String getAddressName() {
    return addressName; 
  }

  @Override
  public String getStreetAddress() {
    return streetAddress; 
  }

  @Override
  public String getZipCode() {
    return zipCode; 
  }

  @Override
  public String getCity() {
    return city; 
  }

  @Override
  public String getCountry() {
    return country; 
  }

  @Override
  public String getEmail() {
    return email; 
  }

  private String firstName;
  private String lastName;
  private LocalDate dateOfBirth;
  private String phoneNumber;
  private String addressName;
  private String streetAddress;
  private String zipCode;
  private String city;
  private String country;
  private String email;

}
