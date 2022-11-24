package fi.otavanopisto.muikku.search.annotations;

public @interface IndexableFieldMultiField {
  
  String name();
  IndexableFieldType type();
  boolean index() default true;
  
}
