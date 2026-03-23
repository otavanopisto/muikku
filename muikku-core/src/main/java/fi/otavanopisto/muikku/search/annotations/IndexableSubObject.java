package fi.otavanopisto.muikku.search.annotations;

import java.lang.annotation.Target;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.ElementType;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface IndexableSubObject {

  String name();
  IndexableSubObjectType type() default IndexableSubObjectType.EMBEDDED;
  IndexableFieldOption[] options() default {};
  IndexableSubObjectLevel2[] subObjects() default {};
  
}
