package fi.otavanopisto.muikku.plugins.websocket;

import javax.enterprise.util.AnnotationLiteral;

public class MuikkuWebSocketEventLiteral extends AnnotationLiteral<MuikkuWebSocketEvent> implements MuikkuWebSocketEvent {

  private static final long serialVersionUID = 3230959024470083317L;

  public MuikkuWebSocketEventLiteral(String value) {
    this.value = value;
  }

  @Override
  public String value() {
    return value;
  }
  
  private String value;
}
