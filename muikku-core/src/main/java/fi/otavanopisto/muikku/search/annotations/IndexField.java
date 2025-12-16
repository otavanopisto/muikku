package fi.otavanopisto.muikku.search.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD,ElementType.METHOD })
public @interface IndexField {

  String name() default "";
  boolean skip() default false;
  boolean toId() default false;
  // Instruct the processor to handle this as a collection of ("complex") objects
  boolean collection() default false;
  // Type determines how the data should be processed
  IndexFieldType type() default IndexFieldType.DEFAULT;
}
