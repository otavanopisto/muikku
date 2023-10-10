package fi.otavanopisto.muikku.search.annotations;

public enum IndexableSubObjectType {
  
  /**
   * Sub Object is embedded as part of the document itself.
   * The Indexing engine may handle the properties of the
   * Sub Object the way it wants to.
   */
  EMBEDDED,
  
  /**
   * Sub Object functions as its own entity for cases where
   * searching needs to match multiple fields of the object
   * simultaneously.
   */
  NESTED
  
}
