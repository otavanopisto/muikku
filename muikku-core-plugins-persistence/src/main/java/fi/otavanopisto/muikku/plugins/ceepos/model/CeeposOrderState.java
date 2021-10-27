package fi.otavanopisto.muikku.plugins.ceepos.model;

public enum CeeposOrderState {

  CREATED,                // payment is created
  ONGOING,                // payment is in progress
  PAID,                   // payment complete, order not yet fulfilled
  CANCELED,               // payment canceled
  ERRORED,                // something unexpected happened
  COMPLETE                // order fulfilled
  
}
