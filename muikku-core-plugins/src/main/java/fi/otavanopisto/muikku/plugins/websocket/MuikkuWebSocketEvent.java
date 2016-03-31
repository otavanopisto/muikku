package fi.otavanopisto.muikku.plugins.websocket;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.inject.Qualifier;

@Qualifier
@Target(value = { ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.TYPE })
@Retention(value = RetentionPolicy.RUNTIME)
public @interface MuikkuWebSocketEvent {

  String value();

}
