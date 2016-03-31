package fi.otavanopisto.muikku.search.annotations;

public @interface IndexableFieldMultiField {
  
  String name() default "";
  String type() default "";
  String index() default "";
  
}
