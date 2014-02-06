package fi.muikku.test;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
public @interface TestSqlFiles {

  String[] value();
  
}
