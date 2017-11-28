package fi.otavanopisto.muikku.model.base;

public enum BooleanPredicate {

  TRUE,
  FALSE,
  IGNORE;
  
  public static BooleanPredicate fromBoolean(Boolean b) {
    if (b == null) {
      return IGNORE;
    }
    
    if (Boolean.TRUE.equals(b)) {
      return BooleanPredicate.TRUE;
    }
      
    return FALSE;
  }
  
  public Boolean asBoolean() {
    switch (this) {
      case TRUE:
        return Boolean.TRUE;
      case FALSE:
        return Boolean.FALSE;
      default:
        return null;
    }
  }
}
