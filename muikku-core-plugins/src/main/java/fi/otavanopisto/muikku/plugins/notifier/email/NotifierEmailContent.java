package fi.otavanopisto.muikku.plugins.notifier.email;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.inject.Qualifier;

@Qualifier
@Target({ ElementType.TYPE, ElementType.METHOD, PARAMETER, FIELD })
@Retention(RUNTIME)
@Documented
public @interface NotifierEmailContent {

  String value();

}
