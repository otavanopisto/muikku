package fi.otavanopisto.muikku.search.annotations;

import java.lang.annotation.Target;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.ElementType;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Indexable {

  String name();
  IndexableFieldOption[] options() default {};
  
}
