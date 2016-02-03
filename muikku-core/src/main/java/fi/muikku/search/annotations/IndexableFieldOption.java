package fi.muikku.search.annotations;

public @interface IndexableFieldOption {
  
  String name() default "";
  IndexableFieldMultiField[] multiFields() default {};
  String type() default "";
  
}
