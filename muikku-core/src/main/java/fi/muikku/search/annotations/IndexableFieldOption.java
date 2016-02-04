package fi.muikku.search.annotations;

public @interface IndexableFieldOption {
  
  String name();
  IndexableFieldMultiField[] multiFields() default {};
  String type();
  
}
