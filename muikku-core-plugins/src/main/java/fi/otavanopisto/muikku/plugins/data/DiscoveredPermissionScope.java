package fi.otavanopisto.muikku.plugins.data;

import javax.inject.Qualifier;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import java.lang.annotation.Retention;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import java.lang.annotation.Target;

@Target({ FIELD, PARAMETER })
@Retention(RUNTIME)
@Qualifier
public @interface DiscoveredPermissionScope {
  String value();
}
