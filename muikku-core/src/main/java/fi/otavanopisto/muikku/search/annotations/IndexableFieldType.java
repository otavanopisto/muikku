package fi.otavanopisto.muikku.search.annotations;

public enum IndexableFieldType {
  
  /**
   * String that is analyzed and broken into tokens
   */
  TEXT,
  
  /**
   * String that is not analyzed
   */
  KEYWORD,
  
  /**
   * Date
   */
  DATE
  
}
