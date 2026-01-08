package fi.otavanopisto.muikku.search.annotations;

import java.lang.annotation.Target;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.ElementType;

/**
 * Dumb workaround as same Annotation cannot be nested under itself.
 * If this needs subObjects, add a new annotation as level 3.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface IndexableSubObjectLevel2 {

  String name();
  IndexableSubObjectType type() default IndexableSubObjectType.EMBEDDED;
  IndexableFieldOption[] options() default {};
  
}
