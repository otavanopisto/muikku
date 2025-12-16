package fi.otavanopisto.muikku.schooldata.entity;

public enum GuardianState {

  // Guardian is invited, but doesn't have credentials yet
  INVITED,
  // Guardian has credentials and may act as the Student's Guardian
  ACTIVE,
  // Guardian has credentials but cannot act as the Student's Guardian
  INACTIVE;
  
}
