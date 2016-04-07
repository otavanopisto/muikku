package fi.otavanopisto.muikku.search.annotations;

public @interface IndexableFieldOption {
  
  String name();
  IndexableFieldMultiField[] multiFields() default {};
  String type();
  String index() default "";
}
