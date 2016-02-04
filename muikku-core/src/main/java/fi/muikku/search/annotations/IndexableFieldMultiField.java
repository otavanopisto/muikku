package fi.muikku.search.annotations;

public @interface IndexableFieldMultiField {
  
  String name() default "";
  String type() default "";
  String index() default "";
  
}
