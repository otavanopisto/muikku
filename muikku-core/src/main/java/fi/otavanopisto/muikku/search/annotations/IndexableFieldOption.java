package fi.otavanopisto.muikku.search.annotations;

public @interface IndexableFieldOption {
  
  String name();
  IndexableFieldMultiField[] multiFields() default {};
  IndexableFieldType type();
  boolean index() default true;
  boolean sortable() default false;
  
}
