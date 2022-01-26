package fi.otavanopisto.muikku.plugins.ceepos.model;

public enum CeeposOrderState {

  CREATED,                // payment is created
  ONGOING,                // payment is in progress
  PAID,                   // payment complete, order not yet fulfilled
  CANCELLED,              // payment cancelled
  ERRORED,                // something unexpected happened
  COMPLETE                // order fulfilled
  
}
