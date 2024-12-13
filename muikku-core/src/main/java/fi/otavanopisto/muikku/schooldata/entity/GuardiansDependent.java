package fi.otavanopisto.muikku.schooldata.entity;

import java.time.LocalDate;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface GuardiansDependent {

  SchoolDataIdentifier getUserIdentifier();

  String getFirstName();
  
  String getLastName();

  String getNickName();
  
  String getStudyProgrammeName();

  String getEmail();
  
  String getPhoneNumber();
  
  String getAddress();
  
  LocalDate getStudyStartDate();
  
  LocalDate getStudyTimeEnd();
  
  LocalDate getStudyEndDate();
}
